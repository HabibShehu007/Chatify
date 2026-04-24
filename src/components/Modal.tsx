// components/Modal.tsx
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: "success" | "error";
  title?: string;
  message?: string;
  redirectTo?: string; // ✅ dynamic redirect
  showSpinner?: boolean;
  children?: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  type = "success",
  title,
  message,
  redirectTo,
  showSpinner,
  children,
}: ModalProps) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (type === "success" && redirectTo) {
      navigate(redirectTo); // ✅ redirect based on context
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Box */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 0.8,
            }}
          >
            <div className="bg-navy-900 text-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md border border-blue-600 flex flex-col items-center gap-6">
              {/* Icon */}
              {type === "success" ? (
                <FaCheckCircle className="text-green-400 text-5xl" />
              ) : (
                <FaTimesCircle className="text-red-400 text-5xl" />
              )}

              {/* Title */}
              {title && (
                <h3 className="text-blue-400 font-semibold text-lg text-center">
                  {title}
                </h3>
              )}

              {/* Message */}
              {message && (
                <p className="text-center text-base sm:text-lg font-medium text-gray-200 break-words">
                  {message}
                </p>
              )}

              {/* Custom children (like extra buttons) */}
              {children}

              {/* Spinner */}
              {showSpinner && (
                <span className="animate-spin h-6 w-6 border-2 border-blue-400 border-t-transparent rounded-full"></span>
              )}

              {/* Default button if no children */}
              {!children && !showSpinner && (
                <button
                  onClick={handleAction}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
                >
                  {type === "success" ? "Okay" : "Close"}
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
