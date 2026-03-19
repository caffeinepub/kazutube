import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { formatViews, timeAgo } from "../store/useStore";
import type { User, Video } from "../types";
import type { Page } from "../types";

interface AdminPageProps {
  users: User[];
  videos: Video[];
  currentUser: User | null;
  onNavigate: (page: Page) => void;
  onBanUser: (userId: string, ban: boolean) => void;
  onDeleteVideo: (videoId: string) => void;
  onSetVideoViews: (videoId: string, count: number) => void;
}

export default function AdminPage({
  users,
  videos,
  currentUser,
  onNavigate,
  onBanUser,
  onDeleteVideo,
  onSetVideoViews,
}: AdminPageProps) {
  const [viewEdits, setViewEdits] = useState<Record<string, string>>({});

  if (currentUser?.role !== "owner") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p style={{ color: "#E53935" }}>Access denied. Owner only.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      data-ocid="admin.panel"
    >
      <button
        type="button"
        data-ocid="admin.button"
        onClick={() => onNavigate({ name: "home" })}
        className="flex items-center gap-2 text-sm font-medium mb-4 hover:opacity-70 transition-opacity"
        style={{ color: "#40C4FF" }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="flex items-center gap-3 mb-6">
        <Shield size={28} style={{ color: "#E53935" }} />
        <h1 className="text-2xl font-bold" style={{ color: "#0F1A24" }}>
          Admin Panel
        </h1>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="mb-6">
          <TabsTrigger data-ocid="admin.tab" value="users">
            Users ({users.length})
          </TabsTrigger>
          <TabsTrigger data-ocid="admin.tab" value="videos">
            Videos ({videos.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <Table data-ocid="admin.table">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, i) => (
                  <TableRow key={user.id} data-ocid={`admin.row.${i + 1}`}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-sm" style={{ color: "#6B7280" }}>
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        style={{
                          background:
                            user.role === "owner"
                              ? "#40C4FF"
                              : user.role === "banned"
                                ? "#E53935"
                                : "#E5F3FF",
                          color:
                            user.role === "owner"
                              ? "white"
                              : user.role === "banned"
                                ? "white"
                                : "#0369A1",
                        }}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm" style={{ color: "#9CA3AF" }}>
                      {timeAgo(user.createdAt)}
                    </TableCell>
                    <TableCell>
                      {user.role !== "owner" && (
                        <Button
                          data-ocid={`admin.delete_button.${i + 1}`}
                          size="sm"
                          variant={
                            user.role === "banned" ? "outline" : "destructive"
                          }
                          onClick={() =>
                            onBanUser(user.id, user.role !== "banned")
                          }
                        >
                          {user.role === "banned" ? "Unban" : "Ban"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="videos">
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <Table data-ocid="admin.table">
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Uploader</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Set Views</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videos.map((video, i) => (
                  <TableRow key={video.id} data-ocid={`admin.row.${i + 1}`}>
                    <TableCell className="font-medium max-w-xs">
                      <p className="line-clamp-1">{video.title}</p>
                    </TableCell>
                    <TableCell className="text-sm" style={{ color: "#6B7280" }}>
                      {video.uploaderName}
                    </TableCell>
                    <TableCell>{formatViews(video.views)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Input
                          data-ocid={`admin.input.${i + 1}`}
                          type="number"
                          className="w-24 h-8 text-sm"
                          value={viewEdits[video.id] ?? ""}
                          placeholder={String(video.views)}
                          onChange={(e) =>
                            setViewEdits((prev) => ({
                              ...prev,
                              [video.id]: e.target.value,
                            }))
                          }
                        />
                        <Button
                          data-ocid={`admin.save_button.${i + 1}`}
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const v = Number.parseInt(
                              viewEdits[video.id] || "",
                              10,
                            );
                            if (!Number.isNaN(v)) {
                              onSetVideoViews(video.id, v);
                              setViewEdits((prev) => {
                                const n = { ...prev };
                                delete n[video.id];
                                return n;
                              });
                            }
                          }}
                        >
                          Set
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        data-ocid={`admin.delete_button.${i + 1}`}
                        size="sm"
                        variant="destructive"
                        onClick={() => onDeleteVideo(video.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
