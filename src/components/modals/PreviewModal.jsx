import { X } from "lucide-react";
// --- ERROR RESOLVED: Corrected path and function name ---
import { generateEmailHtml } from "../../utils/htmlGenerators"; // Path adjusted to go up two levels

export default function PreviewModal({ isOpen, onClose, template }) {
  if (!isOpen) return null;

  // The template state passed here must be the 'components' array from App.jsx
  const html = generateEmailHtml(template);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Preview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          <iframe
            srcDoc={html}
            className="w-full h-full min-h-[600px] bg-white rounded-lg shadow-sm"
            title="Email Preview"
          />
        </div>
      </div>
    </div>
  );
}
