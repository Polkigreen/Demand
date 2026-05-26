import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe | null = null;
  private mockMode = false;

  constructor(private readonly config: ConfigService) {
    const secretKey = this.config.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      this.mockMode = true;
      this.logger.warn('STRIPE_SECRET_KEY missing — running in MOCK mode.');
    } else {
      this.stripe = new Stripe(secretKey, { apiVersion: '2023-10-16' });
      this.logger.log('Stripe initialized in LIVE mode.');
    }
  }

  // ── Connect Accounts ──────────────────────────────────────────────────────

  async createHelperStripeAccount(email: string, name: string) {
    if (this.mockMode) {
      return { accountId: `mock-acct-${Date.now()}`, mock: true };
    }
    const account = await this.stripe!.accounts.create({
      type: 'express',
      country: 'SE',
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_profile: { product_description: `Demand Marketplace Helper: ${name}` },
    });
    return { accountId: account.id };
  }

  async createAccountOnboardingLink(accountId: string, returnUrl: string) {
    if (this.mockMode) {
      return { url: `${returnUrl}?mock_onboarding=complete` };
    }
    const link = await this.stripe!.accountLinks.create({
      account: accountId,
      refresh_url: `${returnUrl}?refresh=true`,
      return_url: returnUrl,
      type: 'account_onboarding',
    });
    return { url: link.url };
  }

  // ── Escrow / Payment Intents ───────────────────────────────────────────────

  async holdEscrow(
    amount: number, // in SEK
    bookingId: string,
    metadata: Record<string, string> = {},
  ) {
    if (this.mockMode) {
      return {
        paymentIntentId: `mock-pi-${bookingId}`,
        clientSecret: `mock-secret-${bookingId}`,
        status: 'requires_payment_method',
      };
    }
    const intent = await this.stripe!.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert SEK → öre
      currency: 'sek',
      payment_method_types: ['card', 'klarna'],
      capture_method: 'manual',
      transfer_group: `booking_${bookingId}`,
      metadata: { bookingId, ...metadata },
    });
    return {
      paymentIntentId: intent.id,
      clientSecret: intent.client_secret,
      status: intent.status,
    };
  }

  async releaseEscrow(
    paymentIntentId: string,
    helperStripeAccountId: string,
    totalAmount: number,
  ) {
    if (this.mockMode) {
      return { captured: true, transferId: `mock-tr-${Date.now()}` };
    }
    // 1. Capture the funds
    await this.stripe!.paymentIntents.capture(paymentIntentId);

    // 2. Transfer 90% to helper (10% platform commission)
    const platformFee = totalAmount * 0.1;
    const helperAmount = totalAmount - platformFee;

    const transfer = await this.stripe!.transfers.create({
      amount: Math.round(helperAmount * 100),
      currency: 'sek',
      destination: helperStripeAccountId,
      transfer_group: `booking_${paymentIntentId}`,
    });
    return { captured: true, transferId: transfer.id };
  }

  async refundEscrow(paymentIntentId: string) {
    if (this.mockMode) {
      return { refunded: true, refundId: `mock-rf-${Date.now()}` };
    }
    const refund = await this.stripe!.refunds.create({
      payment_intent: paymentIntentId,
    });
    return { refunded: true, refundId: refund.id };
  }

  // ── Webhooks ──────────────────────────────────────────────────────────────

  parseWebhookEvent(rawBody: Buffer, signature: string): Stripe.Event {
    const webhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret || this.mockMode) {
      return JSON.parse(rawBody.toString()) as Stripe.Event;
    }
    return this.stripe!.webhooks.constructEvent(rawBody, signature, webhookSecret);
  }
}
