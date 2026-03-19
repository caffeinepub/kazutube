import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { HttpAgent } from "@icp-sdk/core/agent";
import { ImageIcon, LogIn, Upload, VideoIcon } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { loadConfig } from "../config";
import type { Page, User, Video } from "../types";
import { StorageClient } from "../utils/StorageClient";

interface UploadPageProps {
  currentUser: User | null;
  onNavigate: (page: Page) => void;
  onAddVideo: (
    video: Omit<Video, "id" | "views" | "likes" | "comments" | "createdAt">,
  ) => void;
  onLoginClick?: () => void;
}

export default function UploadPage({
  currentUser,
  onNavigate,
  onAddVideo,
  onLoginClick,
}: UploadPageProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isShort, setIsShort] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [detectedDuration, setDetectedDuration] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const detectDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const el = document.createElement("video");
      el.preload = "metadata";
      el.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(el.duration);
      };
      el.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(0);
      };
      el.src = url;
    });
  };

  const formatDuration = (secs: number): string => {
    return `${Math.floor(secs / 60)}:${String(Math.floor(secs % 60)).padStart(2, "0")}`;
  };

  const handleVideoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    setError("");
    const dur = await detectDuration(file);
    setDetectedDuration(dur);
    if (isShort && dur > 60) {
      setError("Shorts must be 60 seconds or under");
    }
  };

  const handleShortToggle = (val: boolean) => {
    setIsShort(val);
    if (val && detectedDuration > 60) {
      setError("Shorts must be 60 seconds or under");
    } else {
      setError("");
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!videoFile) {
      setError("Please select a video file.");
      return;
    }
    if (!thumbnailFile) {
      setError("Please select a thumbnail image.");
      return;
    }
    if (isShort && detectedDuration > 60) {
      setError("Shorts must be 60 seconds or under");
      return;
    }

    setUploading(true);
    try {
      const config = await loadConfig();
      const agent = new HttpAgent({ host: config.backend_host });
      const storage = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );

      const thumbBytes = new Uint8Array(await thumbnailFile.arrayBuffer());
      const { hash: thumbHash } = await storage.putFile(thumbBytes);
      const thumbnailUrl = await storage.getDirectURL(thumbHash);

      const videoBytes = new Uint8Array(await videoFile.arrayBuffer());
      const { hash: videoHash } = await storage.putFile(videoBytes);
      const videoUrl = await storage.getDirectURL(videoHash);

      onAddVideo({
        title: title.trim(),
        description: description.trim(),
        thumbnailUrl,
        videoUrl,
        uploadedBy: currentUser!.id,
        uploaderName: currentUser!.name,
        uploaderAvatar: currentUser!.avatar,
        isShort,
        tags: [],
        duration: formatDuration(detectedDuration),
      });

      setSuccess(true);
      setTimeout(() => onNavigate({ name: "home" }), 1500);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (!currentUser) {
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
          <LogIn
            size={64}
            className="mx-auto mb-4"
            style={{ color: "#40C4FF" }}
          />
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#0F1A24" }}>
            Sign in to Upload
          </h2>
          <p className="mb-6" style={{ color: "#6B7280" }}>
            You need to be logged in to upload videos.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              data-ocid="upload.login_button"
              onClick={onLoginClick}
              className="text-white"
              style={{ background: "#E53935", border: "none" }}
            >
              Sign In
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigate({ name: "home" })}
            >
              Back to Home
            </Button>
          </div>
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
        <div className="space-y-5">
          {/* Title */}
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

          {/* Description */}
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

          {/* Video file */}
          <div>
            <Label htmlFor="video-file-input">Video File *</Label>
            <label
              htmlFor="video-file-input"
              className="mt-1 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-blue-400 transition-colors flex flex-col items-center"
              style={{ borderColor: videoFile ? "#40C4FF" : "#D1D5DB" }}
            >
              <VideoIcon
                size={32}
                className="mb-2"
                style={{ color: videoFile ? "#40C4FF" : "#9CA3AF" }}
              />
              {videoFile ? (
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#0F1A24" }}
                  >
                    {videoFile.name}
                  </p>
                  {detectedDuration > 0 && (
                    <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
                      Duration: {formatDuration(detectedDuration)}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm" style={{ color: "#6B7280" }}>
                  Click to select a video from your device
                </p>
              )}
              <input
                ref={videoInputRef}
                id="video-file-input"
                data-ocid="upload.upload_button"
                type="file"
                accept="video/mp4,video/webm,.mov"
                className="hidden"
                onChange={handleVideoSelect}
              />
            </label>
          </div>

          {/* Thumbnail */}
          <div>
            <Label htmlFor="thumb-file-input">Thumbnail Image *</Label>
            <label
              htmlFor="thumb-file-input"
              className="mt-1 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-blue-400 transition-colors flex flex-col items-center"
              style={{ borderColor: thumbnailFile ? "#40C4FF" : "#D1D5DB" }}
            >
              {thumbnailFile ? (
                <div className="flex items-center gap-3">
                  <img
                    src={URL.createObjectURL(thumbnailFile)}
                    alt="thumbnail preview"
                    className="h-16 rounded object-cover"
                  />
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#0F1A24" }}
                  >
                    {thumbnailFile.name}
                  </p>
                </div>
              ) : (
                <>
                  <ImageIcon
                    size={32}
                    className="mb-2"
                    style={{ color: "#9CA3AF" }}
                  />
                  <p className="text-sm" style={{ color: "#6B7280" }}>
                    Click to select a thumbnail image from your device
                  </p>
                </>
              )}
              <input
                ref={thumbInputRef}
                id="thumb-file-input"
                data-ocid="upload.dropzone"
                type="file"
                accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setThumbnailFile(file);
                }}
              />
            </label>
          </div>

          {/* Short toggle */}
          <div className="flex items-center gap-3">
            <Switch
              data-ocid="upload.switch"
              id="up-short"
              checked={isShort}
              onCheckedChange={handleShortToggle}
            />
            <Label htmlFor="up-short">This is a Short (≤ 60 seconds)</Label>
          </div>

          {error && (
            <p
              data-ocid="upload.error_state"
              className="text-sm font-medium"
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
            disabled={uploading || success}
            className="w-full text-white font-semibold"
            style={{ background: "#E53935", border: "none" }}
          >
            {uploading ? "Uploading..." : "Upload Video"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
