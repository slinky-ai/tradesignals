import { Home, PieChart, Settings, User, CreditCard, Bell, ChevronLeft, ChevronRight, Sun, Moon, Bot, Rocket, Star, LogOut, Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { useState, useEffect } from "react";
import { Separator } from "./ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";

const menuItems = [
  { icon: Rocket, label: "Launch", path: "/" },
  { icon: Bot, label: "My Agents", path: "/my-agents" },
  { icon: Star, label: "Featured Agents", path: "/featured" },
  { icon: PieChart, label: "Trades", path: "/transactions" },
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  walletAddress: string;
  onDisconnect?: () => void;
}

const Sidebar = ({ isOpen, setIsOpen, walletAddress, onDisconnect }: SidebarProps) => {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile, setIsOpen]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleDisconnect = () => {
    if (onDisconnect) {
      onDisconnect();
    } else {
      console.log("Disconnecting wallet");
    }
  };

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full glass-card border-r border-[#FF8133]/20 transition-all duration-300 z-50",
      isOpen ? "w-64" : "w-20"
    )}>
      <div className="flex flex-col h-full bg-black">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Link to="/">
              {isOpen ? (
                <img 
                  src="/uploads/SlinkyLayer_logo_dark.png" 
                  alt="SlinkyLayer Logo" 
                  className="w-32 object-contain"
                />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center bg-[#FF8133]/10 rounded-lg">
                  <img 
                    src="/uploads/slinky_fav.png" 
                    alt="SL" 
                    style={{width: "25px", height: "25px"}}
                  />
                </div>
              )}
            </Link>
            {isOpen && (
              <Badge variant="secondary" className="text-xs whitespace-nowrap">
                BETA
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="hover:bg-[#FF8133]/10 min-w-10"
          >
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 px-4" style={{marginTop: "20px"}}>
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "text-sm flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200",
                      "hover:bg-[#FF8133]/10",
                      isActive ? "bg-[#FF8133]/10 text-[#FF8133]" : "text-foreground",
                      !isOpen && "justify-center px-2"
                    )}
                    title={!isOpen ? item.label : undefined}
                  >
                    <Icon className="h-5 w-5 min-w-5 flex-shrink-0" />
                    {isOpen && <span className="truncate">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 space-y-4">
          {/* <div className={cn(
            "flex items-center",
            isOpen ? "justify-between px-4 py-2" : "flex-col justify-center py-2 gap-2"
          )}>
            {isOpen ? (
              <div className="flex items-center gap-2">
                {isDarkMode ? <Moon className="h-5 w-5 flex-shrink-0" /> : <Sun className="h-5 w-5 flex-shrink-0" />}
                <span>{isDarkMode ? "Dark" : "Light"} Mode</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                {isDarkMode ? <Moon className="h-5 w-5 flex-shrink-0" /> : <Sun className="h-5 w-5 flex-shrink-0" />}
              </div>
            )}
            <Switch
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
            />
          </div> */}

          <Separator className="bg-white/10" />
          
          <div className={cn(
            "flex items-center gap-3",
            isOpen ? "px-4 py-3" : "justify-center py-4"
          )}>
            <User className="h-8 w-8 rounded-full bg-[#FF8133]/10 p-1.5 flex-shrink-0" />
            {isOpen && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">
                  {walletAddress 
                    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                    : "Not Connected"
                  }
                </span>
                <span className="text-xs text-muted-foreground">
                  {walletAddress ? "Connected" : "Guest User"}
                </span>
              </div>
            )}
          </div>
          
          {walletAddress && (
            <div className={cn(
              isOpen ? "px-3" : "flex justify-center"
            )}>
              <Button
                variant="sleek"
                size="sm"
                onClick={handleDisconnect}
                className={cn(
                  "transition-all duration-200",
                  isOpen ? "w-full justify-start" : "w-10 h-10 p-0 flex items-center justify-center"
                )}
                title={!isOpen ? "Disconnect Wallet" : undefined}
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                {isOpen && <span className="ml-2">Disconnect</span>}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
