interface WelcomeMessageProps {
    userName: string;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ userName }) => {
    return (
        <h1 className="text-lg font-semibold">Welcome, {userName}!</h1>
    );
};

export default WelcomeMessage;
