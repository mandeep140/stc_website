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
import {
  Plus,
  Trash2,
  Edit,
  Calendar,
  Upload,
  Loader2,
} from "lucide-react";
import { uploadToImageKit, deleteFromImageKit } from "@/lib/imagekit";
import Image from "next/image";
import { toIndianDateString } from "@/lib/formatDate";
import { useToast } from "@/hooks/use-toast";

interface Event {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  imageFileId?: string;
  club: string;
  uploadedBy: string;
  eventDate: string;
  isImportant: boolean;
  createdAt: string;
  expireAt?: string;
  redirectLink?: string;
  redirectLabel?: string;
  resourcesLink?: string;
  resourcesLabel?: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    imageFileId: "",
    club: "",
    eventDate: "",
    isImportant: false,
    expireAt: "",
    uploadedBy: "",
    redirectLink: "",
    redirectLabel: "",
    resourcesLink: "",
    resourcesLabel: "",
  });

  useEffect(() => {
    fetchEvents();
  },);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/admin/events");
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to fetch events",
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
        const fileName = `event_${Date.now()}_${imageFile.name}`;
        const uploadResult = await uploadToImageKit(imageFile, fileName);
        imageUrl = uploadResult.url;
        imageFileId = uploadResult.fileId;

        // Delete old image if updating
        if (editingEvent && editingEvent.imageFileId) {
          try {
            await deleteFromImageKit(editingEvent.imageFileId);
          } catch (error) {
            console.error("Error deleting old image:", error);
          }
        }
      }

      const eventData = {
        ...formData,
        imageUrl,
        imageFileId,
        eventDate: new Date(formData.eventDate).toISOString(),
        expireAt: formData.expireAt
          ? new Date(formData.expireAt).toISOString()
          : undefined,
      };

      const response = editingEvent
        ? await fetch("/api/admin/events", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editingEvent._id, ...eventData }),
          })
        : await fetch("/api/admin/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventData),
          });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Event ${editingEvent ? "updated" : "created"} successfully`,
        });
        setDialogOpen(false);
        resetForm();
        fetchEvents();
      } else {
        throw new Error("Failed to save event");
      }
    } catch (error) {
      console.error("Error saving event:", error);
      toast({
        title: "Error",
        description: `Failed to ${editingEvent ? "update" : "create"} event`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (event: Event) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      // Delete image from ImageKit if exists
      if (event.imageFileId) {
        try {
          await deleteFromImageKit(event.imageFileId);
        } catch (error) {
          console.error("Error deleting image:", error);
        }
      }

      const response = await fetch(`/api/admin/events?id=${event._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event deleted successfully",
        });
        fetchEvents();
      } else {
        throw new Error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      content: event.content,
      imageUrl: event.imageUrl || "",
      imageFileId: event.imageFileId || "",
      club: event.club,
      eventDate: event.eventDate.split("T")[0],
      isImportant: event.isImportant,
      expireAt: event.expireAt ? event.expireAt.split("T")[0] : "",
      uploadedBy: event.uploadedBy || "",
      redirectLink: event.redirectLink || "",
      redirectLabel: event.redirectLabel || "",
      resourcesLink: event.resourcesLink || "",
      resourcesLabel: event.resourcesLabel || "",
    });
    setImagePreview(event.imageUrl || "");
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      imageUrl: "",
      imageFileId: "",
      club: "",
      eventDate: "",
      isImportant: false,
      expireAt: "",
      uploadedBy: "",
      redirectLink: "",
      redirectLabel: "",
      resourcesLink: "",
      resourcesLabel: "",
    });
    setEditingEvent(null);
    setImageFile(null);
    setImagePreview("");
  };

  const upcomingEvents = events.filter((event) => {
    const eventDate = new Date(event.eventDate);
    const expireDate = event.expireAt ? new Date(event.expireAt) : eventDate;
    return expireDate >= new Date();
  });

  const expiredEvents = events.filter((event) => {
    const eventDate = new Date(event.eventDate);
    const expireDate = event.expireAt ? new Date(event.expireAt) : eventDate;
    return expireDate < new Date();
  });

  const EventCard = ({ event }: { event: Event }) => (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow">
      {event.imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-[#0f2a4d] mb-2">{event.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{event.club}</p>
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
          {event.content}
        </p>
        <div className="flex items-center text-sm text-[#1a4b8c] mb-2">
          <Calendar className="w-4 h-4 mr-2" />
          {toIndianDateString(event.eventDate)}
        </div>
        {event.isImportant && (
          <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
            Important
          </span>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 p-4 flex gap-2">
        <Button
          onClick={() => handleEdit(event)}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button
          onClick={() => handleDelete(event)}
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
                Manage Events
              </h1>
              <p className="text-lg text-[#1a4b8c]">
                Create, edit, and manage all events
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
              Add Event
            </Button>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#1a4b8c]" />
              </div>
            ) : (
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
                  <TabsTrigger value="upcoming">
                    Upcoming Events ({upcomingEvents.length})
                  </TabsTrigger>
                  <TabsTrigger value="expired">
                    Expired Events ({expiredEvents.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                  {upcomingEvents.length === 0 ? (
                    <p className="text-center text-gray-500 py-12">
                      No upcoming events
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {upcomingEvents.map((event) => (
                        <EventCard key={event._id} event={event} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="expired">
                  {expiredEvents.length === 0 ? (
                    <p className="text-center text-gray-500 py-12">
                      No expired events
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {expiredEvents.map((event) => (
                        <EventCard key={event._id} event={event} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Event Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "Edit Event" : "Add New Event"}
            </DialogTitle>
            <DialogDescription>
              {editingEvent
                ? "Update event details"
                : "Fill in the details to create a new event"}
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
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="club">Club *</Label>
              <Input
                id="club"
                value={formData.club}
                onChange={(e) =>
                  setFormData({ ...formData, club: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventDate">Event Date *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) =>
                    setFormData({ ...formData, eventDate: e.target.value })
                  }
                  required
                />
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
              </div>

              <div>
                <Label htmlFor="redirectLabel">Redirect Label(Optional)</Label>
                <Input
                  id="redirectLabel"
                  type="text"
                  value={formData.redirectLabel}
                  onChange={(e) =>
                    setFormData({ ...formData, redirectLabel: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="resourcesLink">Resources Link (Optional)</Label>
                <Input
                  id="resourcesLink"
                  type="text"
                  value={formData.resourcesLink}
                  onChange={(e) =>
                    setFormData({ ...formData, resourcesLink: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="resourcesLabel">
                  Resources Label (Optional)
                </Label>
                <Input
                  id="resourcesLabel"
                  type="text"
                  value={formData.resourcesLabel}
                  onChange={(e) =>
                    setFormData({ ...formData, resourcesLabel: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="uploadedBy">Uploaded By*</Label>
                <Input
                  id="uploadedBy"
                  type="text"
                  value={formData.uploadedBy}
                  onChange={(e) =>
                    setFormData({ ...formData, uploadedBy: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="image">Event Image</Label>
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
              <Label htmlFor="isImportant">Mark as Important</Label>
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
                    {editingEvent ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {editingEvent ? "Update Event" : "Create Event"}
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
