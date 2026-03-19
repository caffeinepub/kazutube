import { useCallback, useEffect, useState } from "react";
import type { Comment, User, Video } from "../types";

const USERS_KEY = "kz_users";
const VIDEOS_KEY = "kz_videos";
const CURRENT_USER_KEY = "kz_current_user";
const SUBSCRIPTIONS_KEY = "kz_subscriptions";
const SEED_VER_KEY = "kz_seed_ver";
const SEED_VERSION = "v7";

function genId(): string {
  return Math.random().toString(36).slice(2, 10);
}

const FAKE_USERS = [
  {
    id: "fu_animeFan21",
    name: "animeFan21",
    avatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=AF&backgroundColor=7C3AED&textColor=ffffff",
  },
  {
    id: "fu_otaku_editz",
    name: "otaku_editz",
    avatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=OE&backgroundColor=059669&textColor=ffffff",
  },
  {
    id: "fu_naruto_x",
    name: "naruto_x",
    avatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=NX&backgroundColor=D97706&textColor=ffffff",
  },
  {
    id: "fu_solo_leveler",
    name: "solo_leveler",
    avatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=SL&backgroundColor=DC2626&textColor=ffffff",
  },
  {
    id: "fu_gojo_fan",
    name: "gojo_fan",
    avatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=GF&backgroundColor=0284C7&textColor=ffffff",
  },
  {
    id: "fu_edit_master",
    name: "edit_master",
    avatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=EM&backgroundColor=BE185D&textColor=ffffff",
  },
];

const SAMPLE_COMMENT_TEXTS = [
  "This edit is absolutely insane!! 🔥🔥",
  "Bro the transitions are so clean, how do you do this?",
  "W edit as always, keep it up man 💯",
  "This goes crazy hard ngl",
  "The music sync is perfect, love it!",
  "Every single edit hits different fr",
  "Can't stop rewatching this 😭😭",
  "The color grading is on another level",
  "This deserves way more views honestly",
  "Bro woke up and chose to go crazy with the edits 🔥",
  "This is literally the best edit I've seen this week",
  "The way you timed that to the beat 🤯",
  "Keep posting bro, you're criminally underrated",
  "Subscribed instantly after watching this",
  "The effects are so smooth omg",
  "This style is so unique, nobody edits like you",
  "I showed this to my friends and they went crazy",
  "Bro said no cap and delivered 🔥",
  "Editing on god tier rn",
  "Please drop a tutorial on how you do these transitions",
];

function makeSampleComments(): Comment[] {
  const now = Date.now();
  const comments: Comment[] = [];
  const offsets = [
    3 * 3600 * 1000,
    7 * 3600 * 1000,
    14 * 3600 * 1000,
    1 * 86400 * 1000,
    2 * 86400 * 1000,
    3 * 86400 * 1000,
    5 * 86400 * 1000,
    7 * 86400 * 1000,
    10 * 86400 * 1000,
    14 * 86400 * 1000,
    18 * 86400 * 1000,
    21 * 86400 * 1000,
    25 * 86400 * 1000,
    30 * 86400 * 1000,
    35 * 86400 * 1000,
    42 * 86400 * 1000,
    50 * 86400 * 1000,
    55 * 86400 * 1000,
    60 * 86400 * 1000,
    70 * 86400 * 1000,
  ];
  for (let i = 0; i < SAMPLE_COMMENT_TEXTS.length; i++) {
    const fakeUser = FAKE_USERS[i % FAKE_USERS.length];
    comments.push({
      id: `sc_${i}`,
      userId: fakeUser.id,
      userName: fakeUser.name,
      userAvatar: fakeUser.avatar,
      text: SAMPLE_COMMENT_TEXTS[i],
      createdAt: new Date(now - offsets[i]).toISOString(),
    });
  }
  // Return in reverse so newest first
  return comments.reverse();
}

function initSeedData() {
  if (localStorage.getItem(SEED_VER_KEY) === SEED_VERSION) return;

  // Clear old data
  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem(VIDEOS_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);

  const ownerId = "owner_001";
  const users: User[] = [
    {
      id: ownerId,
      email: "owner@kazutube.com",
      password: "kazutube123",
      name: "KAZUYA EDITX",
      role: "owner",
      createdAt: new Date(Date.now() - 180 * 86400000).toISOString(),
      channelName: "@KazuyaXedit",
      avatar:
        "https://api.dicebear.com/7.x/initials/svg?seed=KX&backgroundColor=E53935&textColor=ffffff",
      subscriberCount: 45000,
    },
  ];

  const videos: Video[] = [];

  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos));
  localStorage.setItem(SEED_VER_KEY, SEED_VERSION);
}

export function loadUsers(): User[] {
  initSeedData();
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function loadVideos(): Video[] {
  initSeedData();
  try {
    return JSON.parse(localStorage.getItem(VIDEOS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function saveVideos(videos: Video[]) {
  localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos));
}

export function loadSubscriptions(): Record<string, string[]> {
  try {
    return JSON.parse(localStorage.getItem(SUBSCRIPTIONS_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveSubscriptions(subs: Record<string, string[]>) {
  localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subs));
}

export function getCurrentUserId(): string | null {
  return localStorage.getItem(CURRENT_USER_KEY);
}

export function setCurrentUserId(id: string | null) {
  if (id) localStorage.setItem(CURRENT_USER_KEY, id);
  else localStorage.removeItem(CURRENT_USER_KEY);
}

export function formatViews(views: number): string {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
  if (views >= 1000) return `${(views / 1000).toFixed(0)}K views`;
  return `${views} views`;
}

export function timeAgo(isoDate: string): string {
  const seconds = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function useKzStore() {
  const [users, setUsersState] = useState<User[]>(() => loadUsers());
  const [videos, setVideosState] = useState<Video[]>(() => loadVideos());
  const [currentUserId, setCurrentUserIdState] = useState<string | null>(() =>
    getCurrentUserId(),
  );
  const [subscriptions, setSubscriptionsState] = useState<
    Record<string, string[]>
  >(() => loadSubscriptions());

  // Cross-tab sync: picks up changes made by the admin panel in another tab
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === VIDEOS_KEY && e.newValue) {
        try {
          setVideosState(JSON.parse(e.newValue));
        } catch {}
      } else if (e.key === USERS_KEY && e.newValue) {
        try {
          setUsersState(JSON.parse(e.newValue));
        } catch {}
      } else if (e.key === SUBSCRIPTIONS_KEY && e.newValue) {
        try {
          setSubscriptionsState(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Visibility sync: reload from localStorage when this tab becomes visible again
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        setVideosState(loadVideos());
        setUsersState(loadUsers());
        setSubscriptionsState(loadSubscriptions());
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  const currentUser = users.find((u) => u.id === currentUserId) || null;

  const setUsers = useCallback((u: User[]) => {
    setUsersState(u);
    saveUsers(u);
  }, []);

  const setVideos = useCallback((v: Video[]) => {
    setVideosState(v);
    saveVideos(v);
  }, []);

  const setSubscriptions = useCallback((subs: Record<string, string[]>) => {
    setSubscriptionsState(subs);
    saveSubscriptions(subs);
  }, []);

  const login = useCallback(
    (email: string, password: string): boolean => {
      const user = users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password,
      );
      if (!user) return false;
      if (user.role === "banned") return false;
      setCurrentUserIdState(user.id);
      setCurrentUserId(user.id);
      return true;
    },
    [users],
  );

  const signup = useCallback(
    (
      name: string,
      email: string,
      password: string,
    ): { success: boolean; error?: string } => {
      const exists = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );
      if (exists) return { success: false, error: "Email already registered" };
      const newUser: User = {
        id: `user_${genId()}`,
        email,
        password,
        name,
        role: "user",
        createdAt: new Date().toISOString(),
        channelName: `${name}'s Channel`,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=40C4FF&textColor=ffffff`,
        subscriberCount: 0,
      };
      const updated = [...users, newUser];
      setUsers(updated);
      setCurrentUserIdState(newUser.id);
      setCurrentUserId(newUser.id);
      return { success: true };
    },
    [users, setUsers],
  );

  const logout = useCallback(() => {
    setCurrentUserIdState(null);
    setCurrentUserId(null);
  }, []);

  const addVideo = useCallback(
    (
      video: Omit<
        Video,
        | "id"
        | "views"
        | "likes"
        | "comments"
        | "createdAt"
        | "baseViews"
        | "baseLikes"
        | "baseCommentCount"
      >,
    ) => {
      const newVideo: Video = {
        ...video,
        id: `vid_${genId()}`,
        views: 0,
        likes: [],
        comments: makeSampleComments(),
        createdAt: new Date().toISOString(),
        baseViews: 214000,
        baseLikes: 12000,
        baseCommentCount: 3000,
      };
      const updated = [newVideo, ...videos];
      setVideos(updated);
      return newVideo.id;
    },
    [videos, setVideos],
  );

  const toggleLike = useCallback(
    (videoId: string, userId: string) => {
      const updated = videos.map((v) => {
        if (v.id !== videoId) return v;
        const hasLiked = v.likes.includes(userId);
        return {
          ...v,
          likes: hasLiked
            ? v.likes.filter((id) => id !== userId)
            : [...v.likes, userId],
        };
      });
      setVideos(updated);
    },
    [videos, setVideos],
  );

  const addComment = useCallback(
    (videoId: string, comment: Comment) => {
      const updated = videos.map((v) =>
        v.id === videoId ? { ...v, comments: [comment, ...v.comments] } : v,
      );
      setVideos(updated);
    },
    [videos, setVideos],
  );

  const incrementView = useCallback(
    (videoId: string) => {
      const updated = videos.map((v) =>
        v.id === videoId ? { ...v, views: v.views + 1 } : v,
      );
      setVideos(updated);
    },
    [videos, setVideos],
  );

  const deleteVideo = useCallback(
    (videoId: string) => {
      setVideos(videos.filter((v) => v.id !== videoId));
    },
    [videos, setVideos],
  );

  const banUser = useCallback(
    (userId: string, ban: boolean) => {
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, role: ban ? "banned" : "user" } : u,
        ),
      );
    },
    [users, setUsers],
  );

  const setVideoViews = useCallback(
    (videoId: string, count: number) => {
      setVideos(
        videos.map((v) => (v.id === videoId ? { ...v, views: count } : v)),
      );
    },
    [videos, setVideos],
  );

  const subscribe = useCallback(
    (channelOwnerId: string, subscriberId: string) => {
      const current = subscriptions[channelOwnerId] || [];
      if (current.includes(subscriberId)) return;
      const updated = {
        ...subscriptions,
        [channelOwnerId]: [...current, subscriberId],
      };
      setSubscriptions(updated);
      setUsers(
        users.map((u) =>
          u.id === channelOwnerId
            ? { ...u, subscriberCount: u.subscriberCount + 1 }
            : u,
        ),
      );
    },
    [subscriptions, setSubscriptions, users, setUsers],
  );

  const unsubscribe = useCallback(
    (channelOwnerId: string, subscriberId: string) => {
      const current = subscriptions[channelOwnerId] || [];
      const updated = {
        ...subscriptions,
        [channelOwnerId]: current.filter((id) => id !== subscriberId),
      };
      setSubscriptions(updated);
      setUsers(
        users.map((u) =>
          u.id === channelOwnerId
            ? { ...u, subscriberCount: Math.max(0, u.subscriberCount - 1) }
            : u,
        ),
      );
    },
    [subscriptions, setSubscriptions, users, setUsers],
  );

  const isSubscribed = useCallback(
    (channelOwnerId: string, subscriberId: string): boolean => {
      return (subscriptions[channelOwnerId] || []).includes(subscriberId);
    },
    [subscriptions],
  );

  return {
    users,
    videos,
    currentUser,
    currentUserId,
    subscriptions,
    login,
    signup,
    logout,
    addVideo,
    toggleLike,
    addComment,
    incrementView,
    deleteVideo,
    banUser,
    setVideoViews,
    subscribe,
    unsubscribe,
    isSubscribed,
  };
}
