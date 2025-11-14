import React from "react";
import { AlertTriangle, X } from "lucide-react";

const CustomConfirmModal = ({ message, onConfirm, onCancel }) => {
  // Prevent clicks inside the modal from closing the app canvas
  const handleModalClick = (e) => e.stopPropagation();

  return (
    // Overlay
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity"
      onClick={onCancel} // Close on outside click
    >
      {/* Modal Container */}
      <div
        className="bg-background-light dark:bg-background-dark p-6 rounded-xl shadow-2xl max-w-sm w-full animate-zoom-in"
        onClick={handleModalClick}
      >
        <div className="flex justify-between items-start border-b border-border-light dark:border-border-dark pb-3 mb-4">
          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Confirmation Required
          </h3>
          <button
            onClick={onCancel}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Content */}
        <p className="text-text-secondary mb-6">{message}</p>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="py-2 px-4 rounded-lg text-sm font-medium bg-gray-200 dark:bg-gray-700 text-text-primary hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="py-2 px-4 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-all shadow-md"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomConfirmModal;
