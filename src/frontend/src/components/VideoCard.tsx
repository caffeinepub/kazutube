import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "motion/react";
import { formatViews, timeAgo } from "../store/useStore";
import type { Video } from "../types";

interface VideoCardProps {
  video: Video;
  onClick: () => void;
  index?: number;
}

export default function VideoCard({
  video,
  onClick,
  index = 0,
}: VideoCardProps) {
  return (
    <motion.div
      data-ocid={`videos.item.${index + 1}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onClick}
      className="cursor-pointer group"
    >
      {/* Thumbnail */}
      <div
        className="relative rounded-xl overflow-hidden mb-3"
        style={{ aspectRatio: "16/9" }}
      >
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Duration badge */}
        <span
          className="absolute bottom-2 right-2 rounded-md px-1.5 py-0.5 text-xs font-semibold"
          style={{ background: "rgba(0,0,0,0.8)", color: "white" }}
        >
          {video.duration}
        </span>
      </div>

      {/* Meta */}
      <div className="flex gap-3">
        <Avatar className="w-9 h-9 shrink-0 mt-0.5">
          <AvatarImage src={video.uploaderAvatar} alt={video.uploaderName} />
          <AvatarFallback
            className="text-xs"
            style={{ background: "#E53935", color: "white" }}
          >
            {video.uploaderName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h3
            className="text-sm font-semibold line-clamp-2 leading-snug mb-1"
            style={{ color: "#0F1A24" }}
          >
            {video.title}
          </h3>
          <p className="text-xs" style={{ color: "#6B7280" }}>
            {video.uploaderName}
          </p>
          <p className="text-xs" style={{ color: "#9CA3AF" }}>
            {formatViews(video.views)} · {timeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
