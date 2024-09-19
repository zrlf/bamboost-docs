import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import cn from "clsx";

const CopyIcon = ({ className, ...props }) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`w-4 h-4 ${className}`}
  >
    <path d="M16 1H4C2.897 1 2 1.897 2 3V15H4V3H16V1Z" />
    <path d="M19 5H8C6.897 5 6 5.897 6 7V21C6 22.103 6.897 23 8 23H19C20.103 23 21 22.103 21 21V7C21 5.897 20.103 5 19 5ZM19 21H8V7H19L19.002 21Z" />
  </svg>
);

const CheckIcon = ({ className, ...props }) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`w-4 h-4 ${className}`}
  >
    <path d="M20.285,2.285l-11.6,11.6l-4.97-4.97l-2.83,2.83l7.8,7.8l14.43-14.43L20.285,2.285z" />
  </svg>
);

const CopyCodeButton = ({ code, isVisible }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };

  return (
    <motion.button
      onClick={handleCopy}
      className={cn(
        "absolute top-2 right-2 border border-gray-600 cursor-pointer p-1.5 flex items-center justify-center rounded",
      )}
      whileTap={{ scale: 0.9 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <AnimatePresence mode="wait">
        {isCopied ? (
          <motion.div
            key="check"
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center"
          >
            <CheckIcon className="" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-x-1"
          >
            <CopyIcon className="text-gray-600" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default CopyCodeButton;
