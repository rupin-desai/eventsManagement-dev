import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

interface AdminNotificationProps {
  notification: {
    type: 'success' | 'error';
    message: string;
  } | null;
  onClose?: () => void;
  successClassName?: string;
  errorClassName?: string;
}

// Animation configs
const fadeInVariants = (direction = "down", delay = 0) => ({
  initial: {
    opacity: 0,
    transform:
      direction === "down"
        ? "translate3d(0px, -40px, 0px) scale(0.95)"
        : "translate3d(0px, 40px, 0px) scale(0.95)",
  },
  animate: {
    opacity: 1,
    transform: "translate3d(0px, 0px, 0px) scale(1)",
    transition: { delay, type: "spring", stiffness: 400, damping: 30 },
  },
});
const springConfig = { type: "spring", stiffness: 400, damping: 30 };

const AdminNotification: React.FC<AdminNotificationProps> = ({
  notification,
  onClose,
  successClassName = 'bg-green-50 text-green-800 border-green-200',
  errorClassName = 'bg-red-50 text-red-800 border-red-200',
}) => {
  // Auto close after 4 seconds
  useEffect(() => {
    if (notification && onClose) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={notification.message}
        {...fadeInVariants("down", 0)}
        exit={{
          opacity: 0,
          transform: "translate3d(0px, -40px, 0px) scale(0.95)",
          transition: { duration: 0.2 }
        }}
        //@ts-ignore
        transition={springConfig}
        className={`fixed top-6 right-6 z-50 max-w-xs w-full shadow-lg rounded-lg flex items-center gap-3 px-4 py-3 border
          ${notification.type === 'success'
            ? successClassName
            : errorClassName
          }`}
      >
        {notification.type === 'success' ? (
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
        )}
        <span className="flex-1">{notification.message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 p-1 rounded hover:bg-black/10 transition-colors"
            aria-label="Close notification"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminNotification;