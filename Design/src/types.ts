export interface TaskRequest {
  id: string;
  title: string;
  category: "Car Help" | "Event Prep" | "Assembly" | "Pet Care" | "Tech Support";
  description: string;
  budget: number; // in kr
  location: string;
  date: string;
  time: string;
  status: "Open" | "Assigned" | "Completed" | "Cancelled";
  appliedCount: number;
  urgent: boolean;
  creator: {
    name: string;
    avatar: string;
    distance: string;
  };
  createdAt: string;
  photoUrl?: string;
}

export interface ChatMessage {
  id: string;
  senderId: "sender" | "recipient"; // "sender" is Alex Jensen, "recipient" is Sarah Miller (or others)
  text: string;
  timestamp: string;
  offer?: {
    id: string;
    itemTitle: string;
    price: number;
    date: string;
    status: "pending" | "accepted" | "declined";
  };
}

export interface ChatSession {
  id: string;
  helperName: string;
  helperAvatar: string;
  taskTitle: string;
  taskBudget: number;
  lastMessage: string;
  lastMessageTime: string;
  messages: ChatMessage[];
  unread?: boolean;
}

export interface HelperProfile {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  distance: string;
  bio: string;
  skills: string[];
  rateHour: number;
  responseRate: string;
  typicalResponseTime: string;
  verified: boolean;
  examples: {
    title: string;
    imageUrl: string;
  }[];
}

export type AppView = "home" | "requests" | "create" | "inbox" | "profile" | "category" | "chat";

export interface DashboardSchedule {
  day: string;
  slots: {
    morning: boolean; // 08:00 - 12:00
    afternoon: boolean; // 12:00 - 17:00
    evening: boolean; // 17:00 - 21:00
  };
}
