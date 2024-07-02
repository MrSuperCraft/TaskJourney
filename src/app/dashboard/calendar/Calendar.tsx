'use client';

import React, { useEffect, useState } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameDay,
    isSameMonth,
    addMonths,
    subMonths,
    isWithinInterval,
    subHours
} from 'date-fns';
import { Button, useDisclosure, Tooltip } from '@nextui-org/react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import DailyPlannerSidebar from './DailyPlannerSidebar';
import useUserData from '@/app/hooks/useUserData';
import EventTooltip from './EventToolTip';

type Event = {
    id: string;
    start: Date;
    end: Date;
    title: string;
    description?: string;
};

const Calendar = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [newTitle, setNewTitle] = useState<string>('');
    const [newDescription, setNewDescription] = useState('');
    const [newStartHour, setNewStartHour] = useState('');
    const [newEndHour, setNewEndHour] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, userData } = useUserData();

    const uid = user?.uid;

    useEffect(() => {
        const fetchEvents = async () => {
            if (uid && userData) {
                const fetchedEvents = userData.events;

                if (fetchedEvents) {
                    setEvents(fetchedEvents);
                }
            }
        };

        fetchEvents();
    }, [uid, userData]); // Depend on both uid and userData

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setSelectedEvent(null);
        onOpen();
    };

    const handleEventClick = (event: Event, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedEvent(event);
        setNewTitle(event.title);
        setNewDescription(event.description || '');
        setNewStartHour(format(event.start, 'HH:mm'));
        setNewEndHour(format(event.end, 'HH:mm'));
        onOpen();
    };


    const handleUpdateEvent = () => {
        if (selectedEvent && newTitle && newStartHour && newEndHour) {
            const start = new Date(selectedEvent.start);
            start.setHours(parseInt(newStartHour.split(':')[0]), parseInt(newStartHour.split(':')[1]));

            const end = new Date(selectedEvent.end);
            end.setHours(parseInt(newEndHour.split(':')[0]), parseInt(newEndHour.split(':')[1]));

            // Prevent updating if the new start time is in the past
            if (start < new Date()) {
                // Optionally, you can show a message to the user or handle this case as needed
                return;
            }

            setEvents(events.map(e => e.id === selectedEvent.id ? { ...e, title: newTitle, description: newDescription, start, end } : e));
            resetModal();
            onClose();
        }
    };


    const handleDeleteEvent = () => {
        if (selectedEvent) {
            setEvents(events.filter(e => e.id !== selectedEvent.id));
            resetModal();
            onClose();
        }
    };

    const handleMonthChange = (direction: 'prev' | 'next') => {
        setCurrentMonth(direction === 'prev' ? subMonths(currentMonth, 1) : addMonths(currentMonth, 1));
    };

    const resetModal = () => {
        setSelectedDate(null);
        setSelectedEvent(null);
        setNewTitle('');
        setNewDescription('');
        setNewStartHour('');
        setNewEndHour('');
    };

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    // Ensure calendar grid always has 5 rows and 7 columns
    const maxCells = 35; // 5 rows * 7 columns
    const daysToRender = calendarDays.slice(0, maxCells);

    return (
        <>
            <div className="max-w-full lg:max-w-[62%] p-4 lg:mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <Button
                        color="primary"
                        isIconOnly
                        onClick={() => handleMonthChange('prev')}
                        className="px-4 py-2 bg-black rounded dark:bg-slate-600 dark:hover:bg-slate-700"
                    >
                        <FaArrowLeft className="w-5 h-5" />
                    </Button>
                    <h2 className="text-xl font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
                    <Button
                        color="primary"
                        isIconOnly
                        onClick={() => handleMonthChange('next')}
                        className="px-4 py-2 bg-black rounded dark:bg-slate-600 dark:hover:bg-slate-700"
                    >
                        <FaArrowRight className="w-5 h-5" />
                    </Button>
                </div>
                <div className="grid grid-cols-7 grid-rows-5 gap-2 md:gap-5 lg:gap-x-2 lg:gap-y-1">
                    {daysToRender.map(day => {
                        // Filter events for the current day
                        const eventsForDay = events.filter(event => isSameDay(event.start, day));

                        // Determine the status of events for tooltip and dot color
                        let dotColor = '';
                        let tooltipContent = null;

                        if (eventsForDay.length > 0) {
                            const now = new Date();
                            const activeEvents = eventsForDay.filter(event => isWithinInterval(now, { start: event.start, end: event.end }));
                            const upcomingEvents = eventsForDay.filter(event => event.start > now);
                            const recentEndedEvents = eventsForDay.filter(event => isWithinInterval(now, { start: subHours(event.end, 3), end: event.end }) && event.end < now);
                            const endedEvents = eventsForDay.filter(event => event.end < now);

                            // Build tooltip content component
                            tooltipContent = (
                                <EventTooltip
                                    activeCount={activeEvents.length}
                                    upcomingCount={upcomingEvents.length}
                                    recentEndedCount={recentEndedEvents.length}
                                    endedCount={endedEvents.length}
                                />
                            );

                            // Determine dot color based on the most critical event status
                            if (activeEvents.length > 0) {
                                dotColor = 'bg-green-500'; // Green dot for active events
                            } else if (recentEndedEvents.length > 0) {
                                dotColor = 'bg-orange-500'; // Orange dot for recently ended events
                            } else {
                                dotColor = 'bg-blue-500'; // Blue dot for upcoming events
                            }
                        }

                        return (
                            <div
                                key={day.toString()}
                                className={`relative flex items-center justify-center border rounded-md aspect-square cursor-pointer ${isSameDay(day, new Date()) ? 'bg-blue-200 dark:bg-primary-brand-700' : ''} ${!isSameMonth(day, currentMonth) ? 'bg-gray-100 dark:bg-gray-900 text-gray-400' : ''} shadow-sm`}
                                onClick={() => handleDateClick(day)}
                            >
                                <div className='font-semibold text-lg'>{format(day, 'd')}</div>
                                {eventsForDay.length > 0 && (
                                    <Tooltip content={tooltipContent} placement='top'>
                                        <div className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full ${dotColor}`}></div>
                                    </Tooltip>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <DailyPlannerSidebar
                isOpen={isOpen}
                selectedDate={selectedDate}
                events={events}
                onClose={onClose}
                setEvents={setEvents}
            />
        </>
    );
};

export default Calendar;
