import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { User, Video } from "../types";
import type { Page } from "../types";

interface UploadPageProps {
  currentUser: User | null;
  onNavigate: (page: Page) => void;
  onAddVideo: (
    video: Omit<Video, "id" | "views" | "likes" | "comments" | "createdAt">,
  ) => void;
}

export default function UploadPage({
  currentUser,
  onNavigate,
  onAddVideo,
}: UploadPageProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isShort, setIsShort] = useState(false);
  const [tags, setTags] = useState("");
  const [duration, setDuration] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const isOwner = currentUser?.role === "owner";

  const handleSubmit = () => {
    setError("");
    if (!title.trim() || !videoUrl.trim()) {
      setError("Title and Video URL are required.");
      return;
    }
    onAddVideo({
      title: title.trim(),
      description: description.trim(),
      thumbnailUrl:
        thumbnailUrl.trim() ||
        `https://picsum.photos/seed/${Math.random()}/480/270`,
      videoUrl: videoUrl.trim(),
      uploadedBy: currentUser!.id,
      uploaderName: currentUser!.channelName,
      uploaderAvatar: currentUser!.avatar,
      isShort,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      duration: duration.trim() || "0:00",
    });
    setSuccess(true);
    setTimeout(() => onNavigate({ name: "home" }), 1500);
  };

  if (!isOwner) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
        data-ocid="upload.panel"
      >
        <div
          className="rounded-3xl p-12 max-w-md w-full"
          style={{
            background: "white",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          <Clock
            size={64}
            className="mx-auto mb-4"
            style={{ color: "#40C4FF" }}
          />
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#0F1A24" }}>
            Coming Soon
          </h2>
          <p className="mb-6" style={{ color: "#6B7280" }}>
            Video uploading is currently only available to the channel owner.
            Stay tuned for creator tools!
          </p>
          <Button
            data-ocid="upload.button"
            onClick={() => onNavigate({ name: "home" })}
            className="text-white"
            style={{ background: "#E53935", border: "none" }}
          >
            Back to Home
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      data-ocid="upload.panel"
    >
      <h1 className="text-2xl font-bold mb-6" style={{ color: "#0F1A24" }}>
        <Upload
          className="inline mr-2"
          size={24}
          style={{ color: "#E53935" }}
        />
        Upload Video
      </h1>

      <div className="max-w-xl bg-white rounded-2xl p-6 shadow-card">
        <div className="space-y-4">
          <div>
            <Label htmlFor="up-title">Title *</Label>
            <Input
              data-ocid="upload.input"
              id="up-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="up-desc">Description</Label>
            <Textarea
              data-ocid="upload.textarea"
              id="up-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this video about?"
              className="mt-1"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="up-thumb">Thumbnail URL</Label>
            <Input
              data-ocid="upload.input"
              id="up-thumb"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://..."
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="up-video">Video URL (YouTube Embed) *</Label>
            <Input
              data-ocid="upload.input"
              id="up-video"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/embed/..."
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="up-duration">Duration (e.g. 5:30)</Label>
            <Input
              data-ocid="upload.input"
              id="up-duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="mm:ss"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="up-tags">Tags (comma separated)</Label>
            <Input
              data-ocid="upload.input"
              id="up-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="react, javascript, tutorial"
              className="mt-1"
            />
          </div>
          <div className="flex items-center gap-3">
            <Switch
              data-ocid="upload.switch"
              id="up-short"
              checked={isShort}
              onCheckedChange={setIsShort}
            />
            <Label htmlFor="up-short">This is a Short (vertical video)</Label>
          </div>

          {error && (
            <p
              data-ocid="upload.error_state"
              className="text-sm"
              style={{ color: "#E53935" }}
            >
              {error}
            </p>
          )}
          {success && (
            <p
              data-ocid="upload.success_state"
              className="text-sm font-semibold"
              style={{ color: "#16A34A" }}
            >
              Video uploaded successfully! Redirecting...
            </p>
          )}

          <Button
            data-ocid="upload.submit_button"
            onClick={handleSubmit}
            disabled={success}
            className="w-full text-white font-semibold"
            style={{ background: "#E53935", border: "none" }}
          >
            Upload Video
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
