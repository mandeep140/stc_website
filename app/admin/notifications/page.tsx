"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/components/adminNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Plus, Trash2, Edit, Bell, Loader2 } from "lucide-react";
import { uploadToImageKit, deleteFromImageKit } from "@/lib/imagekit";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { toIndianDateString } from "@/lib/formatDate";

interface Notification {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  imageFileId?: string;
  uploadedBy: string;
  redirectLink?: string;
  redirectLabel?: string;
  isImportant: boolean;
  createdAt: string;
  expireAt?: string;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNotification, setEditingNotification] =
    useState<Notification | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
 
  const [imagePreview, setImagePreview] = useState<string>("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    imageFileId: "",
    uploadedBy: "",
    redirectLink: "",
    redirectLabel: "",
    isImportant: false,
    expireAt: "",
  });

  useEffect(() => {
    fetchNotifications();
  },);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/admin/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formData.imageUrl;
      let imageFileId = formData.imageFileId;

      // Upload new image if selected
      if (imageFile) {
        const fileName = `notification_${Date.now()}_${imageFile.name}`;
        const uploadResult = await uploadToImageKit(imageFile, fileName);
        imageUrl = uploadResult.url;
        imageFileId = uploadResult.fileId;

        // Delete old image if updating
        if (editingNotification && editingNotification.imageFileId) {
          try {
            await deleteFromImageKit(editingNotification.imageFileId);
          } catch (error) {
            console.error("Error deleting old image:", error);
          }
        }
      }

      const notificationData = {
        ...formData,
        imageUrl,
        imageFileId,
        expireAt: formData.expireAt
          ? new Date(formData.expireAt).toISOString()
          : undefined,
      };

      const response = editingNotification
        ? await fetch("/api/admin/notifications", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: editingNotification._id,
              ...notificationData,
            }),
          })
        : await fetch("/api/admin/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(notificationData),
          });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Notification ${editingNotification ? "updated" : "created"} successfully`,
        });
        setDialogOpen(false);
        resetForm();
        fetchNotifications();
      } else {
        throw new Error("Failed to save notification");
      }
    } catch (error) {
      console.error("Error saving notification:", error);
      toast({
        title: "Error",
        description: `Failed to ${editingNotification ? "update" : "create"} notification`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (notification: Notification) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;

    try {
      // Delete image from ImageKit if exists
      if (notification.imageFileId) {
        try {
          await deleteFromImageKit(notification.imageFileId);
        } catch (error) {
          console.error("Error deleting image:", error);
        }
      }

      const response = await fetch(
        `/api/admin/notifications?id=${notification._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Notification deleted successfully",
        });
        fetchNotifications();
      } else {
        throw new Error("Failed to delete notification");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (notification: Notification) => {
    setEditingNotification(notification);
    setFormData({
      title: notification.title,
      content: notification.content,
      imageUrl: notification.imageUrl || "",
      imageFileId: notification.imageFileId || "",
      uploadedBy: notification.uploadedBy,
      isImportant: notification.isImportant,
      expireAt: notification.expireAt
        ? notification.expireAt.split("T")[0]
        : "",
      redirectLink: notification.redirectLink || "",
      redirectLabel: notification.redirectLabel || "",
    });
    setImagePreview(notification.imageUrl || "");
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      imageUrl: "",
      imageFileId: "",
      uploadedBy: "",
      isImportant: false,
      expireAt: "",
      redirectLink: "",
      redirectLabel: "",
    });
    setEditingNotification(null);
    setImageFile(null);
    setImagePreview("");
  };

  const activeNotifications = notifications.filter((notification) => {
    if (!notification.expireAt) return true;
    const expireDate = new Date(notification.expireAt);
    return expireDate >= new Date();
  });

  const expiredNotifications = notifications.filter((notification) => {
    if (!notification.expireAt) return false;
    const expireDate = new Date(notification.expireAt);
    return expireDate < new Date();
  });

  const NotificationCard = ({
    notification,
  }: {
    notification: Notification;
  }) => (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow">
      {notification.imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={notification.imageUrl}
            alt={notification.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-[#0f2a4d] flex-1">
            {notification.title}
          </h3>
          {notification.isImportant && (
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded ml-2">
              Registration Live
            </span>
          )}
        </div>
        <p className="text-sm text-gray-700 mb-4 line-clamp-3">
          {notification.content}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>By: {notification.uploadedBy}</span>
          <span>{toIndianDateString(notification.createdAt)}</span>
        </div>
        {notification.expireAt && (
          <div className="mt-2 text-xs text-gray-500">
            Expires: {toIndianDateString(notification.expireAt)}
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 p-4 flex gap-2">
        <Button
          onClick={() => handleEdit(notification)}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button
          onClick={() => handleDelete(notification)}
          variant="destructive"
          size="sm"
          className="flex-1"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <>
      <AdminNav />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-[#0f2a4d] mb-2">
                Manage Notifications
              </h1>
              <p className="text-lg text-[#1a4b8c]">
                Send important updates to students
              </p>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setDialogOpen(true);
              }}
              className="bg-[#0f2a4d] hover:bg-[#1a4b8c]"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Notification
            </Button>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#1a4b8c]" />
              </div>
            ) : (
              <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
                  <TabsTrigger value="active">
                    Active Notifications ({activeNotifications.length})
                  </TabsTrigger>
                  <TabsTrigger value="expired">
                    Expired Notifications ({expiredNotifications.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="active">
                  {activeNotifications.length === 0 ? (
                    <p className="text-center text-gray-500 py-12">
                      No active notifications
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {activeNotifications.map((notification) => (
                        <NotificationCard
                          key={notification._id}
                          notification={notification}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="expired">
                  {expiredNotifications.length === 0 ? (
                    <p className="text-center text-gray-500 py-12">
                      No expired notifications
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {expiredNotifications.map((notification) => (
                        <NotificationCard
                          key={notification._id}
                          notification={notification}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Notification Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingNotification ? "Edit Notification" : "New Notification"}
            </DialogTitle>
            <DialogDescription>
              {editingNotification
                ? "Update notification details"
                : "Fill in the details to create a new notification"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
                rows={5}
              />
            </div>

            <div>
              <Label htmlFor="uploadedBy">Uploaded By *</Label>
              <Input
                id="uploadedBy"
                value={formData.uploadedBy}
                onChange={(e) =>
                  setFormData({ ...formData, uploadedBy: e.target.value })
                }
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <Label htmlFor="redirectLink">Redirect Link (Optional)</Label>
              <Input
                id="redirectLink"
                type="text"
                value={formData.redirectLink}
                onChange={(e) =>
                  setFormData({ ...formData, redirectLink: e.target.value })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty for permanent notification
              </p>
            </div>

            <div>
              <Label htmlFor="redirectLabel">Redirect Label (Optional)</Label>
              <Input
                id="redirectLabel"
                type="text"
                value={formData.redirectLabel}
                onChange={(e) =>
                  setFormData({ ...formData, redirectLabel: e.target.value })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty for permanent notification
              </p>
            </div>

            <div>
              <Label htmlFor="expireAt">Expire Date (Optional)</Label>
              <Input
                id="expireAt"
                type="date"
                value={formData.expireAt}
                onChange={(e) =>
                  setFormData({ ...formData, expireAt: e.target.value })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty for permanent notification
              </p>
            </div>

            <div>
              <Label htmlFor="image">Notification Image (Optional)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1"
                />
                {imagePreview && (
                  <div className="relative w-20 h-20 rounded overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="isImportant"
                type="checkbox"
                checked={formData.isImportant}
                onChange={(e) =>
                  setFormData({ ...formData, isImportant: e.target.checked })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="isImportant">Registration Live</Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="flex-1"
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#0f2a4d] hover:bg-[#1a4b8c]"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingNotification ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4 mr-2" />
                    {editingNotification
                      ? "Update Notification"
                      : "Create Notification"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
