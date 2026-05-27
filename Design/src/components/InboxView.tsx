import React, { useState, useRef, useEffect } from "react";
import { AppView, ChatSession, ChatMessage } from "../types";
import { 
  ArrowLeft, 
  Phone, 
  MoreVertical, 
  Lock, 
  Wrench, 
  PlusCircle, 
  Image, 
  Smile, 
  Send,
  BadgeCheck,
  CheckCircle,
  CalendarCheck,
  ShieldAlert,
  ShieldCheck,
  Calendar,
  MessageSquare,
  Clock
} from "lucide-react";
import { motion } from "motion/react";

interface InboxViewProps {
  setView: (view: AppView) => void;
  chatSessions: ChatSession[];
  onAcceptOffer: (chatId: string, offerId: string) => void;
  onSendMessage: (chatId: string, text: string) => void;
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
}

export default function InboxView({ 
  setView, 
  chatSessions, 
  onAcceptOffer, 
  onSendMessage,
  activeChatId,
  setActiveChatId
}: InboxViewProps) {
  const [typedMessage, setTypedMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = chatSessions.find(s => s.id === activeChatId) || null;

  useEffect(() => {
    if (activeSession) {
      scrollToBottom();
    }
  }, [activeSession?.messages?.length, activeChatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!typedMessage.trim() || !activeChatId) return;
    onSendMessage(activeChatId, typedMessage.trim());
    setTypedMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const currentActiveOffer = activeSession?.messages.find(m => m.offer && m.offer.status === "pending")?.offer || null;

  return (
    <div className="h-[calc(100vh-120px)] sm:h-[calc(100vh-100px)] flex flex-col">
      {activeSession === null ? (
        /* Chat List view */
        <div className="flex-1 overflow-y-auto space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase font-display">
              My Inbox
            </h1>
            <p className="text-sm text-gray-400">
              Negotiate details, accept helper offers, or check protection states.
            </p>
          </div>

          <div className="space-y-3.5" id="chats-session-list">
            {chatSessions.map((session) => {
              const lastMsg = session.messages[session.messages.length - 1];
              return (
                <div
                  key={session.id}
                  onClick={() => setActiveChatId(session.id)}
                  className="bg-brand-surface border border-[#44210c] hover:border-brand-accent/50 p-4.5 rounded-2xl flex items-center justify-between gap-4 cursor-pointer transition-all glowing-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-brand-accent/40 bg-brand-card">
                      <img 
                        src={session.helperAvatar} 
                        alt={session.helperName} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-green-500 border-2 border-brand-surface rounded-full"></div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-white text-base">{session.helperName}</h3>
                        <span className="text-[10px] bg-brand-accent-faded text-brand-accent font-extrabold px-2 py-0.5 rounded-md uppercase">
                          {session.taskTitle}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs sm:text-sm line-clamp-1 mt-0.5">{lastMsg ? lastMsg.text : "No messages yet"}</p>
                    </div>
                  </div>

                  <div className="text-right flex flex-col justify-between items-end gap-2 shrink-0">
                    <p className="text-[10px] sm:text-xs text-gray-400 font-semibold">{session.lastMessageTime}</p>
                    {session.unread && (
                      <span className="h-2.5 w-2.5 rounded-full bg-brand-accent animate-pulse" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Action-packed Active Chat Canvas */
        <div className="flex-1 flex flex-col h-full bg-brand-surface border border-[#44210c] rounded-3xl relative overflow-hidden gaging-height">
          {/* Header */}
          <div className="p-4 border-b border-[#44210c] bg-brand-card flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveChatId(null)}
                className="p-2 text-gray-400 hover:text-white rounded-xl bg-brand-surface/40 hover:bg-brand-surface active:scale-95 transition-all"
              >
                <ArrowLeft className="h-4.5 w-4.5" />
              </button>
              
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-brand-accent/40">
                <img 
                  src={activeSession.helperAvatar} 
                  alt={activeSession.helperName} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-brand-card rounded-full"></div>
              </div>

              <div>
                <h1 className="text-sm sm:text-base font-extrabold text-white leading-tight">
                  {activeSession.helperName}
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">
                  {activeSession.taskTitle} • {activeSession.taskBudget} kr/hr
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

          {/* Secure chat lock notice & Est. budget item card */}
          <div className="p-4 bg-[#231206]/50 border-b border-[#44210c]/30">
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-400 mb-2">
              <Lock className="h-3 w-3 text-brand-accent" />
              <span>Chat is fully encrypted &amp; BankID certified</span>
            </div>

            {/* Context WidgetCard */}
            <div className="max-w-md mx-auto bg-brand-card/90 rounded-2xl p-3 border border-[#44210c] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-accent-faded text-brand-accent rounded-xl">
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs text-white uppercase">{activeSession.taskTitle}</h3>
                  <p className="text-[10px] sm:text-xs text-gray-400 line-clamp-1">IKEA Malm 6-drawer dresser assembly needed.</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-sm sm:text-base text-brand-accent">{activeSession.taskBudget} kr</span>
                <p className="text-[9px] text-gray-400 tracking-wider">EST. PRICE</p>
              </div>
            </div>
          </div>

          {/* Chat Messages scrolling pane */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-brand-bg/50">
            {activeSession.messages.map((msg) => {
              const isSender = msg.senderId === "sender";
              
              return (
                <div 
                  key={msg.id}
                  className={`flex items-end gap-2 max-w-[85%] ${isSender ? "ml-auto flex-row-reverse" : ""}`}
                >
                  {!isSender && (
                    <img 
                      src={activeSession.helperAvatar} 
                      alt={activeSession.helperName} 
                      className="w-7 h-7 rounded-full mb-1 border border-brand-accent/20"
                    />
                  )}

                  <div className="flex flex-col gap-1.5">
                    {/* Normal message bubble */}
                    {!msg.offer && (
                      <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isSender 
                          ? "bg-brand-accent text-[#210c00] rounded-br-none font-bold" 
                          : "bg-brand-card text-white rounded-bl-none border border-[#44210c]"
                      }`}>
                        {msg.text}
                      </div>
                    )}

                    {/* Dynamic Formal Offer Card bubble */}
                    {msg.offer && (
                      <div className="bg-brand-card rounded-2xl overflow-hidden border-2 border-brand-accent/40 shadow-xl max-w-sm">
                        <div className="bg-brand-accent-faded py-3 px-4 border-b border-[#44210c] flex justify-between items-center">
                          <div>
                            <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#ffa200]">
                              Formal Offer
                            </span>
                            <h4 className="font-extrabold text-sm text-white">
                              {msg.offer.itemTitle}
                            </h4>
                          </div>
                          <span className="font-extrabold text-sm sm:text-base text-[#ff9100]">
                            {msg.offer.price} kr
                          </span>
                        </div>
                        
                        <div className="p-4 space-y-3">
                          <div className="flex items-center gap-2 text-xs text-gray-300">
                            <Clock className="h-4 w-4 text-brand-accent" />
                            <span>{msg.offer.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-300">
                            <ShieldCheck className="h-4 w-4 text-brand-accent" />
                            <span>Includes Stockholm protection policy</span>
                          </div>

                          <div className="pt-2 flex gap-3">
                            {msg.offer.status === "pending" ? (
                              <>
                                <button 
                                  onClick={() => onAcceptOffer(activeSession.id, msg.offer!.id)}
                                  className="flex-1 bg-brand-accent hover:brightness-110 text-brand-bg py-2.5 rounded-xl font-extrabold text-xs transition-colors active:scale-95 shadow-md shadow-brand-accent/10"
                                >
                                  Accept Offer
                                </button>
                                <button className="px-4 py-2.5 border border-[#522b10] bg-transparent text-gray-300 rounded-xl font-bold text-xs hover:bg-[#44210d] transition-colors">
                                  Decline
                                </button>
                              </>
                            ) : (
                              <button 
                                disabled
                                className="w-full bg-[#182a1b] text-emerald-400 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 border border-emerald-500/20"
                              >
                                <CheckCircle className="h-4 w-4" /> Accepted &amp; Verified
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <span className={`text-[9px] text-gray-400 px-1 font-semibold ${isSender ? "text-right" : ""}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Typing area */}
          <div className="p-4 bg-brand-card/90 border-t border-[#44210c] z-10 flex gap-3 items-center">
            <button className="p-1 px-1.5 text-gray-400 hover:text-brand-accent rounded-lg">
              <PlusCircle className="h-5 w-5" />
            </button>
            <button className="p-1 px-1.5 text-gray-400 hover:text-brand-accent rounded-lg sm:block hidden">
              <Image className="h-5 w-5" />
            </button>
            <div className="h-4 w-[1px] bg-[#44210c] sm:block hidden" />
            
            <input 
              type="text"
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-brand-surface text-sm text-white placeholder-gray-400 rounded-xl px-4 py-2 border border-transparent focus:border-brand-accent outline-none"
            />
            
            <button className="p-1 px-1.5 text-gray-400 hover:text-brand-accent rounded-lg">
              <Smile className="h-5 w-5" />
            </button>
            
            <button 
              onClick={handleSend}
              className="bg-brand-accent text-[#1e0d02] p-2.5 rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center justify-center shrink-0 border border-yellow-500"
            >
              <Send className="h-4.5 w-4.5 text-brand-bg" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
