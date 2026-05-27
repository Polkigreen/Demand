import { api } from "./api";

export interface ChatThread {
  bookingId: string;
  requestId: string;
  taskTitle: string;
  price: number;
  partnerName: string;
  partnerId: string;
  partnerBankidVerified: boolean;
  lastMessage: string | null;
  lastMessageAt: string;
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string };
}

export function fetchThreads() {
  return api<ChatThread[]>("/messages/threads");
}

export function fetchMessages(bookingId: string) {
  return api<ChatMessage[]>(`/messages/booking/${bookingId}`);
}

export function sendMessage(bookingId: string, content: string) {
  return api<ChatMessage>(`/messages/booking/${bookingId}`, {
    method: "POST",
    body: { content },
  });
}
