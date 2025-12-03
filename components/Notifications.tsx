"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toIndianDateString } from "@/lib/formatDate";

interface Notification {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  uploadedBy: string;
  isImportant: boolean;
  expireAt?: string;
  redirectLink?: string;
  redirectLabel?: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/admin/notifications");
      if (response.ok) {
        const data = await response.json();
        const activeNotifications = data.filter((notif: Notification) => {
          if (!notif.expireAt) return true;
          return new Date(notif.expireAt) > new Date();
        });
        setNotifications(activeNotifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    } else {
      // Use Indian DD/MM/YYYY for date display
      return toIndianDateString(dateString);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-[#1a4b8c]" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return null;
  }

  return (
    <section className="py-14 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-[#f9fbfd] to-[#eef3f8]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#0f2a4d] rounded-2xl">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0f2a4d]">
                Notifications & Updates
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Stay informed with our latest announcements
              </p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#1a4b8c] scrollbar-track-gray-200">
            {notifications.map((notification) => (
              <div key={notification._id} className="mt-4">
                <Card
                  className={`w-[250px] md:w-[360px] h-full flex flex-col rounded-2xl transition-all duration-300 ${
                    notification.isImportant
                      ? "border border-red-500/20 shadow-red-100 shadow-md bg-white/80"
                      : "border border-gray-200/70 bg-white/80"
                  } hover:scale-[1.02]`}
                >
                  {notification.imageUrl && (
                    <div className="relative aspect-[4/5]  bg-gray-100">
                      <Image
                        src={notification.imageUrl}
                        alt={notification.title}
                        fill
                        className="object-cover rounded-2xl"
                      />
                      {notification.isImportant && (
                        <div className="absolute top-3 right-3">
                          <Badge
                            variant="destructive"
                            className="flex items-center gap-1 bg-green-600 text-white"
                          >
                            <AlertCircle className="w-3 h-3" />
                            Registration Live
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}

                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#0f2a4d] mb-2 line-clamp-2 min-h-[3rem]">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-700 mb-4 leading-relaxed line-clamp-3">
                        {notification.content}
                      </p>
                    </div>
                    {notification.redirectLink && (
                      <div className="pb-4">
                        <Link
                          href={notification.redirectLink}
                          rel="noopener noreferrer"
                          target="_blank"
                          className="inline-flex border border-gray-300/20 px-4 py-2 rounded-xl bg-blue-100 hover:bg-blue-500 hover:text-white items-center gap-1 text-sm text-blue-600  font-medium transition-colors"
                        >
                          {notification.redirectLabel || "Learn More"}
                        </Link>
                      </div>
                    )}
                    <div className="pt-3 border-t border-gray-200 flex items-center text-xs text-gray-500 mt-auto">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      <span>{formatDate(notification.createdAt)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        {notifications.length > 3 && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <span>←</span>
              <span>Scroll to see more updates</span>
              <span>→</span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Notifications;
