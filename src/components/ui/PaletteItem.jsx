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

const PaletteItem = ({ type, label, icon: Icon }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("componentType", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      // Increased vertical padding (p-3 to p-4) and general spacing for better touch target
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
