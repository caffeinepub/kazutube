import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import VideoCard from "../components/VideoCard";
import type { User, Video } from "../types";
import type { Page } from "../types";

interface ChannelPageProps {
  channelUser: User | undefined;
  videos: Video[];
  currentUser: User | null;
  onNavigate: (page: Page) => void;
  onSubscribe: (channelOwnerId: string, subscriberId: string) => void;
  onUnsubscribe: (channelOwnerId: string, subscriberId: string) => void;
  isSubscribed: (channelOwnerId: string, subscriberId: string) => boolean;
}

export default function ChannelPage({
  channelUser,
  videos,
  currentUser,
  onNavigate,
  onSubscribe,
  onUnsubscribe,
  isSubscribed,
}: ChannelPageProps) {
  if (!channelUser) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p style={{ color: "#6B7280" }}>Channel not found.</p>
      </div>
    );
  }

  const channelVideos = videos.filter(
    (v) => v.uploadedBy === channelUser.id && !v.isShort,
  );
  const channelShorts = videos.filter(
    (v) => v.uploadedBy === channelUser.id && v.isShort,
  );

  const subCount =
    channelUser.subscriberCount >= 1000000
      ? `${(channelUser.subscriberCount / 1000000).toFixed(1)}M`
      : channelUser.subscriberCount >= 1000
        ? `${(channelUser.subscriberCount / 1000).toFixed(1)}K`
        : String(channelUser.subscriberCount);

  const subscribed = currentUser
    ? isSubscribed(channelUser.id, currentUser.id)
    : false;
  const canSubscribe =
    currentUser !== null && currentUser.id !== channelUser.id;

  const handleSubscribeToggle = () => {
    if (!currentUser) return;
    if (subscribed) {
      onUnsubscribe(channelUser.id, currentUser.id);
      toast("Unsubscribed");
    } else {
      onSubscribe(channelUser.id, currentUser.id);
      toast.success(`Subscribed to ${channelUser.name}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <button
        type="button"
        data-ocid="channel.button"
        onClick={() => onNavigate({ name: "home" })}
        className="flex items-center gap-2 text-sm font-medium mb-4 hover:opacity-70 transition-opacity"
        style={{ color: "#40C4FF" }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Channel banner */}
      <div
        className="rounded-2xl mb-6 flex items-end p-6 relative overflow-hidden"
        style={{
          height: 180,
          background:
            "linear-gradient(135deg, #0F1A24 0%, #1a2d3f 50%, #0B131B 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 50%, #E53935 0%, transparent 50%), radial-gradient(circle at 70% 50%, #40C4FF 0%, transparent 50%)",
          }}
        />
        <div className="flex items-center gap-4 relative z-10 flex-wrap">
          <Avatar
            className="w-20 h-20 border-4"
            style={{ borderColor: "#E53935" }}
          >
            <AvatarImage src={channelUser.avatar} alt={channelUser.name} />
            <AvatarFallback
              className="text-2xl"
              style={{ background: "#E53935", color: "white" }}
            >
              {channelUser.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">
              {channelUser.name}
            </h1>
            <p className="text-white/60 text-sm font-medium">
              {channelUser.channelName}
            </p>
            <p className="text-white/50 text-sm mt-0.5">
              {subCount} subscribers ·{" "}
              {channelVideos.length + channelShorts.length} videos
            </p>
          </div>

          {/* Subscribe button */}
          {canSubscribe && (
            <button
              type="button"
              data-ocid="channel.toggle"
              onClick={handleSubscribeToggle}
              className="px-5 py-2.5 rounded-full font-semibold text-sm transition-all"
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
      </div>

      {/* Videos */}
      {channelVideos.length > 0 && (
        <section data-ocid="channel.section" className="mb-8">
          <h2 className="text-lg font-bold mb-4" style={{ color: "#0F1A24" }}>
            Videos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {channelVideos.map((video, i) => (
              <VideoCard
                key={video.id}
                video={video}
                index={i}
                onClick={() => onNavigate({ name: "video", id: video.id })}
              />
            ))}
          </div>
        </section>
      )}

      {channelShorts.length > 0 && (
        <section data-ocid="channel.shorts_section" className="mb-8">
          <h2 className="text-lg font-bold mb-4" style={{ color: "#0F1A24" }}>
            Shorts
          </h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {channelShorts.map((video) => (
              <button
                key={video.id}
                type="button"
                data-ocid="channel.card"
                onClick={() => onNavigate({ name: "video", id: video.id })}
                className="shrink-0 rounded-2xl overflow-hidden relative"
                style={{ width: 130, height: 232 }}
              >
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)",
                  }}
                />
                <p className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium line-clamp-2">
                  {video.title}
                </p>
              </button>
            ))}
          </div>
        </section>
      )}

      {channelVideos.length === 0 && channelShorts.length === 0 && (
        <div data-ocid="channel.empty_state" className="text-center py-20">
          <p style={{ color: "#6B7280" }}>No videos uploaded yet.</p>
        </div>
      )}
    </motion.div>
  );
}
