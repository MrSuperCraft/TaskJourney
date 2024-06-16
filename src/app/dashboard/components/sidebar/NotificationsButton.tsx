import { IconType } from 'react-icons';
import { motion } from 'framer-motion'; // You may need to install framer-motion

interface NotificationsProps {
    icon: JSX.Element; // Change IconType to JSX.Element
    onClick: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ icon, onClick }) => {
    const handleKeyPress = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'Enter') {
            onClick();
        }
    };

    return (
        <motion.button
            className="p-3 rounded-lg cursor-pointer hover:text-primary-brand hover:shadow-md hover:bg-light-cyan focus:outline-none"
            onClick={onClick}
            onKeyDown={handleKeyPress}
            aria-label="Notifications"
        >
            {icon} {/* Render the icon JSX element */}
        </motion.button>
    );
};

export default Notifications;
