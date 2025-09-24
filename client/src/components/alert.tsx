import React from "react";

interface AlertProps {
  message: string;
  type?: "info" | "success" | "warning" | "error";
  onClose?: () => void;
}

const typeStyles: Record<string, string> = {
  info: "bg-blue-100 text-blue-800 border-blue-300",
  success: "bg-green-100 text-green-800 border-green-300",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
  error: "bg-red-100 text-red-800 border-red-300",
};

export default function Alert({ message, type = "info", onClose }: AlertProps) {
  return (
    <div className={`border rounded p-3 flex items-center justify-between mb-2 ${typeStyles[type]}`}>
      <span>{message}</span>
      {onClose && (
        <button
          className="ml-4 px-2 py-1 rounded bg-white text-xs border border-gray-300 hover:bg-gray-100"
          onClick={onClose}
        >
          Close
        </button>
      )}
    </div>
  );
}
