
import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, Bookmark, ChartBar, User, Settings } from "lucide-react";

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="mt-4 mb-4 flex justify-around py-3 bg-[#151A29]/80 border border-white/10 rounded-lg">
      <button
        onClick={() => navigate("/")}
        className="flex flex-col items-center space-y-1 text-white/60 hover:text-[#FF8133] transition-colors text-xs font-semibold select-none"
        aria-label="Home"
        title="Home"
      >
        <Home className="h-6 w-6" />
        <span>Home</span>
      </button>
      <button
        onClick={() => alert("Go to Saved Signals")}
        className="flex flex-col items-center space-y-1 text-white/60 hover:text-[#FF8133] transition-colors text-xs font-semibold select-none"
        aria-label="Saved Signals"
        title="Saved"
      >
        <Bookmark className="h-6 w-6" />
        <span>Saved</span>
      </button>
      <button
        onClick={() => navigate("/transactions")}
        className="flex flex-col items-center space-y-1 text-white/60 hover:text-[#FF8133] transition-colors text-xs font-semibold select-none"
        aria-label="Analytics"
        title="Analytics"
      >
        <ChartBar className="h-6 w-6" />
        <span>Trades</span>
      </button>
      <button
        onClick={() => alert("Go to Profile")}
        className="flex flex-col items-center space-y-1 text-white/60 hover:text-[#FF8133] transition-colors text-xs font-semibold select-none"
        aria-label="Profile"
        title="Profile"
      >
        <User className="h-6 w-6" />
        <span>Profile</span>
      </button>
      <button
        onClick={() => navigate("/settings")}
        className="flex flex-col items-center space-y-1 text-white/60 hover:text-[#FF8133] transition-colors text-xs font-semibold select-none"
        aria-label="Settings"
        title="Settings"
      >
        <Settings className="h-6 w-6" />
        <span>Settings</span>
      </button>
    </nav>
  );
};

export default NavigationBar;

