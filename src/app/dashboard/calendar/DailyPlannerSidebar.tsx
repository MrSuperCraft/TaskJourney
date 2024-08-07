'use client';

import React, { useState } from 'react';
import { Modal, Button, ModalHeader, ModalBody, ModalFooter, ModalContent, useDisclosure, Divider, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { format, addHours, differenceInMinutes, isAfter, addMinutes, isSameDay, isWithinInterval } from 'date-fns';
import { FaPlus, FaEllipsisV, FaEdit, FaPencilAlt, FaTrash } from 'react-icons/fa';
import useUserData from '@/app/hooks/useUserData';
import { collection, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { Event } from '../types';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { sendNotification, viewTags } from '@/app/lib/OneSignalHelpers';

type DailyPlannerSidebarProps = {
    isOpen: boolean;
    selectedDate: Date | null;
    events: Event[];
    onClose: () => void;
    setEvents: (events: Event[]) => void;
};

const DailyPlannerSidebar: React.FC<DailyPlannerSidebarProps> = ({
    isOpen,
    selectedDate,
    events,
    onClose,
    setEvents
}) => {
    const { isOpen: isNewEventOpen, onOpen: onOpenNewEvent, onClose: onCloseNewEvent } = useDisclosure();
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
    const [newEventStartTime, setNewEventStartTime] = useState<Date | null>(null);
    const [newEventEndTime, setNewEventEndTime] = useState<Date | null>(null);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventDescription, setNewEventDescription] = useState('');
    const [isEditEventOpen, setIsEditEventOpen] = useState(false);

    const { user, userData } = useUserData();

    const handleClose = () => {
        onClose();
        // Clear form data
        setNewEventStartTime(null);
        setNewEventEndTime(null);
        setNewEventTitle('');
        setNewEventDescription('');
        setSelectedEvent(null);


    };



    const handleTimeSlotClick = (startTime: Date) => {
        setNewEventStartTime(startTime);
        onOpenNewEvent();
    };

    const handleNewEventSave = async () => {
        if (newEventStartTime && newEventTitle) {
            const newEvent: Event = {
                id: '',
                start: newEventStartTime,
                end: newEventEndTime || addHours(newEventStartTime, 1),
                title: newEventTitle,
                description: newEventDescription,
            };

            // Prevent saving if the event start time is in the past
            if (isAfter(new Date(), newEventStartTime)) {
                // Send an error toast with react-toastify
                return toast.error('Event start time cannot be in the past', {
                    position: 'bottom-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                });
            }

            // Add the event to the events array and save to the Firebase firestore DB
            setEvents([...events, newEvent]);

            // Save the new event to Firestore
            try {
                if (user) {
                    const docRef = await addDoc(collection(db, 'users', user.uid, 'events'), {
                        start: newEvent.start,
                        end: newEvent.end,
                        title: newEvent.title,
                        description: newEvent.description,
                    });
                    newEvent.id = docRef.id;
                } else {
                    console.error("User is not authenticated.");
                }
            } catch (error) {
                console.error("Error adding event to Firestore: ", error);
            }

            const scheduleNotifications = async () => {

                if (userData) {

                    // Fetch the tags for the user
                    const tags = await viewTags(userData.uid);
                    // Find the key value pair of "event_reminders" in the tags object and compare the value to "t"
                    const eventRemindersKey: string = Object.keys(tags).find(key => key.includes('event_reminders')) as string;

                    // If the value is "t" the value of the constant should be true. Else, false
                    const shouldSendNotification = tags[eventRemindersKey] === 't';
                    console.log(shouldSendNotification);
                    if (shouldSendNotification) {

                        const now = new Date();
                        const eventsToSchedule = events.filter(event => {
                            const eventStart = new Date(event.start);
                            return eventStart > now;
                        });

                        if (eventsToSchedule.length > 0) {
                            for (const event of eventsToSchedule) {
                                const eventStart = new Date(event.start);
                                const title = event.title;

                                const timeUntilEvent = eventStart.getTime() - now.getTime();
                                const notifyTime = Math.max(timeUntilEvent - 10 * 60 * 1000, 0);

                                const notificationTime = addMinutes(new Date(), notifyTime / (1000 * 60));

                                await sendNotification("Event Reminder: " + title, "Your event starts in 10 minutes.\nDon't forget to check your calendar!", [userData.uid], notificationTime);
                            }
                        }
                    }
                }
            };

            await scheduleNotifications();

            // Reset the form and close the modal
            setNewEventStartTime(null);
            setNewEventTitle('');
            setNewEventDescription('');
            onCloseNewEvent();
        }
    };

    const handleDeleteEvent = async (eventId: string) => {
        // Remove the event from the local state
        const updatedEvents = events.filter(event => event.id !== eventId);
        setEvents(updatedEvents);

        // Remove the event from Firestore
        try {
            if (user) {
                await deleteDoc(doc(db, 'users', user.uid, 'events', eventId));
            } else {
                console.error("User is not authenticated.");
            }
        } catch (error) {
            console.error("Error deleting event from Firestore: ", error);
        }
    };

    const handleEditEvent = (eventId: string) => {
        // Find the event to edit and set it as selected
        const eventToEdit = events.find(event => event.id === eventId);
        if (eventToEdit) {
            setSelectedEvent(eventToEdit);
            setNewEventStartTime(eventToEdit.start);
            setNewEventEndTime(eventToEdit.end);
            setNewEventTitle(eventToEdit.title);
            setNewEventDescription(eventToEdit?.description || '');
            onOpenNewEvent();
        }
    };

    const handleUpdateEvent = async () => {
        if (selectedEvent && newEventStartTime && newEventTitle) {
            const updatedEvent: Event = {
                ...selectedEvent,
                start: newEventStartTime,
                end: newEventEndTime || addHours(newEventStartTime, 1),
                title: newEventTitle,
                description: newEventDescription,
            };

            // Update the event in the local state
            const updatedEvents = events.map(event => (event.id === selectedEvent.id ? updatedEvent : event));
            setEvents(updatedEvents);

            // Update the event in Firestore
            try {
                if (user) {
                    await updateDoc(doc(db, 'users', user.uid, 'events', selectedEvent.id), {
                        start: updatedEvent.start,
                        end: updatedEvent.end,
                        title: updatedEvent.title,
                        description: updatedEvent.description,
                    });
                } else {
                    console.error("User is not authenticated.");
                }
            } catch (error) {
                console.error("Error updating event in Firestore: ", error);
            }

            // Reset the form and close the modal
            setNewEventStartTime(null);
            setNewEventEndTime(null);
            setNewEventTitle('');
            setNewEventDescription('');
            setSelectedEvent(null);
            onCloseNewEvent();
        }
    };

    const renderTimeGrid = () => {
        const timeSlots: JSX.Element[] = [];

        if (!selectedDate) return timeSlots;

        const startTime = new Date(selectedDate);
        startTime.setHours(0, 0, 0, 0); // Set start time to beginning of the selected day

        const endTime = new Date(selectedDate);
        endTime.setHours(23, 59, 59, 999); // Set end time to end of the selected day

        let currentTime = new Date(startTime);

        while (currentTime <= endTime) {
            const formattedTime = format(currentTime, 'h aa');
            const slotKey = format(currentTime, 'HH:mm');

            const eventsOnDate = events.filter(event => {
                const eventStart = new Date(event.start);
                const eventEnd = new Date(event.end);

                // Normalize event end time to be on the same day as start time
                if (eventEnd < eventStart) {
                    eventEnd.setDate(eventEnd.getDate() + 1);
                }

                // Check if currentTime falls within the adjusted event start and end times
                return currentTime >= eventStart && currentTime < eventEnd && isSameDay(currentTime, eventStart);
            });

            timeSlots.push(
                <div
                    key={formattedTime}
                    className="relative h-14"
                    onMouseEnter={() => setHoveredSlot(slotKey)}
                >
                    <span className="absolute top-1/2 transform -translate-y-1/2 text-sm">{formattedTime}</span>
                    <Divider className='m-0' />
                    {hoveredSlot === slotKey && (
                        <Dropdown placement="top">
                            <DropdownTrigger>
                                <div className="absolute right-0 cursor-pointer text-gray-500 hover:text-gray-700" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                                    <FaEllipsisV />
                                </div>
                            </DropdownTrigger>
                            <DropdownMenu className="bg-white shadow-md rounded-md">
                                <DropdownItem onClick={() => handleTimeSlotClick(new Date(currentTime))} className='flex flex-row'>
                                    <span className='flex flex-row'> Add Event for {formattedTime} <FaPlus className='ml-2 text-primary-brand-600 dark:text-primary-brand-500' /> </span>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    )}
                </div>
            );

            currentTime = addHours(currentTime, 1);
        }

        return timeSlots;
    };



    const renderEventBlocks = () => {
        if (!selectedDate) return null;

        const startTime = new Date(selectedDate);
        startTime.setHours(0, 0, 0, 0); // Set start time to the beginning of the selected day

        const eventBlocks: JSX.Element[] = [];

        const sortedEvents = events
            .filter(event => isSameDay(new Date(event.start), selectedDate))
            .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

        sortedEvents.forEach((event, index) => {
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);

            // Calculate top offset and height
            const startDiff = differenceInMinutes(eventStart, startTime); // Difference from start time in minutes
            const topOffset = (startDiff / 60) * 4; // 4rem per hour

            const duration = differenceInMinutes(eventEnd, eventStart); // Event duration in minutes
            const height = (duration / 60) * 4; // 4rem per hour

            const hasOverlappingEvents = sortedEvents
                .slice(index + 1)
                .some((otherEvent) =>
                    isWithinInterval(eventStart, { start: new Date(otherEvent.start), end: new Date(otherEvent.end) }) ||
                    isWithinInterval(eventEnd, { start: new Date(otherEvent.start), end: new Date(otherEvent.end) })
                );

            const isShortEvent = differenceInMinutes(eventEnd, eventStart) < 60;

            const eventBlockStyles = {
                top: `${topOffset}rem`,
                height: `${height}rem`,
                zIndex: hasOverlappingEvents && !isShortEvent ? 1 : 0,
            };

            const eventBlock = (
                <div
                    key={event.id}
                    className="absolute left-20 right-10 p-2 bg-primary-brand-600 text-white rounded-lg"
                    style={eventBlockStyles}
                >
                    <h3 className="text-sm font-bold">{event.title}</h3>
                    <p className="text-xs">{event.description}</p>
                    <p className="text-xs">{format(eventStart, 'h:mm aa')} - {format(eventEnd, 'h:mm aa')}</p>
                    <Dropdown placement="top">
                        <DropdownTrigger>
                            <div className="absolute right-0 cursor-pointer text-gray-500 hover:text-gray-700" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                                <FaEllipsisV />
                            </div>
                        </DropdownTrigger>
                        <DropdownMenu className="bg-white dark:bg-gray-700 shadow-md rounded-md">
                            <DropdownItem onClick={() => handleEditEvent(event.id)} className='dark:hover:bg-gray-800'>
                                <span className='flex flex-row'> Edit {event.title} <FaPencilAlt className='ml-2 text-primary-brand-600 dark:text-primary-brand-500' /></span>
                            </DropdownItem>
                            <DropdownItem onClick={() => handleDeleteEvent(event.id)} className='dark:hover:bg-gray-800'>
                                <span className='flex flex-row'> Delete {event.title} <FaTrash className='ml-2 text-primary-brand-600 dark:text-primary-brand-500' /></span>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            );

            eventBlocks.push(eventBlock);

            if (hasOverlappingEvents && !isShortEvent) {
                const overlappingEventBlockStyles = {
                    ...eventBlockStyles,
                    top: `${topOffset + height}rem`,
                    height: `calc(${100 - (height / 4)}% - 1rem)`,
                    zIndex: 0,
                };

                const overlappingEventBlock = (
                    <div
                        key={`overlapping-${event.id}`}
                        className="absolute left-20 right-10 p-2 bg-primary-brand-600 text-white rounded-lg"
                        style={overlappingEventBlockStyles}
                    />
                );

                eventBlocks.push(overlappingEventBlock);
            }
        });

        return eventBlocks;
    };


    return (
        <>
            <ToastContainer />
            {/* Events Modal */}
            <Modal isOpen={isOpen} onClose={handleClose} scrollBehavior="inside">
                <ModalContent>
                    <ModalHeader>
                        <h2 className="text-lg font-bold mb-2">Events for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}</h2>
                    </ModalHeader>
                    <ModalBody>
                        <div className="relative space-y-2">
                            {selectedDate && (
                                <>
                                    {renderTimeGrid()}
                                    {renderEventBlocks()}
                                </>
                            )}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" color="default" onClick={handleClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* New Event Modal */}
            {newEventStartTime && (
                <Modal isOpen={isNewEventOpen} onClose={onCloseNewEvent}>
                    <ModalContent>
                        <ModalHeader>
                            <h2 className="text-lg font-bold mb-2 flex justify-center items-center">Add a New Event <FaPlus className='text-primary-brand-700 dark:text-primary-brand-400 ml-2' /></h2>
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                fullWidth
                                label="Title"
                                value={newEventTitle}
                                onChange={(e) => setNewEventTitle(e.target.value)}
                            />
                            <Input
                                fullWidth
                                label="Description"
                                value={newEventDescription}
                                onChange={(e) => setNewEventDescription(e.target.value)}
                            />
                            <Input
                                fullWidth
                                type="time"
                                label="Start Time"
                                value={newEventStartTime ? format(newEventStartTime, 'HH:mm') : ''}
                                onChange={(e) => setNewEventStartTime(new Date(selectedDate!.setHours(parseInt(e.target.value.split(':')[0]), parseInt(e.target.value.split(':')[1]))))}
                            />
                            <Input
                                fullWidth
                                type="time"
                                label="End Time"
                                value={newEventEndTime ? format(newEventEndTime, 'HH:mm') : ''}
                                onChange={(e) => setNewEventEndTime(new Date(selectedDate!.setHours(parseInt(e.target.value.split(':')[0]), parseInt(e.target.value.split(':')[1]))))}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={handleNewEventSave}>
                                Save
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}

            {/* Modal for editing an existing event */}
            {selectedEvent && (
                <Modal isOpen={isEditEventOpen} onClose={handleClose}>
                    <ModalContent>
                        <ModalHeader>
                            <h2 className="text-lg font-bold mb-2 flex justify-center items-center">Edit Event <FaEdit className='text-primary-brand-700 dark:text-primary-brand-400 ml-2' /></h2>
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                fullWidth
                                label="Title"
                                value={newEventTitle}
                                onChange={(e) => setNewEventTitle(e.target.value)}
                            />
                            <Input
                                fullWidth
                                label="Description"
                                value={newEventDescription}
                                onChange={(e) => setNewEventDescription(e.target.value)}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={handleUpdateEvent}>
                                Save
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </>
    );
};

export default DailyPlannerSidebar;
