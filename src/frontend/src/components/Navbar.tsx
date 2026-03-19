import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  LogOut,
  Menu,
  Search,
  Shield,
  Upload,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";
import type { User } from "../types";
import type { Page } from "../types";

interface NavbarProps {
  currentUser: User | null;
  onNavigate: (page: Page) => void;
  onLoginClick: () => void;
  onLogout: () => void;
  onToggleSidebar: () => void;
}

export default function Navbar({
  currentUser,
  onNavigate,
  onLoginClick,
  onLogout,
  onToggleSidebar,
}: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onNavigate({ name: "search", query: searchQuery.trim() });
    }
  };

  return (
    <header
      data-ocid="navbar.panel"
      className="fixed top-0 left-0 right-0 z-50 flex items-center gap-3 px-4 h-16"
      style={{
        background: "linear-gradient(90deg, #0F1A24 0%, #0B131B 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Left: hamburger + logo */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          data-ocid="navbar.toggle"
          onClick={onToggleSidebar}
          className="text-white/70 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
        >
          <Menu size={20} />
        </button>
        <button
          type="button"
          data-ocid="navbar.link"
          onClick={() => onNavigate({ name: "home" })}
          className="flex items-center gap-2 select-none"
        >
          <div
            className="rounded-lg flex items-center justify-center"
            style={{
              width: 36,
              height: 36,
              background: "rgba(15,26,36,0.9)",
              border: "1.5px solid rgba(64,196,255,0.4)",
              boxShadow:
                "0 0 12px rgba(64,196,255,0.35), 0 0 24px rgba(229,57,53,0.2)",
            }}
          >
            <span
              style={{
                fontSize: 18,
                fontWeight: 900,
                background: "linear-gradient(135deg, #40C4FF 0%, #E53935 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1,
                filter: "drop-shadow(0 0 6px rgba(64,196,255,0.6))",
              }}
            >
              KT
            </span>
          </div>
          <span
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "-0.5px",
            }}
            className="hidden sm:block"
          >
            Kazu<span style={{ color: "#E53935" }}>tube</span>
          </span>
        </button>
      </div>

      {/* Center: search */}
      <div className="flex-1 max-w-xl mx-auto flex items-center">
        <div
          className="flex w-full rounded-xl overflow-hidden"
          style={{ background: "#1E2D3A" }}
        >
          <Input
            data-ocid="navbar.search_input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search videos, channels..."
            className="border-0 bg-transparent text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 text-sm"
          />
          <button
            type="button"
            data-ocid="navbar.button"
            onClick={handleSearch}
            className="px-4 flex items-center justify-center transition-opacity hover:opacity-90 shrink-0"
            style={{ background: "#E53935" }}
          >
            <Search size={16} color="white" />
          </button>
        </div>
      </div>

      {/* Right: upload + auth */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          data-ocid="navbar.upload_button"
          onClick={() => onNavigate({ name: "upload" })}
          className="text-white/70 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
          title="Upload"
        >
          <Upload size={20} />
        </button>

        {currentUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                data-ocid="navbar.button"
                className="flex items-center gap-2 rounded-full hover:bg-white/10 px-2 py-1 transition-colors"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={currentUser.avatar}
                    alt={currentUser.name}
                  />
                  <AvatarFallback
                    className="text-xs"
                    style={{ background: "#E53935", color: "white" }}
                  >
                    {currentUser.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-white text-xs font-semibold leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-white/50 text-xs leading-tight">
                    {currentUser.channelName}
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                data-ocid="navbar.link"
                onClick={() =>
                  onNavigate({ name: "channel", id: currentUser.id })
                }
              >
                <UserIcon size={14} className="mr-2" /> My Channel
              </DropdownMenuItem>
              {currentUser.role === "owner" && (
                <DropdownMenuItem
                  data-ocid="navbar.link"
                  onClick={() => onNavigate({ name: "admin" })}
                >
                  <Shield size={14} className="mr-2" /> Admin Panel
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                data-ocid="navbar.button"
                onClick={onLogout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut size={14} className="mr-2" /> Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            data-ocid="navbar.primary_button"
            onClick={onLoginClick}
            size="sm"
            className="rounded-full font-semibold text-white"
            style={{ background: "#E53935", border: "none" }}
          >
            Log In
          </Button>
        )}
      </div>
    </header>
  );
}
