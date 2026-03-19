import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import VideoCard from "../components/VideoCard";
import type { Video } from "../types";
import type { Page } from "../types";

interface HomePageProps {
  videos: Video[];
  onNavigate: (page: Page) => void;
}

export default function HomePage({ videos, onNavigate }: HomePageProps) {
  const shorts = videos.filter((v) => v.isShort);
  const regular = videos.filter((v) => !v.isShort);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      {/* Shorts strip */}
      {shorts.length > 0 && (
        <section data-ocid="shorts.section" className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: "#0F1A24" }}>
              Shorts
            </h2>
            <button
              type="button"
              data-ocid="shorts.link"
              onClick={() => onNavigate({ name: "shorts" })}
              className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: "#40C4FF" }}
            >
              See all <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {shorts.map((video) => (
              <button
                key={video.id}
                type="button"
                data-ocid="shorts.card"
                onClick={() => onNavigate({ name: "video", id: video.id })}
                className="shrink-0 group relative rounded-2xl overflow-hidden"
                style={{ width: 140, height: 248 }}
              >
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)",
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-white text-xs font-medium line-clamp-2">
                    {video.title}
                  </p>
                </div>
                <span
                  className="absolute top-2 right-2 rounded-full px-1.5 py-0.5 text-xs font-bold"
                  style={{ background: "#E53935", color: "white" }}
                >
                  Short
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Video grid */}
      <section data-ocid="videos.section">
        <div className="mb-4">
          <h2 className="text-lg font-bold" style={{ color: "#0F1A24" }}>
            All Videos
          </h2>
        </div>
        {regular.length === 0 ? (
          <div data-ocid="videos.empty_state" className="text-center py-20">
            <p className="text-5xl mb-4">🎬</p>
            <p
              className="text-lg font-semibold mb-2"
              style={{ color: "#0F1A24" }}
            >
              No videos yet
            </p>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              No videos have been uploaded yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regular.map((video, i) => (
              <VideoCard
                key={video.id}
                video={video}
                index={i}
                onClick={() => onNavigate({ name: "video", id: video.id })}
              />
            ))}
          </div>
        )}
      </section>
    </motion.div>
  );
}
