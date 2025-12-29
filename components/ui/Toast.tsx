"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import IconX from "https://deno.land/x/tabler_icons_tsx@0.0.7/tsx/x.tsx";

type ToastProps = {
  title: string;
  message: string;
  color?: "green" | "red" | "yellow" | "gray";
  onClose?: () => void;
};

export default function Toast({
  title,
  message,
  color = "gray",
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) {
        setTimeout(onClose, 300);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    green: "bg-green-300 text-white",
    red: "bg-red-300 text-white",
    yellow: "bg-yellow-500 text-black",
    gray: "bg-gray-500 text-white",
  };

  const handleClose = () => {
    setVisible(false);
    if (onClose) {
      setTimeout(onClose, 300);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`rounded-[5px] shadow-lg p-4 w-80 ${colors[color]}`}
          >
            {/* Botão de fechar */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-white/80 hover:text-white transition cursor-pointer"
            >
              <IconX class="w-6 h-6" />
            </button>
            <strong className="block text-lg">{title}</strong>
            <p className="text-sm mt-1">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
