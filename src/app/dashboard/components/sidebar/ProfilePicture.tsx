import { IconType } from 'react-icons';

interface ProfilePictureProps {
    imageUrl: string;
    altText: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ imageUrl, altText }) => {
    return (
        <img src={imageUrl} alt={altText} className="w-10 h-10 rounded-full object-cover" />
    );
};

export default ProfilePicture;
