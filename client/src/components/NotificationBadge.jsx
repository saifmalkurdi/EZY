import React from "react";
import { NOTIFICATION_PRIORITY } from "../constants/teacherNotifications";

/**
 * NotificationBadge Component
 * Displays notification counts with priority indicators for teachers
 */
const NotificationBadge = ({
  notifications = [],
  size = "md",
  showDetails = false,
}) => {
  // Filter unread notifications
  const unreadNotifications = notifications.filter((n) => !n.is_read);

  // Count by priority
  const highPriority = unreadNotifications.filter((n) =>
    NOTIFICATION_PRIORITY.HIGH.includes(n.type)
  ).length;

  const mediumPriority = unreadNotifications.filter((n) =>
    NOTIFICATION_PRIORITY.MEDIUM.includes(n.type)
  ).length;

  const lowPriority = unreadNotifications.filter((n) =>
    NOTIFICATION_PRIORITY.LOW.includes(n.type)
  ).length;

  const totalUnread = unreadNotifications.length;

  // Size classes
  const sizeClasses = {
    sm: "w-5 h-5 text-xs",
    md: "w-6 h-6 text-sm",
    lg: "w-8 h-8 text-base",
  };

  // Don't show badge if no unread notifications
  if (totalUnread === 0) {
    return null;
  }

  return (
    <div className="relative inline-block">
      {/* Main badge */}
      <div
        className={`
        ${sizeClasses[size]} 
        rounded-full 
        ${
          highPriority > 0
            ? "bg-red-500"
            : mediumPriority > 0
            ? "bg-orange-500"
            : "bg-blue-500"
        }
        text-white 
        flex items-center justify-center 
        font-bold
        shadow-lg
        animate-pulse
      `}
      >
        {totalUnread > 99 ? "99+" : totalUnread}
      </div>

      {/* Detailed breakdown (optional) */}
      {showDetails && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl p-3 min-w-[200px] z-50">
          <div className="text-xs font-semibold text-gray-700 mb-2">
            Unread Notifications
          </div>

          {highPriority > 0 && (
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-xs text-gray-600">High Priority</span>
              </div>
              <span className="text-xs font-bold text-red-600">
                {highPriority}
              </span>
            </div>
          )}

          {mediumPriority > 0 && (
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-xs text-gray-600">Medium Priority</span>
              </div>
              <span className="text-xs font-bold text-orange-600">
                {mediumPriority}
              </span>
            </div>
          )}

          {lowPriority > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-600">Low Priority</span>
              </div>
              <span className="text-xs font-bold text-blue-600">
                {lowPriority}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * NotificationList Component
 * Displays a list of notifications grouped by priority
 */
export const NotificationList = ({
  notifications = [],
  onMarkAsRead,
  onDelete,
  maxItems = 10,
}) => {
  // Group notifications by priority
  const highPriorityNotifications = notifications.filter((n) =>
    NOTIFICATION_PRIORITY.HIGH.includes(n.type)
  );

  const mediumPriorityNotifications = notifications.filter((n) =>
    NOTIFICATION_PRIORITY.MEDIUM.includes(n.type)
  );

  const lowPriorityNotifications = notifications.filter((n) =>
    NOTIFICATION_PRIORITY.LOW.includes(n.type)
  );

  const renderNotificationGroup = (title, items, priorityColor) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${priorityColor}`}></div>
          <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
          <span className="text-xs text-gray-500">({items.length})</span>
        </div>

        <div className="space-y-2">
          {items.slice(0, maxItems).map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderNotificationGroup(
        "High Priority - Action Required",
        highPriorityNotifications,
        "bg-red-500"
      )}

      {renderNotificationGroup(
        "Medium Priority",
        mediumPriorityNotifications,
        "bg-orange-500"
      )}

      {renderNotificationGroup(
        "Updates & Info",
        lowPriorityNotifications,
        "bg-blue-500"
      )}
    </div>
  );
};

/**
 * NotificationItem Component
 * Individual notification card
 */
const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const getPriorityColor = () => {
    if (NOTIFICATION_PRIORITY.HIGH.includes(notification.type))
      return "border-red-500";
    if (NOTIFICATION_PRIORITY.MEDIUM.includes(notification.type))
      return "border-orange-500";
    return "border-blue-500";
  };

  const getIcon = () => {
    switch (notification.type) {
      case "course_purchase_approval_request":
        return "📋";
      case "course_purchased":
        return "🎓";
      case "course_enrollment_approved":
        return "✅";
      case "course_enrollment_rejected":
        return "❌";
      case "course_updated":
        return "📝";
      case "course_deleted":
        return "🗑️";
      default:
        return "🔔";
    }
  };

  return (
    <div
      className={`
      p-4 rounded-lg border-l-4 ${getPriorityColor()}
      ${notification.is_read ? "bg-gray-50" : "bg-white shadow-md"}
      transition-all duration-200 hover:shadow-lg
    `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{getIcon()}</span>
            <h5 className="font-semibold text-gray-900">
              {notification.title}
            </h5>
            {!notification.is_read && (
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
          <p className="text-xs text-gray-400">
            {new Date(notification.created_at).toLocaleString()}
          </p>
        </div>

        <div className="flex flex-col gap-2 ml-4">
          {!notification.is_read && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Mark Read
            </button>
          )}
          <button
            onClick={() => onDelete(notification.id)}
            className="text-xs text-red-600 hover:text-red-800 font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationBadge;
