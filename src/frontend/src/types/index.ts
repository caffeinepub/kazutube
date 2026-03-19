export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "owner" | "user" | "banned";
  createdAt: string;
  channelName: string;
  avatar: string;
  subscriberCount: number;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  views: number;
  likes: string[];
  comments: Comment[];
  uploadedBy: string;
  uploaderName: string;
  uploaderAvatar: string;
  isShort: boolean;
  createdAt: string;
  tags: string[];
  duration: string;
  baseViews?: number;
  baseLikes?: number;
  baseCommentCount?: number;
}

export type Page =
  | { name: "home" }
  | { name: "video"; id: string }
  | { name: "shorts" }
  | { name: "channel"; id: string }
  | { name: "search"; query: string }
  | { name: "admin" }
  | { name: "upload" };
