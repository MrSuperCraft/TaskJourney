import React from 'react'
import TaskManagerPage from './TaskManagerPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Task Manager',
    description: 'Your task manager, used to handle tasks with ease.',
    keywords: 'task manager, task, tasks, task manager app, task manager app, task manager website, task manager web app',
    robots: {
        index: false,
        follow: false
    }
}


const page = () => {
    return (
        <TaskManagerPage />
    )
}

export default page