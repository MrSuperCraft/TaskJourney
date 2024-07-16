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
      className="text-[#BABABA] items-center w-full flex gap-2 hover:bg-primary-500 hover:text-white py-4 font-medium text-sm rounded-md duration-200 px-2"
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
