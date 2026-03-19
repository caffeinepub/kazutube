import { Toaster } from "@/components/ui/sonner";
import { useCallback, useState } from "react";
import AuthModal from "./components/AuthModal";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import SplashScreen from "./components/SplashScreen";
import AdminPage from "./pages/AdminPage";
import ChannelPage from "./pages/ChannelPage";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import ShortsPage from "./pages/ShortsPage";
import UploadPage from "./pages/UploadPage";
import VideoPlayerPage from "./pages/VideoPlayerPage";
import { useKzStore } from "./store/useStore";
import type { Page } from "./types";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>({ name: "home" });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);

  const store = useKzStore();

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const shorts = store.videos.filter((v) => v.isShort);
  const sidebarWidth = sidebarOpen ? 220 : 0;

  const renderPage = () => {
    switch (currentPage.name) {
      case "home":
        return <HomePage videos={store.videos} onNavigate={navigate} />;
      case "video": {
        const video = store.videos.find((v) => v.id === currentPage.id);
        const uploaderUser = video
          ? store.users.find((u) => u.id === video.uploadedBy)
          : undefined;
        return (
          <VideoPlayerPage
            video={video}
            currentUser={store.currentUser}
            uploaderUser={uploaderUser}
            onNavigate={navigate}
            onToggleLike={store.toggleLike}
            onAddComment={store.addComment}
            onIncrementView={store.incrementView}
            onSubscribe={store.subscribe}
            onUnsubscribe={store.unsubscribe}
            isSubscribed={store.isSubscribed}
          />
        );
      }
      case "shorts":
        return (
          <ShortsPage
            shorts={shorts}
            currentUser={store.currentUser}
            onNavigate={navigate}
            onToggleLike={store.toggleLike}
          />
        );
      case "channel": {
        const channelUser = store.users.find((u) => u.id === currentPage.id);
        return (
          <ChannelPage
            channelUser={channelUser}
            videos={store.videos}
            currentUser={store.currentUser}
            onNavigate={navigate}
            onSubscribe={store.subscribe}
            onUnsubscribe={store.unsubscribe}
            isSubscribed={store.isSubscribed}
          />
        );
      }
      case "search":
        return (
          <SearchPage
            query={currentPage.query}
            videos={store.videos}
            users={store.users}
            onNavigate={navigate}
          />
        );
      case "upload":
        return (
          <UploadPage
            currentUser={store.currentUser}
            onNavigate={navigate}
            onLoginClick={() => setAuthOpen(true)}
            onAddVideo={(v) => {
              store.addVideo(v);
            }}
          />
        );
      case "admin":
        return (
          <AdminPage
            users={store.users}
            videos={store.videos}
            currentUser={store.currentUser}
            onNavigate={navigate}
            onBanUser={store.banUser}
            onDeleteVideo={store.deleteVideo}
            onSetVideoViews={store.setVideoViews}
          />
        );
      default:
        return <HomePage videos={store.videos} onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#EEF3F7" }}>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}

      {!showSplash && (
        <>
          <Navbar
            currentUser={store.currentUser}
            onNavigate={navigate}
            onLoginClick={() => setAuthOpen(true)}
            onLogout={store.logout}
            onToggleSidebar={() => setSidebarOpen((v) => !v)}
          />

          <Sidebar
            open={sidebarOpen}
            currentPage={currentPage}
            currentUser={store.currentUser}
            onNavigate={navigate}
          />

          {/* Main content */}
          <main
            data-ocid="main.panel"
            className="transition-all duration-300 pt-16 min-h-screen"
            style={{ marginLeft: sidebarWidth, padding: "80px 24px 40px" }}
          >
            {renderPage()}

            {/* Footer */}
            <footer
              className="mt-16 pt-8 text-center"
              style={{ borderTop: "1px solid #E0EAF4" }}
            >
              <p className="text-sm" style={{ color: "#9CA3AF" }}>
                © {new Date().getFullYear()} Kazutube. All rights reserved. ·{" "}
                <a
                  href="https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  style={{ color: "#40C4FF" }}
                >
                  Built with caffeine.ai
                </a>
              </p>
            </footer>
          </main>

          <AuthModal
            open={authOpen}
            onClose={() => setAuthOpen(false)}
            onLogin={store.login}
            onSignup={store.signup}
          />
        </>
      )}

      <Toaster />
    </div>
  );
}
