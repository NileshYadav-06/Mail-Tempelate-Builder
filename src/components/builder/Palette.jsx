// import React from "react";
// import {
//   Palette as PaletteIcon,
//   Type,
//   ImageIcon,
//   MousePointerClick,
//   GripVertical,
//   History,
//   Link,
//   Image,
//   Square,
//   Code,
//   CornerUpLeft,
//   CornerUpRight,
//   RefreshCcw,
//   // NEW IMPORTS
//   Share2,
//   Feather,
// } from "lucide-react";
// import PaletteItem from "../ui/PaletteItem";

// const Palette = ({ historyState, onUndo, onRedo, onClearTemplate }) => {
//   const { historyIndex, historyLength } = historyState;

//   const isUndoDisabled = historyIndex <= 0;
//   const isRedoDisabled = historyIndex >= historyLength - 1;

//   const componentDefinitions = [
//     { type: "text", label: "Text Block", icon: Type },
//     { type: "image", label: "Image Block", icon: Image },
//     { type: "button", label: "Button Link", icon: Link },
//     { type: "divider", label: "Divider Line", icon: Square },
//     { type: "header", label: "Header Area", icon: Code },
//     { type: "footer", label: "Footer Area", icon: Code },
//     { type: "signature", label: "Signature Block", icon: Type },
//     // ADDED NEW COMPONENTS
//     { type: "logo", label: "Logo/Brand", icon: Feather },
//     { type: "socialMedia", label: "Social Media", icon: Share2 },
//   ];

//   return (
//     <div className="p-4 overflow-y-auto hide-scrollbar flex-1">
//       {/* Undo/Redo/Clear Controls */}
//       <div className="p-3 mb-4 rounded-xl shadow-inner bg-background-dark dark:bg-background-light/5 border border-border-light dark:border-border-dark">
//         <h4 className="text-sm font-semibold text-text-primary mb-2">
//           History
//         </h4>
//         <div className="grid grid-cols-3 gap-2">
//           <button
//             onClick={onUndo}
//             disabled={isUndoDisabled}
//             className={`py-2 px-1 text-xs font-medium rounded-lg transition-all-medium flex flex-col items-center justify-center space-y-1 ${
//               isUndoDisabled
//                 ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed opacity-70"
//                 : "bg-gray-100 dark:bg-gray-800 text-white hover:bg-gray-200 dark:hover:bg-gray-700 shadow-sm hover:shadow-md"
//             }`}
//             title="Undo Last Action"
//           >
//             <CornerUpLeft className="w-4 h-4" /> Undo
//           </button>
//           <button
//             onClick={onRedo}
//             disabled={isRedoDisabled}
//             className={`py-2 px-1 text-xs font-medium rounded-lg transition-all-medium flex flex-col items-center justify-center space-y-1 ${
//               isRedoDisabled
//                 ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed opacity-70"
//                 : "bg-gray-100 dark:bg-gray-800 text-white hover:bg-gray-200 dark:hover:bg-gray-700 shadow-sm hover:shadow-md"
//             }`}
//             title="Redo Action"
//           >
//             <CornerUpRight className="w-4 h-4" /> Redo
//           </button>
//           <button
//             onClick={onClearTemplate}
//             className="py-2 px-1 text-xs font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all-medium flex flex-col items-center justify-center space-y-1 shadow-md hover:shadow-lg"
//             title="Clear All Components"
//           >
//             <RefreshCcw className="w-4 h-4" />
//             Clear
//           </button>
//         </div>
//       </div>

//       {/* Component List */}
//       <h4 className="text-sm font-semibold text-text-primary mt-4 mb-2">
//         Components
//       </h4>
//       <div className="grid grid-cols-2 gap-4">
//         {componentDefinitions.map((def) => (
//           <PaletteItem
//             key={def.type}
//             type={def.type}
//             label={def.label}
//             icon={def.icon}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };
// export default Palette;

import React from "react";
import {
  Palette as PaletteIcon,
  Type,
  ImageIcon,
  MousePointerClick,
  GripVertical,
  History,
  Link,
  Image,
  Square,
  Code,
  CornerUpLeft,
  CornerUpRight,
  RefreshCcw,
  // NEW IMPORTS
  Share2,
  Feather,
} from "lucide-react";
import PaletteItem from "../ui/PaletteItem";

const Palette = ({
  historyState,
  onUndo,
  onRedo,
  onClearTemplate,
  onDragStart,
}) => {
  const { historyIndex, historyLength } = historyState;

  const isUndoDisabled = historyIndex <= 0;
  const isRedoDisabled = historyIndex >= historyLength - 1;

  const componentDefinitions = [
    { type: "text", label: "Text Block", icon: Type },
    { type: "image", label: "Image Block", icon: Image },
    { type: "button", label: "Button Link", icon: Link },
    { type: "divider", label: "Divider Line", icon: Square },
    { type: "header", label: "Header Area", icon: Code },
    { type: "footer", label: "Footer Area", icon: Code },
    { type: "signature", label: "Signature Block", icon: Type },
    // ADDED NEW COMPONENTS
    { type: "logo", label: "Logo/Brand", icon: Feather },
    { type: "socialMedia", label: "Social Media", icon: Share2 },
  ];

  return (
    <div className="p-4 overflow-y-auto hide-scrollbar flex-1">
      {/* Undo/Redo/Clear Controls */}
      <div className="p-3 mb-4 rounded-xl shadow-inner bg-background-dark dark:bg-background-light/5 border border-border-light dark:border-border-dark">
        <h4 className="text-sm font-semibold text-text-primary mb-2">
          History
        </h4>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onUndo}
            disabled={isUndoDisabled}
            className={`py-2 px-1 text-xs font-medium rounded-lg transition-all-medium flex flex-col items-center justify-center space-y-1 ${
              isUndoDisabled
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed opacity-70"
                : "bg-gray-100 dark:bg-gray-800 text-white hover:bg-gray-200 dark:hover:bg-gray-700 shadow-sm hover:shadow-md"
            }`}
            title="Undo Last Action"
          >
            <CornerUpLeft className="w-4 h-4" /> Undo
          </button>
          <button
            onClick={onRedo}
            disabled={isRedoDisabled}
            className={`py-2 px-1 text-xs font-medium rounded-lg transition-all-medium flex flex-col items-center justify-center space-y-1 ${
              isRedoDisabled
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed opacity-70"
                : "bg-gray-100 dark:bg-gray-800 text-white hover:bg-gray-200 dark:hover:bg-gray-700 shadow-sm hover:shadow-md"
            }`}
            title="Redo Action"
          >
            <CornerUpRight className="w-4 h-4" /> Redo
          </button>
          <button
            onClick={onClearTemplate}
            className="py-2 px-1 text-xs font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all-medium flex flex-col items-center justify-center space-y-1 shadow-md hover:shadow-lg"
            title="Clear All Components"
          >
            <RefreshCcw className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      {/* Component List */}
      <h4 className="text-sm font-semibold text-text-primary mt-4 mb-2">
        Components
      </h4>
      <div className="grid grid-cols-2 gap-4">
        {componentDefinitions.map((def) => (
          <PaletteItem
            key={def.type}
            type={def.type}
            label={def.label}
            icon={def.icon}
            onDragStart={() => onDragStart(def.type)} // PASS THE COMPONENT TYPE
          />
        ))}
      </div>
    </div>
  );
};
export default Palette;
