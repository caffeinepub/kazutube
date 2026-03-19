import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Eye, Send, Share2, ThumbsUp } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { formatViews, timeAgo } from "../store/useStore";
import type { Comment, User, Video } from "../types";
import type { Page } from "../types";

interface VideoPlayerPageProps {
  video: Video | undefined;
  currentUser: User | null;
  uploaderUser: User | undefined;
  onNavigate: (page: Page) => void;
  onToggleLike: (videoId: string, userId: string) => void;
  onAddComment: (videoId: string, comment: Comment) => void;
  onIncrementView: (videoId: string) => void;
  onSubscribe: (channelOwnerId: string, subscriberId: string) => void;
  onUnsubscribe: (channelOwnerId: string, subscriberId: string) => void;
  isSubscribed: (channelOwnerId: string, subscriberId: string) => boolean;
}

function formatSubscribers(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M subscribers`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K subscribers`;
  return `${count} subscriber${count !== 1 ? "s" : ""}`;
}

export default function VideoPlayerPage({
  video,
  currentUser,
  uploaderUser,
  onNavigate,
  onToggleLike,
  onAddComment,
  onIncrementView,
  onSubscribe,
  onUnsubscribe,
  isSubscribed,
}: VideoPlayerPageProps) {
  const [commentText, setCommentText] = useState("");
  const viewCounted = useRef(false);

  useEffect(() => {
    if (!video || viewCounted.current) return;
    const timer = setTimeout(() => {
      onIncrementView(video.id);
      viewCounted.current = true;
    }, 3000);
    return () => clearTimeout(timer);
  }, [video, onIncrementView]);

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-gray-500">Video not found</p>
        <Button onClick={() => onNavigate({ name: "home" })}>Go Home</Button>
      </div>
    );
  }

  const totalViews = (video.baseViews ?? 0) + video.views;
  const totalLikes = (video.baseLikes ?? 0) + video.likes.length;
  const totalComments = (video.baseCommentCount ?? 0) + video.comments.length;

  const hasLiked = currentUser ? video.likes.includes(currentUser.id) : false;
  const subscribed =
    currentUser && video.uploadedBy
      ? isSubscribed(video.uploadedBy, currentUser.id)
      : false;
  const canSubscribe =
    currentUser !== null && currentUser.id !== video.uploadedBy;

  const displayName = uploaderUser ? uploaderUser.name : video.uploaderName;
  const channelHandle = uploaderUser ? uploaderUser.channelName : null;

  const handleLike = () => {
    if (!currentUser) return;
    onToggleLike(video.id, currentUser.id);
  };

  const handleSubscribe = () => {
    if (!currentUser) return;
    if (subscribed) {
      onUnsubscribe(video.uploadedBy, currentUser.id);
      toast("Unsubscribed");
    } else {
      onSubscribe(video.uploadedBy, currentUser.id);
      toast.success(`Subscribed to ${displayName}`);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success("Link copied!");
    });
  };

  const handleComment = () => {
    if (!currentUser || !commentText.trim()) return;
    const comment: Comment = {
      id: Math.random().toString(36).slice(2),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text: commentText.trim(),
      createdAt: new Date().toISOString(),
    };
    onAddComment(video.id, comment);
    setCommentText("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <button
        type="button"
        data-ocid="player.button"
        onClick={() => onNavigate({ name: "home" })}
        className="flex items-center gap-2 text-sm font-medium mb-4 hover:opacity-70 transition-opacity"
        style={{ color: "#40C4FF" }}
      >
        <ArrowLeft size={16} /> Back to Home
      </button>

      <div className="max-w-4xl">
        {/* Video player */}
        <div
          data-ocid="player.canvas_target"
          className="rounded-2xl overflow-hidden mb-5"
          style={{ aspectRatio: "16/9", background: "#0F1A24" }}
        >
          {/* biome-ignore lint/a11y/useMediaCaption: captions not available for user-uploaded content */}
          <video
            src={video.videoUrl}
            controls
            className="w-full h-full"
            style={{ objectFit: "contain", background: "#0F1A24" }}
          />
        </div>

        <h1 className="text-xl font-bold mb-3" style={{ color: "#0F1A24" }}>
          {video.title}
        </h1>

        <div
          className="flex items-center justify-between flex-wrap gap-3 mb-4 pb-4"
          style={{ borderBottom: "1px solid #E0EAF4" }}
        >
          <div className="flex items-center gap-3 flex-wrap">
            <Avatar className="w-10 h-10">
              <AvatarImage src={video.uploaderAvatar} alt={displayName} />
              <AvatarFallback style={{ background: "#E53935", color: "white" }}>
                {displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <button
                type="button"
                data-ocid="player.link"
                onClick={() =>
                  onNavigate({ name: "channel", id: video.uploadedBy })
                }
                className="font-semibold text-sm hover:underline block"
                style={{ color: "#0F1A24" }}
              >
                {displayName}
              </button>
              {channelHandle && (
                <p className="text-xs" style={{ color: "#6B7280" }}>
                  {channelHandle}
                </p>
              )}
              <p className="text-xs" style={{ color: "#9CA3AF" }}>
                {uploaderUser
                  ? formatSubscribers(uploaderUser.subscriberCount)
                  : ""}
              </p>
            </div>

            {canSubscribe && (
              <button
                type="button"
                data-ocid="player.toggle"
                onClick={handleSubscribe}
                className="px-4 py-2 rounded-full font-semibold text-sm transition-all"
                style={{
                  background: subscribed ? "#E5E7EB" : "#E53935",
                  color: subscribed ? "#374151" : "white",
                  border: "none",
                }}
              >
                {subscribed ? "Subscribed" : "Subscribe"}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium"
              style={{ background: "#EEF3F7", color: "#374151" }}
            >
              <Eye size={15} />
              {formatViews(totalViews)}
            </div>

            <button
              type="button"
              data-ocid="player.primary_button"
              onClick={handleLike}
              disabled={!currentUser}
              className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all"
              style={{
                background: hasLiked ? "#E53935" : "#EEF3F7",
                color: hasLiked ? "white" : "#374151",
                border: "none",
              }}
            >
              <ThumbsUp size={16} />
              {totalLikes.toLocaleString()}
            </button>

            <button
              type="button"
              data-ocid="player.secondary_button"
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all"
              style={{
                background: "#EEF3F7",
                color: "#374151",
                border: "none",
              }}
            >
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>

        <p
          className="text-sm mb-6 leading-relaxed"
          style={{ color: "#374151" }}
        >
          {video.description}
        </p>

        <div data-ocid="comments.section">
          <h2 className="font-bold mb-4" style={{ color: "#0F1A24" }}>
            {totalComments.toLocaleString()} Comments
          </h2>

          {currentUser ? (
            <div className="flex gap-3 mb-6">
              <Avatar className="w-9 h-9 shrink-0">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback
                  style={{ background: "#E53935", color: "white" }}
                >
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  data-ocid="comments.textarea"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="resize-none mb-2"
                  rows={2}
                />
                <Button
                  data-ocid="comments.submit_button"
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  size="sm"
                  className="text-white"
                  style={{ background: "#E53935", border: "none" }}
                >
                  <Send size={14} className="mr-1" /> Post
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
              <button
                type="button"
                data-ocid="comments.link"
                className="underline"
                style={{ color: "#40C4FF" }}
                onClick={() => {}}
              >
                Log in
              </button>{" "}
              to comment
            </p>
          )}

          <div className="space-y-4" data-ocid="comments.list">
            {video.comments.map((comment, i) => (
              <div
                key={comment.id}
                data-ocid={`comments.item.${i + 1}`}
                className="flex gap-3"
              >
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarImage
                    src={comment.userAvatar}
                    alt={comment.userName}
                  />
                  <AvatarFallback
                    className="text-xs"
                    style={{ background: "#40C4FF", color: "white" }}
                  >
                    {comment.userName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "#0F1A24" }}
                    >
                      {comment.userName}
                    </span>
                    <span className="text-xs" style={{ color: "#9CA3AF" }}>
                      {timeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: "#374151" }}>
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
