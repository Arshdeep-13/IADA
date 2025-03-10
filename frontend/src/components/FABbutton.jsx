import React from "react";

const FabButton = ({ onClick, icon, badgeCount }) => {
  // Inline style for the animation
  const animationStyle = badgeCount > 0 ? {
    animation: 'scaleGrowShrink 2s infinite'
  } : {};

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-8 right-8 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 focus:outline-none transition-transform transform duration-500 z-50`}
      aria-label="Add"
      style={animationStyle}
    >
      <span
        style={animationStyle}
        className="transition-transform transform"
      >
        {icon}
      </span>
      {badgeCount > 0 && (
        <span className="absolute bottom-8 right-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white font-bold text-xs">
          {badgeCount}
        </span>
      )}
      <style>
        {`
          @keyframes scaleGrowShrink {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.2);
            }
            100% {
              transform: scale(1);
            }
          }
        `}
      </style>
    </button>
  );
};

export default FabButton;
