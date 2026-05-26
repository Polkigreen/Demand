/**
 * Validates a Swedish personal number (Personnummer or Samordningsnummer)
 * using the Luhn algorithm.
 * Expects formats like: YYYYMMDD-XXXX, YYMMDD-XXXX, or digits-only.
 */
export function isValidPersonnummer(pin: string): boolean {
  if (!pin) return false;
  // Remove non-digit characters
  const cleanPin = pin.replace(/\D/g, "");

  // Must be 10 or 12 digits
  if (cleanPin.length !== 10 && cleanPin.length !== 12) {
    return false;
  }

  // Get the 10 digit version (YYMMDDXXXX)
  const tenDigit = cleanPin.length === 12 ? cleanPin.substring(2) : cleanPin;

  // Luhn algorithm check
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    let num = parseInt(tenDigit[i], 10);
    if (isNaN(num)) return false;

    // Double every second digit starting from index 0
    if (i % 2 === 0) {
      num *= 2;
      if (num > 9) {
        num -= 9;
      }
    }
    sum += num;
  }

  return sum % 10 === 0;
}

export type UserRole = "REQUESTER" | "HELPER";

export interface UserDto {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  roles: UserRole[];
  bankidVerified: boolean;
  avatarUrl?: string;
}

export interface BankIdSessionResponse {
  orderRef: string;
  autoStartToken: string;
  qrStartToken: string;
  qrStartSecret: string;
}

export interface AuthSuccessResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}
