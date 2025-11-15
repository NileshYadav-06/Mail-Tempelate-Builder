// // App.jsx (The new, simplified file)
// import React, { useState, useEffect, useRef } from "react";
// import {
//   Code,
//   GripVertical,
//   MousePointerClick,
//   Monitor,
//   Smartphone,
//   PanelLeft,
//   PanelRight,
// } from "lucide-react";

// // Import Refactored Components and Utilities
// import { ThemeProvider } from "./context/ThemeContext";
// import Navbar from "./components/ui/Navbar";
// import Palette from "./components/builder/Palette";
// import EditorPanel from "./components/builder/EditorPanel";
// import EmailComponent from "./components/builder/EmailComponent";
// import ExportModal from "./components/modals/ExportModal";
// import CustomConfirmModal from "./components/modals/CustomConfirmModal";

// import { getDefaults } from "./utils/componentDefaults";
// import { generateEmailHtml } from "./utils/htmlGenerators";

// // The full component set required by other files (EditorPanel, EmailComponent)
// import {
//   Trash2,
//   X,
//   MousePointerClick as MousePointerClickIcon,
// } from "lucide-react";

// // --- Core App Logic ---

// export default function App() {
//   const [components, setComponents] = useState([]);
//   const [selectedComponent, setSelectedComponent] = useState(null);
//   const [showHtmlModal, setShowHtmlModal] = useState(false);
//   const [generatedHtml, setGeneratedHtml] = useState("");
//   const [showJsonModal, setShowJsonModal] = useState(false);
//   const [generatedJson, setGeneratedJson] = useState("");
//   const [previewMode, setPreviewMode] = useState("desktop");

//   // Responsive State
//   const [isLargeScreen, setIsLargeScreen] = useState(true);
//   const [showPalette, setShowPalette] = useState(true);
//   const [showEditor, setShowEditor] = useState(false);

//   // Custom Modal State
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [confirmAction, setConfirmAction] = useState(null);
//   const [confirmMessage, setConfirmMessage] = useState("");

//   // History/Undo/Redo state
//   const [history, setHistory] = useState([[]]);
//   const [historyIndex, setHistoryIndex] = useState(0);

//   // Drag-and-drop state
//   const [draggedComponentIndex, setDraggedComponentIndex] = useState(null);
//   const [dropPosition, setDropPosition] = useState(null);
//   const [dragOverIndex, setDragOverIndex] = useState(null);
//   const canvasRef = useRef(null);

//   // --- Initial Setup and Persistence & Responsiveness Checks ---
//   useEffect(() => {
//     const handleResize = () => {
//       const isLarge = window.innerWidth >= 1024; // lg: breakpoint
//       setIsLargeScreen(isLarge);

//       if (isLarge) {
//         setShowPalette(true);
//         setShowEditor(false);
//       } else if (!isLarge && showPalette && showEditor) {
//         setShowEditor(false);
//       }
//     };

//     // Initial check and load
//     handleResize();

//     const savedComponents = localStorage.getItem("emailTemplateComponents");
//     if (savedComponents) {
//       try {
//         const parsedComponents = JSON.parse(savedComponents);
//         setComponents(parsedComponents);
//         setHistory([parsedComponents]);
//       } catch (e) {
//         console.error("Failed to parse saved components", e);
//       }
//     }

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Save components to localStorage (and trigger history update)
//   useEffect(() => {
//     localStorage.setItem("emailTemplateComponents", JSON.stringify(components));
//     // Update history only if the change wasn't from undo/redo
//     if (historyIndex === history.length - 1) {
//       const newHistory = [
//         ...history.slice(0, historyIndex + 1),
//         [...components],
//       ];
//       setHistory(newHistory);
//       setHistoryIndex(newHistory.length - 1);
//     }
//   }, [components]);

//   // Update selected component state when main components list changes
//   useEffect(() => {
//     if (selectedComponent) {
//       const updatedSelected = components.find(
//         (c) => c.id === selectedComponent.id
//       );
//       setSelectedComponent(updatedSelected || null);

//       if (!isLargeScreen && updatedSelected) {
//         setShowPalette(false);
//         setShowEditor(true);
//       }
//     }
//   }, [components, selectedComponent?.id, isLargeScreen]);

//   // --- History Functions & Custom Confirmation ---
//   const handleClearTemplateConfirm = () => {
//     setConfirmMessage(
//       "Are you sure you want to clear the entire template? This action cannot be undone."
//     );
//     setConfirmAction(() => () => {
//       setComponents([]);
//       setSelectedComponent(null);
//       setHistory([[]]);
//       setHistoryIndex(0);
//       localStorage.removeItem("emailTemplateComponents");
//       setShowConfirmModal(false);
//     });
//     setShowConfirmModal(true);
//   };

//   const handleUndo = () => {
//     if (historyIndex > 0) {
//       setHistoryIndex(historyIndex - 1);
//       setComponents(history[historyIndex - 1]);
//       setSelectedComponent(null);
//     }
//   };

//   const handleRedo = () => {
//     if (historyIndex < history.length - 1) {
//       setHistoryIndex(historyIndex + 1);
//       setComponents(history[historyIndex + 1]);
//       setSelectedComponent(null);
//     }
//   };

//   // --- Component Management ---

//   const handleUpdateComponent = (id, updatedComponent) => {
//     if (
//       JSON.stringify(components.find((c) => c.id === id)) !==
//       JSON.stringify(updatedComponent)
//     ) {
//       setComponents((prev) =>
//         prev.map((c) => (c.id === id ? updatedComponent : c))
//       );
//     }
//   };

//   const handleDeleteComponent = (id) => {
//     setComponents((prev) => prev.filter((c) => c.id !== id));
//     setSelectedComponent(null);
//   };

//   // --- Drag & Drop Handlers ---

//   const handleDragStartCanvas = (e, index) => {
//     e.stopPropagation();
//     e.dataTransfer.effectAllowed = "move";
//     setDraggedComponentIndex(index);
//     setSelectedComponent(components[index]);
//   };

//   const handleDropOnCanvas = (e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!isLargeScreen) setShowPalette(false);

//     const type = e.dataTransfer.getData("componentType");
//     let newComponents = [...components];
//     const dropTargetIndex =
//       dragOverIndex !== null ? dragOverIndex : newComponents.length - 1;

//     if (type && draggedComponentIndex === null) {
//       // Drop new component from palette
//       const newComponent = getDefaults(type);
//       const insertIndex =
//         dropPosition === "below" && dragOverIndex !== null
//           ? dropTargetIndex + 1
//           : dragOverIndex === null && dropPosition === "below"
//           ? newComponents.length
//           : dropTargetIndex;

//       newComponents.splice(insertIndex, 0, newComponent);
//       setComponents(newComponents);
//       setSelectedComponent(newComponent);
//     } else if (
//       draggedComponentIndex !== null &&
//       dragOverIndex !== null &&
//       dropPosition !== null
//     ) {
//       // Reorder existing component
//       const [movedItem] = newComponents.splice(draggedComponentIndex, 1);
//       let targetIndex = dropTargetIndex;

//       if (draggedComponentIndex < dropTargetIndex) {
//         targetIndex =
//           dropPosition === "above" ? dropTargetIndex - 1 : dropTargetIndex;
//       } else if (draggedComponentIndex > dropTargetIndex) {
//         targetIndex =
//           dropPosition === "below" ? dropTargetIndex + 1 : dropTargetIndex;
//       }

//       if (
//         dragOverIndex === newComponents.length - 1 &&
//         dropPosition === "below"
//       ) {
//         targetIndex = newComponents.length;
//       }

//       targetIndex = Math.max(0, Math.min(newComponents.length, targetIndex));

//       newComponents.splice(targetIndex, 0, movedItem);
//       setComponents(newComponents);
//     }

//     setDraggedComponentIndex(null);
//     setDragOverIndex(null);
//     setDropPosition(null);
//   };

//   const handleDragOverCanvas = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     e.dataTransfer.dropEffect =
//       draggedComponentIndex !== null ? "move" : "copy";

//     const targetElement = e.target.closest(
//       ".email-component-draggable-wrapper"
//     );
//     if (targetElement) {
//       const rect = targetElement.getBoundingClientRect();
//       const y = e.clientY - rect.top;
//       const index = parseInt(targetElement.dataset.index);

//       if (y < rect.height / 2) {
//         setDropPosition("above");
//         setDragOverIndex(index);
//       } else {
//         setDropPosition("below");
//         setDragOverIndex(index);
//       }
//     } else if (components.length > 0) {
//       setDropPosition("below");
//       setDragOverIndex(components.length - 1);
//     } else {
//       setDropPosition("below");
//       setDragOverIndex(0);
//     }
//   };

//   const handleDragLeaveCanvas = () => {
//     setDragOverIndex(null);
//     setDropPosition(null);
//   };

//   const handleDragEndCanvas = () => {
//     setDraggedComponentIndex(null);
//     setDragOverIndex(null);
//     setDropPosition(null);
//   };

//   // --- Export Handlers ---

//   const handleExportHtml = () => {
//     const html = generateEmailHtml(components);
//     setGeneratedHtml(html);
//     setShowHtmlModal(true);
//   };

//   const handleExportJson = () => {
//     const json = JSON.stringify(components, null, 2);
//     setGeneratedJson(json);
//     setShowJsonModal(true);
//   };

//   const handleCanvasClick = (e) => {
//     e.stopPropagation();
//     setSelectedComponent(null);
//     if (!isLargeScreen) {
//       setShowEditor(false);
//       setShowPalette(false);
//     }
//   };

//   const togglePalette = () => {
//     if (!isLargeScreen) {
//       setShowEditor(false);
//     }
//     setShowPalette((p) => !p);
//   };

//   const toggleEditor = () => {
//     if (!isLargeScreen) {
//       setShowPalette(false);
//     }
//     setShowEditor((e) => !e);
//   };

//   const canvasMaxWidth =
//     previewMode === "mobile" ? "w-full max-w-[375px] shadow-2xl" : "max-w-xl";

//   // Calculate top offset for mobile panels (Navbar height: ~64px + Toggle bar height: ~44px)
//   const mobilePanelTopOffset = "top-[108px]";

//   return (
//     <ThemeProvider>
//       <div className="flex flex-col h-screen w-full bg-background-main text-text-primary font-sans transition-all-medium overflow-hidden">
//         <Navbar />

//         {/* Preview Mode & Mobile Toggle Bar */}
//         <div className="flex justify-between lg:justify-center py-3 px-4 bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark shadow-sm">
//           {/* Mobile Palette Toggle */}
//           {!isLargeScreen && (
//             <button
//               onClick={togglePalette}
//               className={`p-2 rounded-lg transition-all-medium shadow-md ${
//                 showPalette
//                   ? "bg-accent text-white"
//                   : "bg-gray-200 dark:bg-gray-700 text-text-primary hover:bg-gray-300 dark:hover:bg-gray-600"
//               }`}
//               title="Toggle Component Palette"
//             >
//               <PanelLeft className="w-5 h-5" />
//             </button>
//           )}

//           {/* Desktop/Mobile Preview Toggle */}
//           <div className="flex space-x-3">
//             <button
//               onClick={() => setPreviewMode("desktop")}
//               className={`px-3 sm:px-5 py-2.5 rounded-lg text-sm font-medium transition-all-medium shadow-md ${
//                 previewMode === "desktop"
//                   ? "bg-accent text-white shadow-xl-hover"
//                   : "bg-gray-200 dark:bg-gray-700 text-white hover:bg-gray-300 dark:hover:bg-gray-600"
//               }`}
//             >
//               <Monitor className="w-4 h-4 inline mr-1" />
//               Desktop
//             </button>
//             <button
//               onClick={() => setPreviewMode("mobile")}
//               className={`px-3 sm:px-5 py-2.5 rounded-lg text-sm font-medium transition-all-medium shadow-md ${
//                 previewMode === "mobile"
//                   ? "bg-accent text-white shadow-xl-hover"
//                   : "bg-gray-200 dark:bg-gray-700 text-white hover:bg-gray-300 dark:hover:bg-gray-600"
//               }`}
//             >
//               <Smartphone className="w-4 h-4 inline mr-1" />
//               Mobile
//             </button>
//           </div>

//           {/* Mobile Editor Toggle */}
//           {!isLargeScreen && (
//             <button
//               onClick={toggleEditor}
//               disabled={!selectedComponent}
//               className={`p-2 rounded-lg transition-all-medium shadow-md ${
//                 showEditor && selectedComponent
//                   ? "bg-accent text-white"
//                   : "bg-gray-200 dark:bg-gray-700 text-text-primary hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
//               }`}
//               title="Toggle Editor Panel"
//             >
//               <PanelRight className="w-5 h-5" />
//             </button>
//           )}
//         </div>

//         <div className="flex flex-1 overflow-hidden relative">
//           {/* Left Palette (Drag Source) - Responsive Container */}
//           <div
//             className={`
//               lg:static lg:w-80 lg:flex-shrink-0
//               ${
//                 isLargeScreen
//                   ? "block"
//                   : showPalette
//                   ? `fixed inset-0 ${mobilePanelTopOffset} z-30 block`
//                   : "hidden"
//               }
//               bg-background-light dark:bg-background-dark border-r border-border-light dark:border-border-dark shadow-xl flex flex-col transition-all-medium
//               ${isLargeScreen ? "" : "w-full max-w-sm sm:max-w-md"}
//           `}
//           >
//             <Palette
//               historyState={{ historyIndex, historyLength: history.length }}
//               onUndo={handleUndo}
//               onRedo={handleRedo}
//               onClearTemplate={handleClearTemplateConfirm}
//             />
//             {/* Close Button for Mobile */}
//             {!isLargeScreen && (
//               <div className="p-4 border-t border-border-light dark:border-border-dark bg-header-bg-light dark:bg-header-bg-dark">
//                 <button
//                   onClick={() => setShowPalette(false)}
//                   className="w-full py-2.5 px-4 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all-medium shadow-md flex items-center justify-center gap-2"
//                 >
//                   <X className="w-4 h-4" /> Close Palette
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Center Canvas (Drop Target) */}
//           <main
//             ref={canvasRef}
//             onDrop={handleDropOnCanvas}
//             onDragOver={handleDragOverCanvas}
//             onDragLeave={handleDragLeaveCanvas}
//             onClick={handleCanvasClick}
//             className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative
//                         bg-dots-light dark:bg-dots-dark bg-repeat bg-[length:20px_20px]
//                         flex justify-center items-start pt-6 pb-12 hide-scrollbar transition-all-medium`}
//           >
//             <div
//               className={`${canvasMaxWidth} mx-auto w-full bg-canvas-bg shadow-2xl rounded-2xl overflow-hidden min-h-[700px] border border-gray-300 dark:border-border-dark transition-all-medium`}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="p-4 min-h-[600px]">
//                 {components.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-text-secondary border-4 border-dashed border-border-light dark:border-border-dark rounded-xl m-4 p-8 bg-background-light dark:bg-background-dark transition-all-medium animate-fade-in">
//                     <Code className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-600 animate-bounce" />
//                     <p className="text-xl font-semibold mb-2 text-center">
//                       Start Building Your Email
//                     </p>
//                     <p className="text-center">
//                       Drag components from the left panel here to create your
//                       layout.
//                     </p>
//                   </div>
//                 ) : (
//                   components.map((comp, index) => (
//                     <div
//                       key={comp.id}
//                       data-index={index}
//                       draggable
//                       onDragStart={(e) => handleDragStartCanvas(e, index)}
//                       onDragEnd={handleDragEndCanvas}
//                       className={`email-component-draggable-wrapper relative transition-all-medium animate-fade-in group
//                                       ${
//                                         draggedComponentIndex === index
//                                           ? "opacity-50 border-2 border-dashed border-amber-500 rounded-lg"
//                                           : ""
//                                       }`}
//                     >
//                       {/* Drag handle for reordering */}
//                       <div
//                         className="absolute -left-7 top-1/2 -translate-y-1/2 p-1.5
//                                       text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 rounded-full
//                                       cursor-grab opacity-0 lg:group-hover:opacity-100 transition-all-medium z-20 shadow-md hover:bg-gray-200 dark:hover:bg-gray-700
//                                       hidden lg:block" /* Hide on mobile/tablet */
//                         title="Drag to reorder"
//                         onDragStart={(e) => handleDragStartCanvas(e, index)}
//                       >
//                         <GripVertical className="w-5 h-5" />
//                       </div>

//                       <EmailComponent
//                         component={comp}
//                         isSelected={selectedComponent?.id === comp.id}
//                         onClick={() => setSelectedComponent(comp)}
//                         isDragOverAbove={
//                           dragOverIndex === index && dropPosition === "above"
//                         }
//                         isDragOverBelow={
//                           dragOverIndex === index && dropPosition === "below"
//                         }
//                       />
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </main>

//           {/* Right Editor Panel (Component Editor) - Responsive Container */}
//           <div
//             className={`
//               lg:static lg:w-80 lg:flex-shrink-0
//               ${
//                 isLargeScreen
//                   ? "block"
//                   : showEditor
//                   ? `fixed inset-0 ${mobilePanelTopOffset} z-30 block`
//                   : "hidden"
//               }
//               bg-background-light dark:bg-background-dark border-l border-border-light dark:border-border-dark shadow-xl flex flex-col hide-scrollbar transition-all-medium
//               ${isLargeScreen ? "" : "w-full max-w-sm sm:max-w-md ml-auto"}
//           `}
//           >
//             <EditorPanel
//               component={selectedComponent}
//               onUpdate={handleUpdateComponent}
//               onDelete={handleDeleteComponent}
//             />
//             <div className="p-4 border-t border-border-light dark:border-border-dark mt-auto bg-header-bg-light dark:bg-header-bg-dark shadow-inner">
//               {/* Deselect button is only visible on large screens since mobile editor closes on canvas click */}
//               {isLargeScreen && selectedComponent && (
//                 <button
//                   onClick={() => setSelectedComponent(null)}
//                   className="w-full py-2.5 px-4 text-sm font-medium text-white bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all-medium mb-3 shadow-md"
//                 >
//                   Deselect Component
//                 </button>
//               )}
//               <div className="grid grid-cols-2 gap-3">
//                 <button
//                   onClick={handleExportHtml}
//                   className="py-3 px-4 text-sm font-medium text-white bg-accent hover:bg-accent-dark rounded-lg transition-all-medium flex items-center justify-center gap-2 shadow-md hover:shadow-xl-hover"
//                 >
//                   <Code className="w-4 h-4" />
//                   Export HTML
//                 </button>
//                 <button
//                   onClick={handleExportJson}
//                   className="py-3 px-4 text-sm font-medium text-white bg-accent hover:bg-accent-dark rounded-lg transition-all-medium flex items-center justify-center gap-2 shadow-md hover:shadow-xl-hover"
//                 >
//                   <Code className="w-4 h-4" />
//                   Export JSON
//                 </button>
//               </div>
//               {/* Close Button for Mobile */}
//               {!isLargeScreen && (
//                 <button
//                   onClick={() => setShowEditor(false)}
//                   className="w-full py-2.5 mt-3 px-4 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all-medium shadow-md flex items-center justify-center gap-2"
//                 >
//                   <X className="w-4 h-4" /> Close Editor
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Modals */}
//           {showHtmlModal && (
//             <ExportModal
//               title="Generated Email HTML"
//               content={generatedHtml}
//               onClose={() => setShowHtmlModal(false)}
//             />
//           )}

//           {showJsonModal && (
//             <ExportModal
//               title="Generated Email JSON"
//               content={generatedJson}
//               onClose={() => setShowJsonModal(false)}
//             />
//           )}

//           {/* Custom Confirmation Modal */}
//           {showConfirmModal && (
//             <CustomConfirmModal
//               message={confirmMessage}
//               onConfirm={confirmAction}
//               onCancel={() => setShowConfirmModal(false)}
//             />
//           )}
//         </div>
//       </div>
//     </ThemeProvider>
//   );
// }

// App.jsx (The new, simplified file)
import React, { useState, useEffect, useRef } from "react";
import {
  Code,
  GripVertical,
  MousePointerClick,
  Monitor,
  Smartphone,
  PanelLeft,
  PanelRight,
  Trash2,
  X,
  MousePointerClick as MousePointerClickIcon,
} from "lucide-react";

// Import Refactored Components and Utilities
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/ui/Navbar";
import Palette from "./components/builder/Palette";
import EditorPanel from "./components/builder/EditorPanel";
import EmailComponent from "./components/builder/EmailComponent";
import ExportModal from "./components/modals/ExportModal";
import CustomConfirmModal from "./components/modals/CustomConfirmModal";

import { getDefaults } from "./utils/componentDefaults";
import { generateEmailHtml } from "./utils/htmlGenerators";

// --- Core App Logic ---

export default function App() {
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showHtmlModal, setShowHtmlModal] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [generatedJson, setGeneratedJson] = useState("");
  const [previewMode, setPreviewMode] = useState("desktop");

  // Responsive State
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const [showPalette, setShowPalette] = useState(true);
  const [showEditor, setShowEditor] = useState(false);

  // Custom Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");

  // History/Undo/Redo state
  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Drag-and-drop state
  const [draggedComponentIndex, setDraggedComponentIndex] = useState(null);
  const [dropPosition, setDropPosition] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const canvasRef = useRef(null);

  // --- Initial Setup and Persistence & Responsiveness Checks ---
  useEffect(() => {
    const handleResize = () => {
      const isLarge = window.innerWidth >= 1024; // lg: breakpoint
      setIsLargeScreen(isLarge);

      if (isLarge) {
        setShowPalette(true);
        setShowEditor(false);
      } else if (!isLarge && showPalette && showEditor) {
        // On mobile, if both are somehow open, prioritize closing the editor
        setShowEditor(false);
      }
    };

    // Initial check and load
    handleResize();

    const savedComponents = localStorage.getItem("emailTemplateComponents");
    if (savedComponents) {
      try {
        const parsedComponents = JSON.parse(savedComponents);
        setComponents(parsedComponents);
        setHistory([parsedComponents]);
      } catch (e) {
        console.error("Failed to parse saved components", e);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Save components to localStorage (and trigger history update)
  useEffect(() => {
    localStorage.setItem("emailTemplateComponents", JSON.stringify(components));
    // Update history only if the change wasn't from undo/redo
    if (historyIndex === history.length - 1) {
      const newHistory = [
        ...history.slice(0, historyIndex + 1),
        [...components],
      ];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [components]);

  // Update selected component state when main components list changes
  useEffect(() => {
    if (selectedComponent) {
      const updatedSelected = components.find(
        (c) => c.id === selectedComponent.id
      );
      setSelectedComponent(updatedSelected || null);

      if (!isLargeScreen && updatedSelected) {
        // FIX: If a component is selected on mobile, force-open the editor and close palette
        setShowPalette(false);
        setShowEditor(true);
      }
      // FIX: If selected component is deleted, close editor
      if (!isLargeScreen && !updatedSelected) {
        setShowEditor(false);
      }
    }
  }, [components, selectedComponent?.id, isLargeScreen]);

  // --- History Functions & Custom Confirmation ---
  const handleClearTemplateConfirm = () => {
    setConfirmMessage(
      "Are you sure you want to clear the entire template? This action cannot be undone."
    );
    setConfirmAction(() => () => {
      setComponents([]);
      setSelectedComponent(null);
      setHistory([[]]);
      setHistoryIndex(0);
      localStorage.removeItem("emailTemplateComponents");
      setShowConfirmModal(false);
    });
    setShowConfirmModal(true);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setComponents(history[historyIndex - 1]);
      setSelectedComponent(null);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setComponents(history[historyIndex + 1]);
      setSelectedComponent(null);
    }
  };

  // --- Component Management ---

  const handleUpdateComponent = (id, updatedComponent) => {
    if (
      JSON.stringify(components.find((c) => c.id === id)) !==
      JSON.stringify(updatedComponent)
    ) {
      setComponents((prev) =>
        prev.map((c) => (c.id === id ? updatedComponent : c))
      );
    }
  };

  const handleDeleteComponent = (id) => {
    setComponents((prev) => prev.filter((c) => c.id !== id));
    setSelectedComponent(null);
  };

  // --- Drag & Drop Handlers ---

  const handleDragStartCanvas = (e, index) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = "move";
    setDraggedComponentIndex(index);
    setSelectedComponent(components[index]);
  };

  const handleDropOnCanvas = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const type = e.dataTransfer.getData("componentType");
    let newComponents = [...components];
    const dropTargetIndex =
      dragOverIndex !== null ? dragOverIndex : newComponents.length - 1;

    if (type && draggedComponentIndex === null) {
      // Drop new component from palette
      const newComponent = getDefaults(type);
      const insertIndex =
        dropPosition === "below" && dragOverIndex !== null
          ? dropTargetIndex + 1
          : dragOverIndex === null && dropPosition === "below"
          ? newComponents.length
          : dropTargetIndex;

      newComponents.splice(insertIndex, 0, newComponent);
      setComponents(newComponents);
      setSelectedComponent(newComponent);

      // FIX: Automatically switch to editor view on mobile after dropping a new component
      if (!isLargeScreen) {
        setShowPalette(false);
        setShowEditor(true);
      }
    } else if (
      draggedComponentIndex !== null &&
      dragOverIndex !== null &&
      dropPosition !== null
    ) {
      // Reorder existing component
      const [movedItem] = newComponents.splice(draggedComponentIndex, 1);
      let targetIndex = dropTargetIndex;

      if (draggedComponentIndex < dropTargetIndex) {
        targetIndex =
          dropPosition === "above" ? dropTargetIndex - 1 : dropTargetIndex;
      } else if (draggedComponentIndex > dropTargetIndex) {
        targetIndex =
          dropPosition === "below" ? dropTargetIndex + 1 : dropTargetIndex;
      }

      if (
        dragOverIndex === newComponents.length - 1 &&
        dropPosition === "below"
      ) {
        targetIndex = newComponents.length;
      }

      targetIndex = Math.max(0, Math.min(newComponents.length, targetIndex));

      newComponents.splice(targetIndex, 0, movedItem);
      setComponents(newComponents);
    }

    setDraggedComponentIndex(null);
    setDragOverIndex(null);
    setDropPosition(null);
  };

  const handleDragOverCanvas = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect =
      draggedComponentIndex !== null ? "move" : "copy";

    const targetElement = e.target.closest(
      ".email-component-draggable-wrapper"
    );
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const index = parseInt(targetElement.dataset.index);

      if (y < rect.height / 2) {
        setDropPosition("above");
        setDragOverIndex(index);
      } else {
        setDropPosition("below");
        setDragOverIndex(index);
      }
    } else if (components.length > 0) {
      setDropPosition("below");
      setDragOverIndex(components.length - 1);
    } else {
      setDropPosition("below");
      setDragOverIndex(0);
    }
  };

  const handleDragLeaveCanvas = () => {
    setDragOverIndex(null);
    setDropPosition(null);
  };

  const handleDragEndCanvas = () => {
    setDraggedComponentIndex(null);
    setDragOverIndex(null);
    setDropPosition(null);
  };

  // --- Export Handlers ---

  const handleExportHtml = () => {
    const html = generateEmailHtml(components);
    setGeneratedHtml(html);
    setShowHtmlModal(true);
  };

  const handleExportJson = () => {
    const json = JSON.stringify(components, null, 2);
    setGeneratedJson(json);
    setShowJsonModal(true);
  };

  const handleCanvasClick = (e) => {
    e.stopPropagation();
    setSelectedComponent(null);
    if (!isLargeScreen) {
      // FIX: Allow clicking the canvas to deselect and close both panels
      setShowEditor(false);
      setShowPalette(false);
    }
  };

  const togglePalette = () => {
    if (!isLargeScreen) {
      // FIX: Ensure Editor is closed when Palette is opened/toggled on mobile
      setShowEditor(false);
    }
    setShowPalette((p) => !p);
  };

  const toggleEditor = () => {
    if (!isLargeScreen) {
      // FIX: Ensure Palette is closed when Editor is opened/toggled on mobile
      setShowPalette(false);
    }
    setShowEditor((e) => !e);
  };

  const canvasMaxWidth =
    previewMode === "mobile" ? "w-full max-w-[375px] shadow-2xl" : "max-w-xl";

  // Calculate top offset for mobile panels (Navbar height: ~64px + Toggle bar height: ~44px)
  const mobilePanelTopOffset = "top-[108px]";

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen w-full bg-background-main text-text-primary font-sans transition-all-medium overflow-hidden">
        <Navbar />

        {/* Preview Mode & Mobile Toggle Bar */}
        <div className="flex justify-between lg:justify-center py-3 px-4 bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark shadow-sm">
          {/* Mobile Palette Toggle */}
          {!isLargeScreen && (
            <button
              onClick={togglePalette}
              className={`p-2 rounded-lg transition-all-medium shadow-md ${
                showPalette
                  ? "bg-accent text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-text-primary hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
              title="Toggle Component Palette"
            >
              <PanelLeft className="w-5 h-5" />
            </button>
          )}

          {/* Desktop/Mobile Preview Toggle */}
          <div className="flex space-x-3">
            <button
              onClick={() => setPreviewMode("desktop")}
              className={`px-3 sm:px-5 py-2.5 rounded-lg text-sm font-medium transition-all-medium shadow-md ${
                previewMode === "desktop"
                  ? "bg-accent text-white shadow-xl-hover"
                  : "bg-gray-200 dark:bg-gray-700 text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              <Monitor className="w-4 h-4 inline mr-1" />
              Desktop
            </button>
            <button
              onClick={() => setPreviewMode("mobile")}
              className={`px-3 sm:px-5 py-2.5 rounded-lg text-sm font-medium transition-all-medium shadow-md ${
                previewMode === "mobile"
                  ? "bg-accent text-white shadow-xl-hover"
                  : "bg-gray-200 dark:bg-gray-700 text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              <Smartphone className="w-4 h-4 inline mr-1" />
              Mobile
            </button>
          </div>

          {/* Mobile Editor Toggle */}
          {!isLargeScreen && (
            <button
              onClick={toggleEditor}
              disabled={!selectedComponent}
              className={`p-2 rounded-lg transition-all-medium shadow-md ${
                showEditor && selectedComponent
                  ? "bg-accent text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-text-primary hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
              title="Toggle Editor Panel"
            >
              <PanelRight className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex flex-1 overflow-hidden relative">
          {/* Left Palette (Drag Source) - Responsive Container */}
          <div
            className={`
              lg:static lg:w-80 lg:flex-shrink-0 
              ${
                isLargeScreen
                  ? "block"
                  : showPalette
                  ? `fixed inset-0 ${mobilePanelTopOffset} z-30 block`
                  : "hidden"
              }
              bg-background-light dark:bg-background-dark border-r border-border-light dark:border-border-dark shadow-xl flex flex-col transition-all-medium
              ${isLargeScreen ? "" : "w-full max-w-sm sm:max-w-md"}
          `}
          >
            <Palette
              historyState={{ historyIndex, historyLength: history.length }}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onClearTemplate={handleClearTemplateConfirm}
            />
            {/* Close Button for Mobile */}
            {!isLargeScreen && (
              <div className="p-4 border-t border-border-light dark:border-border-dark bg-header-bg-light dark:bg-header-bg-dark">
                <button
                  onClick={() => setShowPalette(false)}
                  className="w-full py-2.5 px-4 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all-medium shadow-md flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" /> Close Palette
                </button>
              </div>
            )}
          </div>

          {/* Center Canvas (Drop Target) */}
          <main
            ref={canvasRef}
            onDrop={handleDropOnCanvas}
            onDragOver={handleDragOverCanvas}
            onDragLeave={handleDragLeaveCanvas}
            onClick={handleCanvasClick}
            className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative
                        bg-dots-light dark:bg-dots-dark bg-repeat bg-[length:20px_20px]
                        flex justify-center items-start pt-6 pb-12 hide-scrollbar transition-all-medium`}
          >
            <div
              className={`${canvasMaxWidth} mx-auto w-full bg-canvas-bg shadow-2xl rounded-2xl overflow-hidden min-h-[700px] border border-gray-300 dark:border-border-dark transition-all-medium`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 min-h-[600px]">
                {components.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-text-secondary border-4 border-dashed border-border-light dark:border-border-dark rounded-xl m-4 p-8 bg-background-light dark:bg-background-dark transition-all-medium animate-fade-in">
                    <Code className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-600 animate-bounce" />
                    <p className="text-xl font-semibold mb-2 text-center">
                      Start Building Your Email
                    </p>
                    <p className="text-center">
                      Drag components from the left panel here to create your
                      layout.
                    </p>
                  </div>
                ) : (
                  components.map((comp, index) => (
                    <div
                      key={comp.id}
                      data-index={index}
                      draggable
                      onDragStart={(e) => handleDragStartCanvas(e, index)}
                      onDragEnd={handleDragEndCanvas}
                      className={`email-component-draggable-wrapper relative transition-all-medium animate-fade-in group
                                      ${
                                        draggedComponentIndex === index
                                          ? "opacity-50 border-2 border-dashed border-amber-500 rounded-lg"
                                          : ""
                                      }`}
                    >
                      {/* Drag handle for reordering */}
                      <div
                        className="absolute -left-7 top-1/2 -translate-y-1/2 p-1.5
                                      text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 rounded-full
                                      cursor-grab opacity-0 lg:group-hover:opacity-100 transition-all-medium z-20 shadow-md hover:bg-gray-200 dark:hover:bg-gray-700
                                      hidden lg:block" /* Hide on mobile/tablet */
                        title="Drag to reorder"
                        onDragStart={(e) => handleDragStartCanvas(e, index)}
                      >
                        <GripVertical className="w-5 h-5" />
                      </div>

                      <EmailComponent
                        component={comp}
                        isSelected={selectedComponent?.id === comp.id}
                        onClick={() => setSelectedComponent(comp)}
                        isDragOverAbove={
                          dragOverIndex === index && dropPosition === "above"
                        }
                        isDragOverBelow={
                          dragOverIndex === index && dropPosition === "below"
                        }
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </main>

          {/* Right Editor Panel (Component Editor) - Responsive Container */}
          <div
            className={`
              lg:static lg:w-80 lg:flex-shrink-0 
              ${
                isLargeScreen
                  ? "block"
                  : showEditor
                  ? `fixed inset-0 ${mobilePanelTopOffset} z-30 block`
                  : "hidden"
              }
              bg-background-light dark:bg-background-dark border-l border-border-light dark:border-border-dark shadow-xl flex flex-col hide-scrollbar transition-all-medium
              ${isLargeScreen ? "" : "w-full max-w-sm sm:max-w-md ml-auto"}
          `}
          >
            <EditorPanel
              component={selectedComponent}
              onUpdate={handleUpdateComponent}
              onDelete={handleDeleteComponent}
            />
            <div className="p-4 border-t border-border-light dark:border-border-dark mt-auto bg-header-bg-light dark:bg-header-bg-dark shadow-inner">
              {/* Deselect button is only visible on large screens since mobile editor closes on canvas click */}
              {isLargeScreen && selectedComponent && (
                <button
                  onClick={() => setSelectedComponent(null)}
                  className="w-full py-2.5 px-4 text-sm font-medium text-white bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all-medium mb-3 shadow-md"
                >
                  Deselect Component
                </button>
              )}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleExportHtml}
                  className="py-3 px-4 text-sm font-medium text-white bg-accent hover:bg-accent-dark rounded-lg transition-all-medium flex items-center justify-center gap-2 shadow-md hover:shadow-xl-hover"
                >
                  <Code className="w-4 h-4" />
                  Export HTML
                </button>
                <button
                  onClick={handleExportJson}
                  className="py-3 px-4 text-sm font-medium text-white bg-accent hover:bg-accent-dark rounded-lg transition-all-medium flex items-center justify-center gap-2 shadow-md hover:shadow-xl-hover"
                >
                  <Code className="w-4 h-4" />
                  Export JSON
                </button>
              </div>
              {/* Close Button for Mobile */}
              {!isLargeScreen && (
                <button
                  onClick={() => setShowEditor(false)}
                  className="w-full py-2.5 mt-3 px-4 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all-medium shadow-md flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" /> Close Editor
                </button>
              )}
            </div>
          </div>

          {/* Modals */}
          {showHtmlModal && (
            <ExportModal
              title="Generated Email HTML"
              content={generatedHtml}
              onClose={() => setShowHtmlModal(false)}
            />
          )}

          {showJsonModal && (
            <ExportModal
              title="Generated Email JSON"
              content={generatedJson}
              onClose={() => setShowJsonModal(false)}
            />
          )}

          {/* Custom Confirmation Modal */}
          {showConfirmModal && (
            <CustomConfirmModal
              message={confirmMessage}
              onConfirm={confirmAction}
              onCancel={() => setShowConfirmModal(false)}
            />
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}
