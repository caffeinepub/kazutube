import { ArrowLeft, MessageCircle, ThumbsUp } from "lucide-react";
import { motion } from "motion/react";
import { formatViews } from "../store/useStore";
import type { User, Video } from "../types";
import type { Page } from "../types";

interface ShortsPageProps {
  shorts: Video[];
  currentUser: User | null;
  onNavigate: (page: Page) => void;
  onToggleLike: (videoId: string, userId: string) => void;
}

export default function ShortsPage({
  shorts,
  currentUser,
  onNavigate,
  onToggleLike,
}: ShortsPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <button
        type="button"
        data-ocid="shorts.button"
        onClick={() => onNavigate({ name: "home" })}
        className="flex items-center gap-2 text-sm font-medium mb-6 hover:opacity-70 transition-opacity"
        style={{ color: "#40C4FF" }}
      >
        <ArrowLeft size={16} /> Back to Home
      </button>

      <h1 className="text-2xl font-bold mb-6" style={{ color: "#0F1A24" }}>
        <span style={{ color: "#E53935" }}>Shorts</span>
      </h1>

      <div className="flex flex-col gap-8 items-center">
        {shorts.length === 0 && (
          <p data-ocid="shorts.empty_state" className="text-gray-400 py-20">
            No shorts available yet.
          </p>
        )}
        {shorts.map((video, i) => (
          <div
            key={video.id}
            data-ocid={`shorts.item.${i + 1}`}
            className="relative rounded-2xl overflow-hidden"
            style={{
              width: "min(380px, 100%)",
              aspectRatio: "9/16",
              background: "#0F1A24",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            }}
          >
            <iframe
              src={video.videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={video.title}
            />
            {/* Overlay info */}
            <div
              className="absolute bottom-0 left-0 right-0 p-4"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)",
              }}
            >
              <p className="text-white font-semibold mb-1">{video.title}</p>
              <p className="text-white/60 text-sm">{video.uploaderName}</p>
            </div>
            {/* Right actions */}
            <div className="absolute right-4 bottom-20 flex flex-col gap-4 items-center">
              <button
                type="button"
                data-ocid={`shorts.toggle.${i + 1}`}
                onClick={() =>
                  currentUser && onToggleLike(video.id, currentUser.id)
                }
                className="flex flex-col items-center gap-1"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      currentUser && video.likes.includes(currentUser.id)
                        ? "#E53935"
                        : "rgba(255,255,255,0.2)",
                  }}
                >
                  <ThumbsUp size={18} color="white" />
                </div>
                <span className="text-white text-xs">{video.likes.length}</span>
              </button>
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  <MessageCircle size={18} color="white" />
                </div>
                <span className="text-white text-xs">
                  {video.comments.length}
                </span>
              </div>
            </div>
            {/* View count */}
            <div className="absolute top-4 left-4">
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: "rgba(0,0,0,0.5)", color: "white" }}
              >
                {formatViews(video.views)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
