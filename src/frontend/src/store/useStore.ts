import { useCallback, useState } from "react";
import type { Comment, User, Video } from "../types";

const USERS_KEY = "kz_users";
const VIDEOS_KEY = "kz_videos";
const CURRENT_USER_KEY = "kz_current_user";
const SUBSCRIPTIONS_KEY = "kz_subscriptions";
const SEED_VER_KEY = "kz_seed_ver";
const SEED_VERSION = "v6";

function genId(): string {
  return Math.random().toString(36).slice(2, 10);
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
      subscriberCount: 0,
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
      video: Omit<Video, "id" | "views" | "likes" | "comments" | "createdAt">,
    ) => {
      const newVideo: Video = {
        ...video,
        id: `vid_${genId()}`,
        views: 0,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
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
        v.id === videoId ? { ...v, comments: [...v.comments, comment] } : v,
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
