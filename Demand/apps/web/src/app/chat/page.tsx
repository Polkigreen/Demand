"use client";

import { useState } from "react";
import { Send, MapPin, ShieldCheck, Phone, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

interface ChatThread {
  id: string;
  partnerName: string;
  taskTitle: string;
  price: number;
  lastMessage: string;
  bankidVerified: boolean;
  avatarLetter: string;
  messages: ChatMessage[];
}

const INITIAL_THREADS: ChatThread[] = [
  {
    id: "t1",
    partnerName: "Sven Svensson",
    taskTitle: "Change Winter Tires on Volvo XC60",
    price: 600,
    lastMessage: "Sounds great! I will be there at 14:00 tomorrow.",
    bankidVerified: true,
    avatarLetter: "S",
    messages: [
      {
        id: "m1",
        senderId: "other",
        text: "Hej! I saw your post about tire shifting. I have years of experience and can help tomorrow afternoon.",
        timestamp: "10:30",
      },
      {
        id: "m2",
        senderId: "me",
        text: "Hej Sven! Excellent. Do you have your own jack, or do you want to use mine?",
        timestamp: "10:32",
      },
      {
        id: "m3",
        senderId: "other",
        text: "I can bring my hydraulic jack just in case. It makes the work faster.",
        timestamp: "10:35",
      },
      {
        id: "m4",
        senderId: "me",
        text: "Perfect. Does 14:00 work for you?",
        timestamp: "10:36",
      },
      {
        id: "m5",
        senderId: "other",
        text: "Sounds great! I will be there at 14:00 tomorrow.",
        timestamp: "10:38",
      },
    ],
  },
  {
    id: "t2",
    partnerName: "Emma Bergqvist",
    taskTitle: "Setup Midsummer Party Decorations",
    price: 1800,
    lastMessage: "I will order the decorations today. See you on Friday!",
    bankidVerified: true,
    avatarLetter: "E",
    messages: [
      {
        id: "m6",
        senderId: "other",
        text: "Hi! Can you let me know what color scheme you prefer for the lanterns?",
        timestamp: "Yesterday",
      },
      {
        id: "m7",
        senderId: "me",
        text: "We would love classic Swedish midsummer colors - blue, yellow, and lots of greens!",
        timestamp: "Yesterday",
      },
      {
        id: "m8",
        senderId: "other",
        text: "I will order the decorations today. See you on Friday!",
        timestamp: "Yesterday",
      },
    ],
  },
];

export default function ChatPage() {
  const { user } = useAuthStore();
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_THREADS);
  const [activeThreadId, setActiveThreadId] = useState("t1");
  const [inputMessage, setInputMessage] = useState("");

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: `new-${Date.now()}`,
      senderId: "me",
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setThreads((prevThreads) =>
      prevThreads.map((thread) => {
        if (thread.id === activeThreadId) {
          return {
            ...thread,
            lastMessage: inputMessage,
            messages: [...thread.messages, newMessage],
          };
        }
        return thread;
      })
    );

    setInputMessage("");
  };

  return (
    <div className="glass-card rounded-2xl border border-slate-800 shadow-xl overflow-hidden h-[75vh] flex">
      
      {/* Threads list */}
      <div className="w-1/3 border-r border-slate-800 flex flex-col bg-slate-950/20">
        <div className="p-4 border-b border-slate-900">
          <h3 className="font-bold text-lg text-slate-200">Active Conversations</h3>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-900/50">
          {threads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => setActiveThreadId(thread.id)}
              className={`w-full text-left p-4 hover:bg-slate-900/40 transition-colors flex gap-3 items-start ${
                activeThreadId === thread.id ? "bg-slate-900/60 border-l-2 border-teal-500" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-teal-400 shrink-0 border border-slate-700">
                {thread.avatarLetter}
              </div>
              <div className="space-y-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm truncate flex items-center gap-1">
                    {thread.partnerName}
                    {thread.bankidVerified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                    )}
                  </span>
                </div>
                <div className="text-xs text-slate-350 truncate">{thread.taskTitle}</div>
                <div className="text-[11px] text-slate-500 truncate">{thread.lastMessage}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Messages window */}
      <div className="flex-1 flex flex-col bg-slate-950/10">
        {/* Thread Header */}
        <div className="p-4 border-b border-slate-900 flex justify-between items-center bg-slate-950/25">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-teal-400 border border-slate-700">
              {activeThread.avatarLetter}
            </div>
            <div>
              <h4 className="font-bold text-sm flex items-center gap-1">
                {activeThread.partnerName}
                {activeThread.bankidVerified && (
                  <ShieldCheck className="w-4 h-4 text-teal-400 fill-teal-400/10" />
                )}
              </h4>
              <p className="text-xs text-slate-400">{activeThread.taskTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-1 rounded-md">
              {activeThread.price} SEK
            </span>
            <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all">
              <Phone className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeThread.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === "me" ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[70%] space-y-1">
                <div
                  className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                    msg.senderId === "me"
                      ? "bg-teal-500 text-slate-950 rounded-tr-none font-medium"
                      : "bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/50"
                  }`}
                >
                  {msg.text}
                </div>
                <div
                  className={`text-[10px] text-slate-500 px-1 ${
                    msg.senderId === "me" ? "text-right" : "text-left"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Messages Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-900 bg-slate-950/20 flex gap-3">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-850 focus:border-teal-500 focus:outline-none transition-colors text-sm placeholder:text-slate-650"
          />
          <button
            type="submit"
            className="p-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 transition-all shadow-md shadow-teal-500/10"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
}
