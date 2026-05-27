"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Phone, MoreVertical, Lock, Wrench, PlusCircle, Send, ShieldCheck, Clock, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { fetchThreads, fetchMessages, sendMessage, ChatThread, ChatMessage } from "@/lib/messages";

export default function ChatPage() {
  const { user } = useAuthStore();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchThreads()
      .then((data) => {
        setThreads(data);
        if (data.length > 0) setActiveThreadId(data[0].bookingId);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeThreadId) return;
    fetchMessages(activeThreadId).then(setMessages).catch(() => {});
  }, [activeThreadId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeThread = threads.find((t) => t.bookingId === activeThreadId);

  const handleSend = async () => {
    if (!inputMessage.trim() || !activeThreadId) return;
    const sent = await sendMessage(activeThreadId, inputMessage);
    setMessages((prev) => [...prev, sent]);
    setInputMessage("");
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent animate-spin rounded-full mx-auto" />
        <p className="text-gray-500 text-sm mt-4">Loading conversations...</p>
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="py-16 text-center space-y-3 bg-brand-surface rounded-2xl border border-dashed border-[#44210c]">
        <p className="text-gray-400 font-bold">No active conversations yet.</p>
        <p className="text-gray-500 text-sm">Apply to a request and once accepted, chat will appear here.</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] sm:h-[calc(100vh-100px)] flex flex-col">
      {activeThread === null ? (
        <div className="flex-1 overflow-y-auto space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase font-display">My Inbox</h1>
            <p className="text-sm text-gray-400">Negotiate details, accept helper offers, or check protection states.</p>
          </div>
          <div className="space-y-3.5">
            {threads.map((thread) => (
              <div key={thread.bookingId} onClick={() => setActiveThreadId(thread.bookingId)}
                className="bg-brand-surface border border-[#44210c] hover:border-brand-accent/50 p-4.5 rounded-2xl flex items-center justify-between gap-4 cursor-pointer transition-all glowing-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-accent/20 border-2 border-brand-accent/40 flex items-center justify-center font-bold text-brand-accent">
                    {thread.partnerName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-white text-base">{thread.partnerName}</h3>
                      <span className="text-[10px] bg-brand-accent-faded text-brand-accent font-extrabold px-2 py-0.5 rounded-md uppercase">{thread.taskTitle}</span>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm line-clamp-1 mt-0.5">{thread.lastMessage || "No messages yet"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col h-full bg-brand-surface border border-[#44210c] rounded-3xl relative overflow-hidden">
          {activeThread && (
            <>
              <div className="p-4 border-b border-[#44210c] bg-brand-card flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveThreadId(null)}
                    className="p-2 text-gray-400 hover:text-white rounded-xl bg-brand-surface/40 hover:bg-brand-surface active:scale-95 transition-all">
                    <ArrowLeft className="h-4.5 w-4.5" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-brand-accent/20 border-2 border-brand-accent/40 flex items-center justify-center font-bold text-brand-accent">
                    {activeThread.partnerName[0]}
                  </div>
                  <div>
                    <h1 className="text-sm sm:text-base font-extrabold text-white leading-tight">{activeThread.partnerName}</h1>
                    <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">
                      {activeThread.taskTitle} • {activeThread.price} kr
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-brand-accent hover:bg-brand-surface rounded-full transition-colors">
                    <Phone className="h-4.5 w-4.5" />
                  </button>
                  <button className="p-2 text-brand-accent hover:bg-brand-surface rounded-full transition-colors">
                    <MoreVertical className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>

              <div className="p-4 bg-[#231206]/50 border-b border-[#44210c]/30">
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-400 mb-2">
                  <Lock className="h-3 w-3 text-brand-accent" />
                  <span>Chat is fully encrypted & BankID certified</span>
                </div>
                <div className="max-w-md mx-auto bg-brand-card/90 rounded-2xl p-3 border border-[#44210c] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-brand-accent-faded text-brand-accent rounded-xl">
                      <Wrench className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-xs text-white uppercase">{activeThread.taskTitle}</h3>
                      <p className="text-[10px] sm:text-xs text-gray-400 line-clamp-1">{activeThread.partnerName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-sm sm:text-base text-brand-accent">{activeThread.price} kr</span>
                    <p className="text-[9px] text-gray-400 tracking-wider">EST. PRICE</p>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-brand-bg/50">
            {messages.map((msg) => {
              const isSender = msg.senderId === user?.id;
              return (
                <div key={msg.id} className={`flex items-end gap-2 max-w-[85%] ${isSender ? "ml-auto flex-row-reverse" : ""}`}>
                  <div className="flex flex-col gap-1.5">
                    <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isSender ? "bg-brand-accent text-[#210c00] rounded-br-none font-bold" : "bg-brand-card text-white rounded-bl-none border border-[#44210c]"
                    }`}>
                      {msg.content}
                    </div>
                    <span className={`text-[9px] text-gray-400 px-1 font-semibold ${isSender ? "text-right" : ""}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-brand-card/90 border-t border-[#44210c] z-10 flex gap-3 items-center">
            <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
              placeholder="Type a message..."
              className="flex-1 bg-brand-surface text-sm text-white placeholder-gray-400 rounded-xl px-4 py-2 border border-transparent focus:border-brand-accent outline-none" />
            <button onClick={handleSend}
              className="bg-brand-accent text-[#1e0d02] p-2.5 rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center justify-center shrink-0 border border-yellow-500">
              <Send className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
