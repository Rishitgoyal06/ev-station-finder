"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const notifications = [
    {
      id: 1,
      type: "booking_confirmed",
      title: "Booking Confirmed",
      message: "Your charging session at GreenCharge Hub is confirmed for 2:30 PM today.",
      time: "2 minutes ago",
      read: false,
      icon: "✓",
      color: "text-green-400",
      bgColor: "bg-green-500/20"
    },
    {
      id: 2,
      type: "slot_available", 
      title: "Slot Available",
      message: "A slot just became available at VoltSpark Center near you.",
      time: "15 minutes ago", 
      read: false,
      icon: "⚡",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20"
    },
    {
      id: 3,
      type: "reminder",
      title: "Charging Session Starting Soon",
      message: "Your charging session starts in 30 minutes. Don't forget!",
      time: "32 minutes ago",
      read: true,
      icon: "🕒",
      color: "text-yellow-400", 
      bgColor: "bg-yellow-500/20"
    },
    {
      id: 4,
      type: "payment_success",
      title: "Payment Successful",
      message: "Payment of ₹420 for your charging session has been processed.",
      time: "2 hours ago",
      read: true,
      icon: "💳",
      color: "text-green-400",
      bgColor: "bg-green-500/20"
    },
    {
      id: 5,
      type: "session_complete",
      title: "Charging Session Complete", 
      message: "Your vehicle has been charged successfully. 42.5 kWh delivered.",
      time: "1 day ago",
      read: true,
      icon: "🔋",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20"
    },
    {
      id: 6,
      type: "price_drop",
      title: "Price Drop Alert",
      message: "Charging rates at ChargeIQ Station dropped to ₹15/kWh. Book now!",
      time: "1 day ago",
      read: true, 
      icon: "📉",
      color: "text-green-400",
      bgColor: "bg-green-500/20"
    },
    {
      id: 7,
      type: "maintenance",
      title: "Station Maintenance", 
      message: "VoltSpark Center will be under maintenance tomorrow 2-4 PM.",
      time: "2 days ago",
      read: true,
      icon: "🔧",
      color: "text-orange-400",
      bgColor: "bg-orange-500/20"
    }
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !notification.read;
    if (activeFilter === "bookings") return ["booking_confirmed", "reminder", "session_complete"].includes(notification.type);
    if (activeFilter === "alerts") return ["slot_available", "price_drop", "maintenance"].includes(notification.type);
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: number) => {
    // Here you would make an API call to mark as read
    console.log(`Marking notification ${notificationId} as read`);
  };

  const markAllAsRead = () => {
    // Here you would make an API call to mark all as read
    console.log("Marking all notifications as read");
  };

  const deleteNotification = (notificationId: number) => {
    // Here you would make an API call to delete
    console.log(`Deleting notification ${notificationId}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20">
      {/* Header */}
      <div className="bg-[#111] border-b border-[#1a1a1a] px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-[#1f1f1f] rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold">Notifications</h1>
              <p className="text-sm text-gray-400">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-medium rounded-lg transition-colors"
            >
              Mark All Read
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-[#111] border border-[#1a1a1a] rounded-xl p-1 overflow-x-auto">
          {[
            { key: "all", label: "All", count: notifications.length },
            { key: "unread", label: "Unread", count: unreadCount },
            { key: "bookings", label: "Bookings", count: notifications.filter(n => ["booking_confirmed", "reminder", "session_complete"].includes(n.type)).length },
            { key: "alerts", label: "Alerts", count: notifications.filter(n => ["slot_available", "price_drop", "maintenance"].includes(n.type)).length }
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeFilter === filter.key
                  ? "bg-green-500 text-black"
                  : "text-gray-400 hover:text-white hover:bg-[#1f1f1f]"
              }`}
            >
              {filter.label}
              {filter.count > 0 && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  activeFilter === filter.key
                    ? "bg-black/20 text-black"
                    : "bg-[#1f1f1f] text-gray-300"
                }`}>
                  {filter.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-[#111] border rounded-xl p-4 transition-all hover:border-green-500/30 ${
                  notification.read ? "border-[#1a1a1a]" : "border-green-500/20 bg-[#111]/80"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 ${notification.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <span className="text-lg">{notification.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-semibold ${notification.read ? "text-white" : "text-green-400"}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2 ml-4">
                        {!notification.read && (
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        )}
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {notification.time}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-3">
                      {notification.message}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-green-400 hover:text-green-300 transition-colors"
                        >
                          Mark as read
                        </button>
                      )}
                      
                      {notification.type === "booking_confirmed" && (
                        <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                          View booking
                        </button>
                      )}
                      
                      {notification.type === "slot_available" && (
                        <button className="text-xs text-green-400 hover:text-green-300 transition-colors">
                          Book now
                        </button>
                      )}

                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors ml-auto"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-[#111] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Notifications</h3>
              <p className="text-gray-400">
                {activeFilter === "unread" 
                  ? "All notifications have been read." 
                  : "You don't have any notifications in this category."
                }
              </p>
            </div>
          )}
        </div>

        {/* Notification Settings */}
        <div className="mt-8 pt-6 border-t border-[#1a1a1a]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white mb-1">Notification Settings</h3>
              <p className="text-sm text-gray-400">Manage your notification preferences</p>
            </div>
            <button 
              onClick={() => router.push('/profile?tab=notifications')}
              className="px-4 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg font-medium transition-colors"
            >
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}