import { Bell, Home, Play, Settings, Shield, User } from "lucide-react";
import type { User as UserType } from "../types";
import type { Page } from "../types";

interface SidebarProps {
  open: boolean;
  currentPage: Page;
  currentUser: UserType | null;
  onNavigate: (page: Page) => void;
}

const NAV_ITEMS = [
  { label: "Home", icon: Home, page: { name: "home" } as Page },
  { label: "Shorts", icon: Play, page: { name: "shorts" } as Page },
  { label: "Subscriptions", icon: Bell, page: { name: "home" } as Page },
  { label: "Channel", icon: User, page: null as Page | null },
  { label: "Settings", icon: Settings, page: { name: "home" } as Page },
];

export default function Sidebar({
  open,
  currentPage,
  currentUser,
  onNavigate,
}: SidebarProps) {
  const isActive = (page: Page | null): boolean => {
    if (!page) return false;
    return page.name === currentPage.name;
  };

  return (
    <aside
      data-ocid="sidebar.panel"
      className="fixed top-16 left-0 bottom-0 z-40 flex flex-col transition-all duration-300 overflow-hidden"
      style={{
        width: open ? 220 : 0,
        background: "#F2F6FA",
        borderRight: "1px solid #E0EAF4",
        overflow: "hidden",
      }}
    >
      <nav className="flex flex-col gap-1 p-3 pt-4" style={{ minWidth: 220 }}>
        {NAV_ITEMS.map(({ label, icon: Icon, page }) => {
          const resolvedPage: Page = page
            ? page.name === "channel" && currentUser
              ? { name: "channel", id: currentUser.id }
              : page
            : { name: "home" };
          const active = isActive(page);

          return (
            <button
              key={label}
              type="button"
              data-ocid="sidebar.link"
              onClick={() => onNavigate(resolvedPage)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 text-left w-full"
              style={{
                background: active ? "#D9ECFF" : "transparent",
                color: active ? "#0369A1" : "#374151",
              }}
            >
              <Icon
                size={18}
                style={{ color: active ? "#0369A1" : "#6B7280" }}
              />
              <span className="whitespace-nowrap">{label}</span>
            </button>
          );
        })}

        {currentUser?.role === "owner" && (
          <button
            type="button"
            data-ocid="sidebar.link"
            onClick={() => onNavigate({ name: "admin" })}
            className="flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 text-left w-full mt-2"
            style={{
              background:
                currentPage.name === "admin" ? "#FFE4E4" : "transparent",
              color: currentPage.name === "admin" ? "#E53935" : "#374151",
            }}
          >
            <Shield
              size={18}
              style={{
                color: currentPage.name === "admin" ? "#E53935" : "#6B7280",
              }}
            />
            <span className="whitespace-nowrap">Admin Panel</span>
          </button>
        )}
      </nav>
    </aside>
  );
}
