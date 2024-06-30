import { useState } from "react";
import { motion } from "framer-motion";

interface TabButtonProps {
  icon: JSX.Element;
  label: string;
  onClick: () => void;
  isLoading: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({
  icon,
  label,
  onClick,
  isLoading,
}) => {
  const handleKeyPress = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      onClick();
    }
  };

  return (
    <div
      className="flex gap-2 items-center px-4 py-4 text-[#bababa] font-semibold text-sm hover:bg-primary-500 duration-200 hover:text-white"
      onClick={onClick}
      aria-label={label}
      role="button"
      tabIndex={0} // Ensures button is focusable
    >
      {icon}
      <span>{label}</span>
    </div>
  );
};

export default TabButton;
