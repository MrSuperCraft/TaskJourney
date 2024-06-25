import { Accordion, AccordionItem } from '@nextui-org/react';
import { FaQuestionCircle, FaRobot, FaGamepad, FaBell, FaLock, FaComments, FaHeadset } from 'react-icons/fa';

const FAQ: React.FC = () => {
    return (
        <div className="w-full min-h-screen bg-slate-300 dark:bg-dark-teal">
            <div className="max-w-3xl mx-auto p-10">
                <h2 className="text-3xl font-bold mb-6 p-4 text-center">Frequently Asked Questions</h2>
                <Accordion variant="shadow">
                    <AccordionItem
                        title={
                            <span className="font-bold flex items-center max-sm:text-md">
                                <FaQuestionCircle className="mr-4 text-xl max-sm:hidden" style={{ minWidth: '24px', minHeight: '24px' }} />
                                What is TaskJourney and how does it help users improve productivity?
                            </span>
                        }
                        textValue="What is TaskJourney and how does it help users improve productivity?">
                        <p>TaskJourney is a productivity platform designed to help users set and track their goals, manage tasks efficiently, and stay motivated. It offers features like an AI assistant, gamification elements, and customizable notifications to enhance productivity.</p>
                    </AccordionItem>
                    <AccordionItem
                        title={
                            <span className="font-bold flex items-center max-sm:text-md">
                                <FaRobot className="mr-4 text-xl max-sm:hidden" style={{ minWidth: '24px', minHeight: '24px' }} />
                                How does the AI assistant in TaskJourney help users with goal planning and prioritization?
                            </span>
                        }
                        textValue="How does the AI assistant in TaskJourney help users with goal planning and prioritization?">
                        <p>The AI assistant in TaskJourney analyzes user behavior, preferences, and task history to provide personalized recommendations for goal planning and task prioritization. It can suggest relevant tasks, deadlines, and strategies to achieve goals effectively.</p>
                    </AccordionItem>
                    <AccordionItem
                        title={
                            <span className="font-bold flex items-center max-sm:text-md">
                                <FaGamepad className="mr-4 text-xl max-sm:hidden" style={{ minWidth: '24px', minHeight: '24px' }} />
                                What gamification elements does TaskJourney offer to motivate users and enhance their productivity?
                            </span>
                        }
                        textValue="What gamification elements does TaskJourney offer to motivate users and enhance their productivity?">
                        <p>TaskJourney includes gamification elements such as achievement badges, progress tracking, rewards for completing tasks and goals, and leaderboard rankings. These elements motivate users, foster healthy competition, and boost productivity.</p>
                    </AccordionItem>
                    <AccordionItem
                        title={
                            <span className="font-bold flex items-center max-sm:text-md">
                                <FaBell className="mr-4 text-xl max-sm:hidden" style={{ minWidth: '24px', minHeight: '24px' }} />
                                How do notifications work in TaskJourney, and can users customize their notification preferences?
                            </span>
                        }
                        textValue="How do notifications work in TaskJourney, and can users customize their notification preferences?">
                        <p>TaskJourney sends notifications and reminders to users based on their preferences and settings. Users can customize notification frequency, types of notifications (e.g., email, push notifications), and set quiet hours to manage interruptions.</p>
                    </AccordionItem>
                    <AccordionItem
                        title={
                            <span className="font-bold flex items-center max-sm:text-md">
                                <FaLock className="mr-4 text-xl max-sm:hidden" style={{ minWidth: '24px', minHeight: '24px' }} />
                                What security measures are in place to protect user data and ensure privacy on TaskJourney?
                            </span>
                        }
                        textValue="What security measures are in place to protect user data and ensure privacy on TaskJourney?">
                        <p>TaskJourney prioritizes user data security and privacy. It uses encryption protocols, secure authentication methods, and regular security audits to protect user data. Users have control over their data sharing and privacy settings.</p>
                    </AccordionItem>
                    <AccordionItem
                        title={
                            <span className="font-bold flex items-center max-sm:text-md">
                                <FaComments className="mr-4 text-xl max-sm:hidden" style={{ minWidth: '24px', minHeight: '24px' }} />
                                How can users provide feedback or suggestions for improving TaskJourney?
                            </span>
                        }
                        textValue="How can users provide feedback or suggestions for improving TaskJourney?">
                        <p>TaskJourney welcomes user feedback and suggestions for improvement. Users can submit feedback through the platform&apos;s feedback form, participate in surveys or polls, and engage in community forums to share ideas and suggestions.</p>
                    </AccordionItem>
                    <AccordionItem
                        title={
                            <span className="font-bold flex items-center max-sm:text-md">
                                <FaHeadset className="mr-4 text-xl max-sm:hidden" style={{ minWidth: '24px', minHeight: '24px' }} />
                                Is there customer support available to assist users with any issues or questions they may have?
                            </span>
                        }
                        textValue="Is there customer support available to assist users with any issues or questions they may have?">
                        <p>Yes, TaskJourney provides customer support to assist users with any issues, questions, or technical difficulties they may encounter. Users can reach out to the support team through email, live chat, or support tickets for prompt assistance.</p>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
};

export default FAQ;
