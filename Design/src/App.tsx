import { useState } from "react";
import { AppView, TaskRequest, ChatSession, HelperProfile, DashboardSchedule } from "./types";
import { 
  MOCK_HELPERS, 
  RECENTLY_POSTED_FEED, 
  INITIAL_CHATS, 
  INITIAL_SCHEDULE, 
  PAST_REQUEST_HISTORY 
} from "./data";
import Navigation from "./components/Navigation";
import HomeView from "./components/HomeView";
import RequestsView from "./components/RequestsView";
import CreateView from "./components/CreateView";
import InboxView from "./components/InboxView";
import ProfileView from "./components/ProfileView";
import CategoryView from "./components/CategoryView";
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  Coins, 
  User, 
  CheckCircle, 
  MessageSquare,
  Sparkles,
  ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Navigation Routing States
  const [currentView, setView] = useState<AppView>("home");
  const [selectedCategory, setSelectedCategory] = useState<string>("Car Help");
  const [selectedHelper, setSelectedHelper] = useState<HelperProfile>(MOCK_HELPERS[0]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Core Data States for live interactivity
  const [tasks, setTasks] = useState<TaskRequest[]>(RECENTLY_POSTED_FEED);
  const [pastTasks, setPastTasks] = useState<any[]>(PAST_REQUEST_HISTORY);
  const [chats, setChats] = useState<ChatSession[]>(INITIAL_CHATS);
  const [schedule, setSchedule] = useState<DashboardSchedule[]>(INITIAL_SCHEDULE);

  // Popovers & Detail Modals
  const [inspectingTask, setInspectingTask] = useState<TaskRequest | null>(null);

  // Handler: Adds a newly constructed user task dynamically
  const handleAddNewTask = (newTask: Omit<TaskRequest, "id" | "appliedCount" | "status" | "createdAt" | "creator">) => {
    const formattedTask: TaskRequest = {
      ...newTask,
      id: `req_${Date.now()}`,
      appliedCount: 0,
      status: "Open",
      createdAt: new Date().toISOString(),
      creator: {
        name: "Alex Jensen (You)",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXqShasEsRpBqMWmgnFfNoyqDKQ-SktTW20lf0kUlL7eXXuMyfcDYsRLH9UANn2mepsfAFFMF3tELmq2poAPrYo9EXxXj7wQ3Hw-PsaLOCAtNYaupFqmmylA1aSB8H7fYuTs9G95ElFhn3dyxNuALMjgaT-wnpLeZVrLn6FLKAjhJRIKDAxIF0_7k6kod63yDmzQfP-g5GpTJhp1DTKFpvMXwpQMz7eYsEHPI7H5hxPmeQPYnpDBPb-swx3yNTT2UfjUHyZv3mq6E",
        distance: "0mi • Stockholm Södermalm"
      }
    };

    setTasks(prev => [formattedTask, ...prev]);
  };

  // Handler: Typing a message appends it to active scroll thread instantly
  const handleSendMessage = (chatId: string, text: string) => {
    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id === chatId) {
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const newMsg: any = {
            id: `msg_custom_${Date.now()}`,
            senderId: "sender",
            text,
            timestamp: nowStr
          };
          return {
            ...chat,
            lastMessage: text,
            lastMessageTime: nowStr,
            messages: [...chat.messages, newMsg]
          };
        }
        return chat;
      })
    );
  };

  // Handler: Accepts the formal escrow guarantee offer
  const handleAcceptOffer = (chatId: string, offerId: string) => {
    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id === chatId) {
          const updatedMessages = chat.messages.map(msg => {
            if (msg.offer && msg.offer.id === offerId) {
              return {
                ...msg,
                offer: {
                  ...msg.offer,
                  status: "accepted" as const
                }
              };
            }
            return msg;
          });
          return {
            ...chat,
            messages: updatedMessages,
            lastMessage: "Offer accepted! Södermalm protection activated."
          };
        }
        return chat;
      })
    );

    alert("Escrow offer accepted! Södermalm neighborhood protection active.");
  };

  // Handler: Toggles schedule availability slots on Dashboard
  const handleToggleScheduleSlot = (dayIndex: number, slotKey: "morning" | "afternoon" | "evening") => {
    setSchedule(prev => 
      prev.map((dayItem, index) => {
        if (index === dayIndex) {
          return {
            ...dayItem,
            slots: {
              ...dayItem.slots,
              [slotKey]: !dayItem.slots[slotKey]
            }
          };
        }
        return dayItem;
      })
    );
  };

  // Handler: Initiates chat with custom helper profiles dynamically
  const handleInitiateChatFromHelper = (helper: HelperProfile) => {
    const existingChat = chats.find(c => c.helperName.includes(helper.name));
    
    if (existingChat) {
      setActiveChatId(existingChat.id);
      setView("inbox");
    } else {
      // Setup temporary chat session dynamically
      const newChatId = `chat_${Date.now()}`;
      const newSession: ChatSession = {
        id: newChatId,
        helperName: helper.name,
        helperAvatar: helper.avatar,
        taskTitle: helper.skills[0] || "Handyman Work",
        taskBudget: helper.rateHour,
        lastMessage: "Conversation began with " + helper.name,
        lastMessageTime: "Just now",
        unread: false,
        messages: [
          {
            id: "welcome_1",
            senderId: "recipient",
            text: `Hej! Thanks for looking at my profile page. Let me know what you need help assembling or repairing!`,
            timestamp: "Just now"
          }
        ]
      };

      setChats(prev => [newSession, ...prev]);
      setActiveChatId(newChatId);
      setView("inbox");
    }
  };

  return (
    <div className="min-h-screen text-white bg-brand-bg flex font-sans antialiased selection:bg-brand-accent selection:text-[#1e0d02]">
      {/* Decorative Warm Ambient Symmetrical Glow Blurs */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-brand-accent/5 blur-[120px] pointer-events-none -translate-y-1/2 z-0" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-brand-accent/5 blur-[150px] pointer-events-none translate-y-1/3 z-0" />

      {/* Modern Sidebar Navigation Controls */}
      <Navigation 
        currentView={currentView} 
        setView={(v) => {
          setView(v);
          if (v !== "inbox" && v !== "chat") {
            // Keep inbox tab active inside subcontexts
          }
        }} 
        unreadCount={chats.filter(c => c.unread).length}
      />

      {/* Main Content Layout Block */}
      <main className="flex-1 lg:pl-72 pb-24 lg:pb-8 relative z-10 px-4 sm:px-8 mt-20 lg:mt-6 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-5xl mx-auto"
          >
            {currentView === "home" && (
              <HomeView 
                setView={setView} 
                setSelectedCategory={setSelectedCategory}
                recentTasks={tasks}
                onSelectTask={(task) => setInspectingTask(task)}
              />
            )}

            {currentView === "requests" && (
              <RequestsView 
                setView={setView} 
                tasks={tasks}
                pastTasks={pastTasks}
                onSelectTask={(task) => setInspectingTask(task)}
              />
            )}

            {currentView === "create" && (
              <CreateView 
                setView={setView} 
                onSubmitTask={handleAddNewTask}
              />
            )}

            {currentView === "inbox" && (
              <InboxView 
                setView={setView} 
                chatSessions={chats}
                onAcceptOffer={handleAcceptOffer}
                onSendMessage={handleSendMessage}
                activeChatId={activeChatId}
                setActiveChatId={setActiveChatId}
              />
            )}

            {currentView === "profile" && (
              <ProfileView 
                setView={setView}
                helper={selectedHelper}
                schedule={schedule}
                onToggleScheduleSlot={handleToggleScheduleSlot}
                onInitiateChat={() => handleInitiateChatFromHelper(selectedHelper)}
              />
            )}

            {currentView === "category" && (
              <CategoryView 
                categoryName={selectedCategory}
                setView={setView}
                helpers={MOCK_HELPERS}
                onSelectHelper={(helper) => {
                  setSelectedHelper(helper);
                  setView("profile");
                }}
                onInitiateChatFromHelper={handleInitiateChatFromHelper}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Inspect Task Popover Detail Overlay (For clicking cards inside the feed) */}
      <AnimatePresence>
        {inspectingTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-bg/85 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-brand-surface border border-[#44210c] dark:border-brand-accent/30 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 relative overflow-hidden"
            >
              {/* Corner accent glow indicator */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex justify-between items-start">
                <span className="bg-brand-accent-faded border border-brand-accent/20 text-brand-accent text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {inspectingTask.category}
                </span>
                <button 
                  onClick={() => setInspectingTask(null)}
                  className="p-1 px-1.5 hover:bg-brand-card bg-brand-card/40 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase font-display">
                  {inspectingTask.title}
                </h3>
                <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-400 mt-2">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-brand-accent animate-bounce" /> {inspectingTask.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-brand-accent" /> {inspectingTask.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-brand-accent" /> {inspectingTask.time}
                  </span>
                </div>
              </div>

              <div className="space-y-4 bg-brand-card/65 p-4.5 rounded-2xl border border-[#44210c]">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Job Description</p>
                <p className="text-sm text-gray-300 leading-relaxed font-body">
                  {inspectingTask.description}
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-brand-accent-faded border border-brand-accent/20 rounded-2xl">
                <div>
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide block">GIG BUDGET</span>
                  <span className="font-extrabold text-xl text-brand-accent">{inspectingTask.budget} kr</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-brand-accent/40 bg-brand-card">
                    <img 
                      src={inspectingTask.creator.avatar} 
                      alt={inspectingTask.creator.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-bold uppercase">Requested by</span>
                    <span className="text-xs font-bold text-white block">{inspectingTask.creator.name}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    setInspectingTask(null);
                    // Match a sample message
                    const testChat = chats.find(c => c.helperName === "Sarah Miller");
                    if (testChat) {
                      setActiveChatId(testChat.id);
                      setView("inbox");
                    } else {
                      setView("inbox");
                    }
                  }}
                  className="flex-1 bg-brand-accent text-brand-bg py-3 px-5 rounded-2xl font-extrabold text-sm hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 border border-yellow-500"
                >
                  <MessageSquare className="h-4.5 w-4.5" /> Discuss Gigs
                </button>
                <button 
                  onClick={() => {
                    alert("Applied to help successfully! Creator was notified.");
                    setInspectingTask(null);
                  }}
                  className="flex-1 border-2 border-gray-600 font-extrabold py-3 px-5 rounded-2xl text-sm text-white hover:border-white transition-colors active:scale-95"
                >
                  Apply to help
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
