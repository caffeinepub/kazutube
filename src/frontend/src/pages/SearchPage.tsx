import { motion } from "motion/react";
import VideoCard from "../components/VideoCard";
import type { User, Video } from "../types";
import type { Page } from "../types";

interface SearchPageProps {
  query: string;
  videos: Video[];
  users: User[];
  onNavigate: (page: Page) => void;
}

export default function SearchPage({
  query,
  videos,
  users,
  onNavigate,
}: SearchPageProps) {
  const q = query.toLowerCase();
  const matchedVideos = videos.filter(
    (v) =>
      v.title.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q) ||
      v.tags.some((t) => t.toLowerCase().includes(q)) ||
      v.uploaderName.toLowerCase().includes(q),
  );
  const matchedChannels = users.filter(
    (u) =>
      u.channelName.toLowerCase().includes(q) ||
      u.name.toLowerCase().includes(q),
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-xl font-bold mb-6" style={{ color: "#0F1A24" }}>
        Results for <span style={{ color: "#E53935" }}>&#34;{query}&#34;</span>
      </h1>

      {matchedChannels.length > 0 && (
        <section data-ocid="search.channels_section" className="mb-8">
          <h2
            className="text-lg font-semibold mb-3"
            style={{ color: "#0F1A24" }}
          >
            Channels
          </h2>
          <div className="flex flex-col gap-3">
            {matchedChannels.map((u) => (
              <button
                key={u.id}
                type="button"
                data-ocid="search.link"
                onClick={() => onNavigate({ name: "channel", id: u.id })}
                className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-card hover:shadow-card-hover transition-shadow text-left"
              >
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold" style={{ color: "#0F1A24" }}>
                    {u.channelName}
                  </p>
                  <p className="text-sm" style={{ color: "#6B7280" }}>
                    {u.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {matchedVideos.length > 0 ? (
        <section data-ocid="search.videos_section">
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: "#0F1A24" }}
          >
            Videos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedVideos.map((video, i) => (
              <VideoCard
                key={video.id}
                video={video}
                index={i}
                onClick={() => onNavigate({ name: "video", id: video.id })}
              />
            ))}
          </div>
        </section>
      ) : (
        <div data-ocid="search.empty_state" className="text-center py-20">
          <p
            className="text-xl font-semibold mb-2"
            style={{ color: "#374151" }}
          >
            No results found
          </p>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            Try different keywords
          </p>
        </div>
      )}
    </motion.div>
  );
}
