// import React from "react";

// const PaletteItem = ({ type, label, icon: Icon }) => {
//   const handleDragStart = (e) => {
//     e.dataTransfer.setData("componentType", type);
//     e.dataTransfer.effectAllowed = "copy";
//   };

//   return (
//     <div
//       draggable
//       onDragStart={handleDragStart}
//       className="flex flex-col items-center justify-center p-3 sm:p-4 m-0.5 sm:m-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl shadow-md cursor-grab active:cursor-grabbing hover:shadow-xl-hover hover:border-accent transition-all-medium animate-fade-in"
//     >
//       <Icon className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 text-accent transition-all-fast hover:scale-110" />
//       <span className="text-xs sm:text-sm font-medium text-text-primary text-center">
//         {label}
//       </span>
//     </div>
//   );
// };

// export default PaletteItem;

import React from "react";

// UPDATED PROP LIST
const PaletteItem = ({
  type,
  label,
  icon: Icon,
  onDragStart: onPropDragStart,
}) => {
  const handleDragStart = (e) => {
    // 1. Execute the prop function (will close the panel on mobile)
    if (onPropDragStart) {
      onPropDragStart();
    }

    // 2. Initiate the native drag operation
    e.dataTransfer.setData("componentType", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart} // USE THE NEW LOCAL HANDLER
      className="flex flex-col items-center justify-center p-4 m-0.5 sm:m-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl shadow-md cursor-grab active:cursor-grabbing hover:shadow-xl-hover hover:border-accent transition-all-medium animate-fade-in"
    >
      <Icon className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 text-accent transition-all-fast hover:scale-110" />
      <span className="text-xs sm:text-sm font-medium text-text-primary text-center">
        {label}
      </span>
    </div>
  );
};

export default PaletteItem;
