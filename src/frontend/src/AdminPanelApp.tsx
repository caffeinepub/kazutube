import {
  BarChart3,
  CheckCircle,
  ChevronDown,
  Eye,
  EyeOff,
  LogOut,
  Search,
  Shield,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

// ── Storage keys (same as Kazutube) ──────────────────────────────────────────
const USERS_KEY = "kz_users";
const VIDEOS_KEY = "kz_videos";

interface KzUser {
  id: string;
  email: string;
  name: string;
  channelName?: string;
  subscriberCount: number;
  role: string;
  createdAt: string;
  avatar?: string;
}

interface KzVideo {
  id: string;
  title: string;
  userId: string;
  views: number;
  baseViews?: number;
  baseLikes?: number;
  baseCommentCount?: number;
  likes: string[];
  comments: { id: string }[];
  thumbnailUrl?: string;
  createdAt: string;
  isShort?: boolean;
}

function loadUsers(): KzUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function loadVideos(): KzVideo[] {
  try {
    return JSON.parse(localStorage.getItem(VIDEOS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(u: KzUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(u));
}

function saveVideos(v: KzVideo[]) {
  localStorage.setItem(VIDEOS_KEY, JSON.stringify(v));
}

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatInput({
  label,
  onAction,
  actionLabel,
  ocid,
}: {
  label: string;
  onAction: (val: number) => void;
  actionLabel: string;
  ocid: string;
}) {
  const [val, setVal] = useState("");
  return (
    <div className="flex items-center gap-2 mt-2">
      <span className="text-xs text-gray-400 w-32 shrink-0">{label}</span>
      <input
        type="number"
        min={0}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        data-ocid={`${ocid}.input`}
        className="flex-1 px-3 py-1.5 rounded-lg text-sm text-white outline-none focus:ring-2 focus:ring-blue-400"
        style={{ background: "#0F1A24", border: "1px solid #2a3f55" }}
        placeholder="Enter amount"
      />
      <button
        type="button"
        data-ocid={`${ocid}.button`}
        onClick={() => {
          const n = Number(val);
          if (!Number.isNaN(n) && val !== "") {
            onAction(n);
            setVal("");
          }
        }}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors hover:opacity-80"
        style={{ background: "#40C4FF", color: "#0F1A24" }}
      >
        {actionLabel}
      </button>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function AdminPanelApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [users, setUsersState] = useState<KzUser[]>(() => loadUsers());
  const [videos, setVideosState] = useState<KzVideo[]>(() => loadVideos());

  const [successMsg, setSuccessMsg] = useState("");
  const [activeTab, setActiveTab] = useState<
    "channels" | "videos" | "overview"
  >("overview");

  // Channel section state
  const [selectedUserId, setSelectedUserId] = useState("");

  // Video section state
  const [videoSearch, setVideoSearch] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState("");

  const filteredVideos = videos.filter((v) =>
    v.title.toLowerCase().includes(videoSearch.toLowerCase()),
  );

  // Reload from localStorage when becoming active (cross-tab sync)
  useEffect(() => {
    const onFocus = () => {
      setUsersState(loadUsers());
      setVideosState(loadVideos());
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  function mutUsers(updated: KzUser[]) {
    setUsersState(updated);
    saveUsers(updated);
  }

  function mutVideos(updated: KzVideo[]) {
    setVideosState(updated);
    saveVideos(updated);
  }

  function showSuccess(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 2500);
  }

  // ── Login handler ────────────────────────────────────────────────────────────
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (username === "KazuXedit" && password === "Kazu2009") {
      setLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Invalid login");
    }
  }

  // ── Stat display helpers ──────────────────────────────────────────────────────
  function videoViews(v: KzVideo) {
    return v.views + (v.baseViews || 0);
  }
  function videoLikes(v: KzVideo) {
    return (v.baseLikes || 0) + v.likes.length;
  }
  function videoComments(v: KzVideo) {
    return (v.baseCommentCount || 0) + v.comments.length;
  }

  // ── Video mutations ──────────────────────────────────────────────────────────
  function increaseViews(videoId: string, amount: number) {
    const updated = videos.map((v) =>
      v.id === videoId ? { ...v, views: v.views + amount } : v,
    );
    mutVideos(updated);
    if (videoId === selectedVideoId) setVideosState(updated);
    showSuccess(`Views increased by ${fmtNum(amount)}`);
  }

  function setViews(videoId: string, total: number) {
    const vid = videos.find((v) => v.id === videoId);
    if (!vid) return;
    const newViews = Math.max(0, total - (vid.baseViews || 0));
    const updated = videos.map((v) =>
      v.id === videoId ? { ...v, views: newViews } : v,
    );
    mutVideos(updated);
    showSuccess(`Views set to ${fmtNum(total)}`);
  }

  function increaseLikes(videoId: string, amount: number) {
    const updated = videos.map((v) =>
      v.id === videoId ? { ...v, baseLikes: (v.baseLikes || 0) + amount } : v,
    );
    mutVideos(updated);
    showSuccess(`Likes increased by ${fmtNum(amount)}`);
  }

  function setLikes(videoId: string, total: number) {
    const vid = videos.find((v) => v.id === videoId);
    if (!vid) return;
    const newBase = Math.max(0, total - vid.likes.length);
    const updated = videos.map((v) =>
      v.id === videoId ? { ...v, baseLikes: newBase } : v,
    );
    mutVideos(updated);
    showSuccess(`Likes set to ${fmtNum(total)}`);
  }

  function increaseComments(videoId: string, amount: number) {
    const updated = videos.map((v) =>
      v.id === videoId
        ? { ...v, baseCommentCount: (v.baseCommentCount || 0) + amount }
        : v,
    );
    mutVideos(updated);
    showSuccess(`Comments increased by ${fmtNum(amount)}`);
  }

  function setComments(videoId: string, total: number) {
    const vid = videos.find((v) => v.id === videoId);
    if (!vid) return;
    const newBase = Math.max(0, total - vid.comments.length);
    const updated = videos.map((v) =>
      v.id === videoId ? { ...v, baseCommentCount: newBase } : v,
    );
    mutVideos(updated);
    showSuccess(`Comments set to ${fmtNum(total)}`);
  }

  // ── Channel mutations ────────────────────────────────────────────────────────
  function increaseSubscribers(userId: string, amount: number) {
    const updated = users.map((u) =>
      u.id === userId
        ? { ...u, subscriberCount: u.subscriberCount + amount }
        : u,
    );
    mutUsers(updated);
    showSuccess(`Subscribers increased by ${fmtNum(amount)}`);
  }

  function setSubscribers(userId: string, total: number) {
    const updated = users.map((u) =>
      u.id === userId ? { ...u, subscriberCount: total } : u,
    );
    mutUsers(updated);
    showSuccess(`Subscribers set to ${fmtNum(total)}`);
  }

  // ── Overview stats ────────────────────────────────────────────────────────────
  const totalViews = videos.reduce((acc, v) => acc + videoViews(v), 0);
  const totalLikes = videos.reduce((acc, v) => acc + videoLikes(v), 0);
  const totalSubs = users.reduce((acc, u) => acc + u.subscriberCount, 0);

  // ── Render login ──────────────────────────────────────────────────────────────
  if (!loggedIn) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0F1A24" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm rounded-2xl p-8 shadow-2xl"
          style={{ background: "#1a2a3a", border: "1px solid #2a3f55" }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Shield size={28} style={{ color: "#40C4FF" }} />
              <span
                className="text-3xl font-black tracking-tight"
                style={{
                  background:
                    "linear-gradient(135deg, #40C4FF 40%, #E53935 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                KT
              </span>
            </div>
            <h1 className="text-xl font-bold text-white text-center">
              Kazutube Admin Panel
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6B8A9F" }}>
              Restricted access only
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="login-username"
                className="block text-xs font-semibold mb-1.5"
                style={{ color: "#9BB8CC" }}
              >
                Username
              </label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                data-ocid="login.input"
                autoComplete="username"
                className="w-full px-4 py-2.5 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-400"
                style={{ background: "#0F1A24", border: "1px solid #2a3f55" }}
                placeholder="Enter username"
              />
            </div>
            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold mb-1.5"
                style={{ color: "#9BB8CC" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-ocid="login.input"
                  autoComplete="current-password"
                  className="w-full px-4 py-2.5 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-400 pr-12"
                  style={{ background: "#0F1A24", border: "1px solid #2a3f55" }}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                  style={{ color: "#6B8A9F" }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {loginError && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  data-ocid="login.error_state"
                  className="text-sm font-semibold text-center py-2 rounded-lg"
                  style={{
                    color: "#E53935",
                    background: "rgba(229,57,53,0.1)",
                  }}
                >
                  {loginError}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              data-ocid="login.submit_button"
              className="w-full py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(135deg,#40C4FF,#0097C7)",
                color: "#0F1A24",
              }}
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ── Render dashboard ──────────────────────────────────────────────────────────
  const currentSelectedUser =
    users.find((u) => u.id === selectedUserId) || null;
  const currentSelectedVideo =
    videos.find((v) => v.id === selectedVideoId) || null;

  return (
    <div className="min-h-screen" style={{ background: "#0F1A24" }}>
      {/* Top bar */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: "#1a2a3a", borderBottom: "1px solid #2a3f55" }}
      >
        <div className="flex items-center gap-3">
          <Shield size={22} style={{ color: "#40C4FF" }} />
          <span
            className="text-lg font-black tracking-tight"
            style={{
              background: "linear-gradient(135deg, #40C4FF 40%, #E53935 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            KT
          </span>
          <span className="text-white font-semibold text-sm hidden sm:block">
            Kazutube Admin Panel
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: "rgba(64,196,255,0.15)", color: "#40C4FF" }}
          >
            KazuXedit
          </span>
          <button
            type="button"
            data-ocid="admin.logout_button"
            onClick={() => setLoggedIn(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-70"
            style={{ background: "rgba(229,57,53,0.15)", color: "#E53935" }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      {/* Success toast */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            data-ocid="admin.success_state"
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold"
            style={{
              background: "#1a3a2a",
              color: "#4CAF50",
              border: "1px solid #4CAF50",
            }}
          >
            <CheckCircle size={16} /> {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab nav */}
      <nav className="flex gap-1 px-6 pt-5 pb-0">
        {(["overview", "channels", "videos"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            data-ocid={`admin.${tab}.tab`}
            onClick={() => setActiveTab(tab)}
            className="px-5 py-2 rounded-t-xl text-sm font-semibold capitalize transition-colors"
            style={
              activeTab === tab
                ? {
                    background: "#1a2a3a",
                    color: "#40C4FF",
                    border: "1px solid #2a3f55",
                    borderBottom: "1px solid #1a2a3a",
                  }
                : { background: "transparent", color: "#6B8A9F" }
            }
          >
            {tab === "overview" && (
              <BarChart3 size={14} className="inline mr-1.5 mb-0.5" />
            )}
            {tab === "channels" && (
              <Users size={14} className="inline mr-1.5 mb-0.5" />
            )}
            {tab === "videos" && (
              <Video size={14} className="inline mr-1.5 mb-0.5" />
            )}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      <main
        className="mx-auto max-w-5xl px-4 sm:px-6 py-6"
        style={{ borderTop: "1px solid #2a3f55" }}
      >
        {/* ── Overview Tab ─────────────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-white font-bold text-lg mb-5">
              Platform Overview
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  label: "Total Users",
                  value: users.length,
                  icon: <Users size={20} />,
                  color: "#40C4FF",
                },
                {
                  label: "Total Videos",
                  value: videos.length,
                  icon: <Video size={20} />,
                  color: "#E53935",
                },
                {
                  label: "Total Views",
                  value: fmtNum(totalViews),
                  icon: <Eye size={20} />,
                  color: "#4CAF50",
                },
                {
                  label: "Total Likes",
                  value: fmtNum(totalLikes),
                  icon: <TrendingUp size={20} />,
                  color: "#FF9800",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl p-5"
                  style={{ background: "#1a2a3a", border: "1px solid #2a3f55" }}
                >
                  <div
                    className="flex items-center gap-2 mb-3"
                    style={{ color: stat.color }}
                  >
                    {stat.icon}
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "#9BB8CC" }}
                    >
                      {stat.label}
                    </span>
                  </div>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            <div
              className="mt-6 rounded-2xl p-5"
              style={{ background: "#1a2a3a", border: "1px solid #2a3f55" }}
            >
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <BarChart3 size={16} style={{ color: "#40C4FF" }} /> Total
                Subscribers
              </h3>
              <p className="text-3xl font-black" style={{ color: "#40C4FF" }}>
                {fmtNum(totalSubs)}
              </p>
              <p className="text-xs mt-1" style={{ color: "#6B8A9F" }}>
                Across all {users.length} channels
              </p>
            </div>

            <div
              className="mt-4 rounded-2xl p-5"
              style={{ background: "#1a2a3a", border: "1px solid #2a3f55" }}
            >
              <h3 className="text-white font-semibold mb-3">Recent Videos</h3>
              {videos.length === 0 ? (
                <p className="text-sm" style={{ color: "#6B8A9F" }}>
                  No videos uploaded yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {videos.slice(0, 5).map((v, i) => (
                    <div
                      key={v.id}
                      data-ocid={`overview.video.item.${i + 1}`}
                      className="flex items-center justify-between py-2"
                      style={{ borderBottom: "1px solid #2a3f55" }}
                    >
                      <span className="text-sm text-white truncate max-w-xs">
                        {v.title}
                      </span>
                      <span className="text-xs" style={{ color: "#9BB8CC" }}>
                        {fmtNum(videoViews(v))} views
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Channels Tab ─────────────────────────────────────────────────────── */}
        {activeTab === "channels" && (
          <motion.div
            key="channels"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-white font-bold text-lg mb-5">Channel Stats</h2>

            {/* Channel selector */}
            <div
              className="rounded-2xl p-5 mb-4"
              style={{ background: "#1a2a3a", border: "1px solid #2a3f55" }}
            >
              <label
                htmlFor="channel-select"
                className="block text-xs font-semibold mb-2"
                style={{ color: "#9BB8CC" }}
              >
                Select Channel
              </label>
              <div className="relative">
                <select
                  id="channel-select"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  data-ocid="channels.select"
                  className="w-full px-4 py-2.5 rounded-xl text-white outline-none appearance-none focus:ring-2 focus:ring-blue-400"
                  style={{ background: "#0F1A24", border: "1px solid #2a3f55" }}
                >
                  <option value="">— Select a channel —</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.channelName || "No channel"})
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#6B8A9F" }}
                />
              </div>
            </div>

            {/* Selected channel info + controls */}
            {currentSelectedUser ? (
              <div
                className="rounded-2xl p-5"
                style={{ background: "#1a2a3a", border: "1px solid #2a3f55" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{ background: "#40C4FF", color: "#0F1A24" }}
                  >
                    {currentSelectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-semibold">
                      {currentSelectedUser.name}
                    </p>
                    <p className="text-xs" style={{ color: "#6B8A9F" }}>
                      {currentSelectedUser.channelName || "No channel name"}
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p
                      className="text-2xl font-black"
                      style={{ color: "#40C4FF" }}
                    >
                      {fmtNum(currentSelectedUser.subscriberCount)}
                    </p>
                    <p className="text-xs" style={{ color: "#6B8A9F" }}>
                      subscribers
                    </p>
                  </div>
                </div>

                <div
                  style={{ borderTop: "1px solid #2a3f55", paddingTop: "16px" }}
                >
                  <p
                    className="text-xs font-semibold mb-2"
                    style={{ color: "#9BB8CC" }}
                  >
                    Subscriber Controls
                  </p>
                  <StatInput
                    label="Increase by"
                    onAction={(n) => increaseSubscribers(selectedUserId, n)}
                    actionLabel="Increase"
                    ocid="channels.increase_subs"
                  />
                  <StatInput
                    label="Set total to"
                    onAction={(n) => setSubscribers(selectedUserId, n)}
                    actionLabel="Set"
                    ocid="channels.set_subs"
                  />
                </div>
              </div>
            ) : (
              <div
                data-ocid="channels.empty_state"
                className="rounded-2xl p-10 text-center"
                style={{ background: "#1a2a3a", border: "1px solid #2a3f55" }}
              >
                <Users
                  size={32}
                  className="mx-auto mb-3"
                  style={{ color: "#2a3f55" }}
                />
                <p className="text-sm" style={{ color: "#6B8A9F" }}>
                  Select a channel above to manage its stats
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* ── Videos Tab ───────────────────────────────────────────────────────── */}
        {activeTab === "videos" && (
          <motion.div
            key="videos"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-white font-bold text-lg mb-5">Video Stats</h2>

            {/* Search */}
            <div
              className="rounded-2xl p-5 mb-4"
              style={{ background: "#1a2a3a", border: "1px solid #2a3f55" }}
            >
              <label
                htmlFor="video-search"
                className="block text-xs font-semibold mb-2"
                style={{ color: "#9BB8CC" }}
              >
                Search Video by Title
              </label>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#6B8A9F" }}
                />
                <input
                  type="text"
                  value={videoSearch}
                  onChange={(e) => {
                    setVideoSearch(e.target.value);
                    setSelectedVideoId("");
                  }}
                  id="video-search"
                  data-ocid="videos.search_input"
                  placeholder="Enter video title or link..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-400"
                  style={{ background: "#0F1A24", border: "1px solid #2a3f55" }}
                />
              </div>

              {/* Results list */}
              {videoSearch && filteredVideos.length > 0 && (
                <div
                  className="mt-2 rounded-xl overflow-hidden"
                  style={{ border: "1px solid #2a3f55" }}
                >
                  {filteredVideos.slice(0, 6).map((v, i) => (
                    <button
                      key={v.id}
                      type="button"
                      data-ocid={`videos.item.${i + 1}`}
                      onClick={() => {
                        setSelectedVideoId(v.id);
                        setVideoSearch("");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:opacity-80"
                      style={{
                        background:
                          selectedVideoId === v.id ? "#2a3f55" : "#0F1A24",
                        borderBottom:
                          i < filteredVideos.length - 1
                            ? "1px solid #2a3f55"
                            : undefined,
                      }}
                    >
                      {v.thumbnailUrl && (
                        <img
                          src={v.thumbnailUrl}
                          alt={v.title}
                          className="w-12 h-8 object-cover rounded"
                        />
                      )}
                      <span className="text-sm text-white truncate">
                        {v.title}
                      </span>
                      {v.isShort && (
                        <span
                          className="ml-auto shrink-0 text-xs px-1.5 py-0.5 rounded-full font-bold"
                          style={{ background: "#E53935", color: "white" }}
                        >
                          Short
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {videoSearch && filteredVideos.length === 0 && (
                <p className="text-sm mt-2" style={{ color: "#6B8A9F" }}>
                  No videos found.
                </p>
              )}
            </div>

            {/* Selected video controls */}
            {currentSelectedVideo ? (
              <div
                className="rounded-2xl p-5"
                style={{ background: "#1a2a3a", border: "1px solid #2a3f55" }}
              >
                <div className="flex items-start gap-3 mb-4">
                  {currentSelectedVideo.thumbnailUrl && (
                    <img
                      src={currentSelectedVideo.thumbnailUrl}
                      alt={currentSelectedVideo.title}
                      className="w-20 h-14 object-cover rounded-lg shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">
                      {currentSelectedVideo.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#6B8A9F" }}>
                      ID: {currentSelectedVideo.id}
                    </p>
                  </div>
                  <button
                    type="button"
                    data-ocid="videos.close_button"
                    onClick={() => setSelectedVideoId("")}
                    className="text-xs px-2 py-1 rounded-lg transition-opacity hover:opacity-70"
                    style={{ color: "#6B8A9F", background: "#0F1A24" }}
                  >
                    ✕
                  </button>
                </div>

                {/* Current stats display */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    {
                      label: "Views",
                      val: fmtNum(videoViews(currentSelectedVideo)),
                      color: "#40C4FF",
                    },
                    {
                      label: "Likes",
                      val: fmtNum(videoLikes(currentSelectedVideo)),
                      color: "#E53935",
                    },
                    {
                      label: "Comments",
                      val: fmtNum(videoComments(currentSelectedVideo)),
                      color: "#4CAF50",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl p-3 text-center"
                      style={{ background: "#0F1A24" }}
                    >
                      <p
                        className="text-lg font-black"
                        style={{ color: s.color }}
                      >
                        {s.val}
                      </p>
                      <p className="text-xs" style={{ color: "#6B8A9F" }}>
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Views controls */}
                <div
                  className="mb-4 pb-4"
                  style={{ borderBottom: "1px solid #2a3f55" }}
                >
                  <p
                    className="text-xs font-bold mb-2"
                    style={{ color: "#40C4FF" }}
                  >
                    👁 Views
                  </p>
                  <StatInput
                    label="Increase by"
                    onAction={(n) => increaseViews(selectedVideoId, n)}
                    actionLabel="Increase"
                    ocid="videos.increase_views"
                  />
                  <StatInput
                    label="Set total to"
                    onAction={(n) => setViews(selectedVideoId, n)}
                    actionLabel="Set"
                    ocid="videos.set_views"
                  />
                </div>

                {/* Likes controls */}
                <div
                  className="mb-4 pb-4"
                  style={{ borderBottom: "1px solid #2a3f55" }}
                >
                  <p
                    className="text-xs font-bold mb-2"
                    style={{ color: "#E53935" }}
                  >
                    👍 Likes
                  </p>
                  <StatInput
                    label="Increase by"
                    onAction={(n) => increaseLikes(selectedVideoId, n)}
                    actionLabel="Increase"
                    ocid="videos.increase_likes"
                  />
                  <StatInput
                    label="Set total to"
                    onAction={(n) => setLikes(selectedVideoId, n)}
                    actionLabel="Set"
                    ocid="videos.set_likes"
                  />
                </div>

                {/* Comments controls */}
                <div>
                  <p
                    className="text-xs font-bold mb-2"
                    style={{ color: "#4CAF50" }}
                  >
                    💬 Comments
                  </p>
                  <StatInput
                    label="Increase by"
                    onAction={(n) => increaseComments(selectedVideoId, n)}
                    actionLabel="Increase"
                    ocid="videos.increase_comments"
                  />
                  <StatInput
                    label="Set total to"
                    onAction={(n) => setComments(selectedVideoId, n)}
                    actionLabel="Set"
                    ocid="videos.set_comments"
                  />
                </div>
              </div>
            ) : (
              <div
                data-ocid="videos.empty_state"
                className="rounded-2xl p-10 text-center"
                style={{ background: "#1a2a3a", border: "1px solid #2a3f55" }}
              >
                <Video
                  size={32}
                  className="mx-auto mb-3"
                  style={{ color: "#2a3f55" }}
                />
                <p className="text-sm" style={{ color: "#6B8A9F" }}>
                  Search for a video above to manage its stats
                </p>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
