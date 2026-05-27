import { AppView } from "../types";
import { 
  Home, 
  ListTodo, 
  PlusCircle, 
  MessageSquare, 
  User, 
  MapPin, 
  Bell, 
  Search,
  Hammer
} from "lucide-react";

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  unreadCount?: number;
}

export default function Navigation({ currentView, setView, unreadCount = 1 }: NavigationProps) {
  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <aside className="fixed left-0 top-0 bottom-0 z-40 hidden h-screen w-72 flex-col border-r border-[#44210c] bg-brand-surface py-6 px-4 lg:flex shadow-2xl">
        <div className="px-4 mb-2 flex items-center gap-3">
          <div className="p-2 bg-brand-accent-faded rounded-xl">
            <Hammer className="h-6 w-6 text-brand-accent" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white">NeighborHelp</h1>
            <p className="text-xs text-brand-accent font-semibold tracking-wider uppercase">Nordic Pulse</p>
          </div>
        </div>

        <div className="mt-8 px-2">
          <div className="flex items-center gap-3 p-3 bg-brand-card rounded-2xl border border-[#44210c] mb-6">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-accent">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXqShasEsRpBqMWmgnFfNoyqDKQ-SktTW20lf0kUlL7eXXuMyfcDYsRLH9UANn2mepsfAFFMF3tELmq2poAPrYo9EXxXj7wQ3Hw-PsaLOCAtNYaupFqmmylA1aSB8H7fYuTs9G95ElFhn3dyxNuALMjgaT-wnpLeZVrLn6FLKAjhJRIKDAxIF0_7k6kod63yDmzQfP-g5GpTJhp1DTKFpvMXwpQMz7eYsEHPI7H5hxPmeQPYnpDBPb-swx3yNTT2UfjUHyZv3mq6E" 
                alt="Alex profile picture" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Welcome back</p>
              <p className="text-sm font-bold text-white">Alex Jensen</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 px-1">
          <button 
            onClick={() => setView("home")}
            className={`flex w-full items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              currentView === "home" || currentView === "category"
                ? "bg-brand-accent text-white shadow-lg shadow-brand-accent/20" 
                : "text-gray-300 hover:bg-brand-card hover:text-white"
            }`}
          >
            <Home className="h-5 w-5" />
            <span>Discover Help</span>
          </button>

          <button 
            onClick={() => setView("requests")}
            className={`flex w-full items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              currentView === "requests" 
                ? "bg-brand-accent text-white shadow-lg shadow-brand-accent/20" 
                : "text-gray-300 hover:bg-brand-card hover:text-white"
            }`}
          >
            <ListTodo className="h-5 w-5" />
            <span>Demand Feed</span>
          </button>

          <button 
            onClick={() => setView("create")}
            className={`flex w-full items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              currentView === "create" 
                ? "bg-brand-accent text-white shadow-lg shadow-brand-accent/20" 
                : "text-gray-300 hover:bg-brand-card hover:text-white"
            }`}
          >
            <PlusCircle className="h-5 w-5" />
            <span>Post a Request</span>
          </button>

          <button 
            onClick={() => setView("inbox")}
            className={`flex w-full items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all relative ${
              currentView === "inbox" || currentView === "chat"
                ? "bg-brand-accent text-white shadow-lg shadow-brand-accent/20" 
                : "text-gray-300 hover:bg-brand-card hover:text-white"
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            <span>Messaging</span>
            {unreadCount > 0 && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 p-2 h-5 w-5 rounded-full bg-brand-accent text-[#1e0d02] text-[10px] font-extrabold flex items-center justify-center border-2 border-brand-surface">
                {unreadCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => setView("profile")}
            className={`flex w-full items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              currentView === "profile" 
                ? "bg-brand-accent text-white shadow-lg shadow-brand-accent/20" 
                : "text-gray-300 hover:bg-brand-card hover:text-white"
            }`}
          >
            <User className="h-5 w-5" />
            <span>Helper Profile</span>
          </button>
        </nav>

        <div className="mt-auto px-2">
          <button 
            onClick={() => setView("create")}
            className="w-full bg-white text-brand-bg font-extrabold py-3.5 px-4 rounded-xl shadow-xl hover:bg-opacity-90 active:scale-[0.98] transition-all text-xs uppercase tracking-wider"
          >
            Post a Request
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-brand-surface/90 backdrop-blur-xl border-t border-[#44210c] px-2 py-3 lg:hidden shadow-2xl rounded-t-2xl">
        <button 
          onClick={() => setView("home")}
          className={`flex flex-col items-center justify-center py-1 px-3.5 rounded-2xl active:scale-95 transition-transform ${
            currentView === "home" || currentView === "category" ? "bg-brand-accent text-white font-extrabold" : "text-gray-400 font-medium"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] sm:text-[11px] mt-0.5">Discover</span>
        </button>

        <button 
          onClick={() => setView("requests")}
          className={`flex flex-col items-center justify-center py-1 px-3.5 rounded-2xl active:scale-95 transition-transform ${
            currentView === "requests" ? "bg-brand-accent text-white font-extrabold" : "text-gray-400 font-medium"
          }`}
        >
          <ListTodo className="h-5 w-5" />
          <span className="text-[10px] sm:text-[11px] mt-0.5">Feed</span>
        </button>

        <button 
          onClick={() => setView("create")}
          className={`flex flex-col items-center justify-center py-1 px-3.5 rounded-2xl active:scale-95 transition-transform ${
            currentView === "create" ? "bg-brand-accent text-white font-extrabold" : "text-gray-400 font-medium"
          }`}
        >
          <PlusCircle className="h-5 w-5 text-brand-accent" />
          <span className="text-[10px] sm:text-[11px] mt-0.5 text-brand-accent">Create</span>
        </button>

        <button 
          onClick={() => setView("inbox")}
          className={`flex flex-col items-center justify-center py-1 px-3.5 rounded-2xl active:scale-95 transition-transform relative ${
            currentView === "inbox" || currentView === "chat" ? "bg-brand-accent text-white font-extrabold" : "text-gray-400 font-medium"
          }`}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-[10px] sm:text-[11px] mt-0.5">Inbox</span>
          {unreadCount > 0 && (
            <span className="absolute right-2 top-0.5 p-1 h-4 w-4 rounded-full bg-brand-accent text-brand-bg text-[9px] font-extrabold flex items-center justify-center border border-brand-surface animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>

        <button 
          onClick={() => setView("profile")}
          className={`flex flex-col items-center justify-center py-1 px-3.5 rounded-2xl active:scale-95 transition-transform ${
            currentView === "profile" ? "bg-brand-accent text-white font-extrabold" : "text-gray-400 font-medium"
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-[10px] sm:text-[11px] mt-0.5">Profile</span>
        </button>
      </nav>
    </>
  );
}
