import Image from 'next/image'


interface ProfilePictureProps {
    imageUrl: string;
    altText: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ imageUrl, altText }) => {
    return (
        <Image src={imageUrl} alt={altText} className="w-10 h-10 rounded-full object-cover" />
    );
};

export default ProfilePicture;
