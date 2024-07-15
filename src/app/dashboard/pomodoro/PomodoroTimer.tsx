'use client';

import React, { useState, useEffect, Key } from 'react';
import { Button, Card, CircularProgress, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';

const PomodoroTimer: React.FC = () => {
    const [time, setTime] = useState<number>(1500); // 25 minutes
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isBreak, setIsBreak] = useState<boolean>(false);
    const [sessionType, setSessionType] = useState<string>('25|5'); // Default session type

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime - 1);
            }, 1000);
        } else if (!isActive && time !== 0) {
            clearInterval(interval!);
        }

        if (time === 0) {
            clearInterval(interval!);
            if (!isBreak) {
                setIsBreak(true);
                setTime(parseInt(sessionType.split('|')[1]) * 60); // Break time
                setIsActive(false);
            } else {
                setIsBreak(false);
                setTime(parseInt(sessionType.split('|')[0]) * 60); // Work time
                setIsActive(false);
            }
        }

        return () => clearInterval(interval!);
    }, [isActive, time, isBreak, sessionType]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainderSeconds = seconds % 60;
        return `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    };

    return (
        <Card className="p-4 mb-4">
            <h3 className="text-xl font-bold">{isBreak ? 'Break Time' : 'Work Time'}</h3>
            <div style={{ position: 'relative', width: 300, height: 300, margin: '0 auto' }}>
                <CircularProgress
                    value={isBreak ? (time / (parseInt(sessionType.split('|')[1]) * 60)) * 100 : (time / (parseInt(sessionType.split('|')[0]) * 60)) * 100}
                    color={isBreak ? 'primary' : 'danger'}
                    classNames={{
                        base: 'w-56 h-56 flex justify-center items-center mx-auto',
                        indicator: 'w-56 h-56',
                        track: 'w-56 h-56',
                        svg: 'w-56 h-56',
                        value: 'w-56 h-56',
                        label: 'w-56 h-56',
                    }}
                />
                <div style={{
                    position: 'absolute',
                    top: '40%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '2rem',
                    fontWeight: 'bold'
                }}>
                    {formatTime(time)}
                </div>
            </div>
            <div className="mt-4">
                <Button variant='faded' onPress={() => setIsActive(!isActive)}>
                    {isActive ? 'Pause' : 'Start'}
                </Button>
                <Button variant='flat' onPress={() => setTime(isBreak ? parseInt(sessionType.split('|')[1]) * 60 : parseInt(sessionType.split('|')[0]) * 60)} className="ml-4">
                    Reset
                </Button>
            </div>
            <div className="mt-4">
                <Dropdown>
                    <DropdownTrigger>
                        <Button variant="flat">Select Session</Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="Single selection actions"
                        color="primary"
                        selectionMode="single"
                        onSelectionChange={(key) => {
                            const selectedKey = Array.from(key as Set<Key>)[0] as string;
                            setSessionType(selectedKey);
                            setIsBreak(false);
                            setTime(parseInt(selectedKey.split('|')[0]) * 60);
                        }}
                    >
                        <DropdownItem key="25|5">25 min work / 5 min break</DropdownItem>
                        <DropdownItem key="50|10">50 min work / 10 min break</DropdownItem>
                        <DropdownItem key="90|20">90 min work / 20 min break</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </Card>
    );
};

export default PomodoroTimer;
