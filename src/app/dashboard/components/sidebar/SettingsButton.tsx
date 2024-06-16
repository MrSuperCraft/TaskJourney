import { IconType } from 'react-icons';

interface SettingsButtonProps {
    icon: IconType;
    onClick: () => void;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ icon: Icon, onClick }) => {
    return (
        <button className="p-3 rounded-lg cursor-pointer hover:text-primary-brand hover:shadow-md hover:bg-light-cyan focus:outline-none" onClick={onClick}>
            <Icon size={20} />
        </button>
    );
};

export default SettingsButton;
