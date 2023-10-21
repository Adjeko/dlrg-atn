'use client'

import { PlusIcon as PlusIconOutline } from '@heroicons/react/24/outline'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import QRCode from "react-qr-code";
import { getCourse, getMembersOfCourse } from '@/services/pocketbase';
import { RecordModel } from 'pocketbase';
import AttendeeList from './(Page)/AttendeeList';
import CourseList from './(Page)/CourseList';
import QRCodeDialog from './(Page)/QRCodeDialog';

const categories: any = {
    Seminar: "inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700",
    Web: "inline-flex items-center rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700",
    Workshop: "inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800",
}

export default function Course(
    { params }: {
        params: { pid: string }
    }) {

    const [open, setOpen] = useState(false);
    const cancelButtonRef = useRef(null);

    const [event, setEvent] = useState({id: '', name: '', points: 0, description: "", startDate: new Date, endDate: new Date, category: "", isLongRunning: false});

    

    useEffect(() => {
        (async () => {
            const event = await getCourse(params.pid)
            setEvent({ id: event.id, name: event.name, points: event.points, description: event.description, startDate: new Date(event.startDate), endDate: new Date(event.endDate), category: event.category, isLongRunning: event.isLongRunning })
        })();
    }, [])

    return (
        <>
            {/* Kursbeschreibung */}
            <>
                <div className="flex">
                    <h3 className="text-2xl font-medium leading-6 text-gray-900">{event.name}</h3>
                    <h2 className="text-2xl font-bold leading-6 text-violet-500 pl-4">{event.points} LE</h2>
                </div>
                <div className='pt-2'>
                    <span className={categories[event.category]}>{event.category}</span>
                </div>
                <div className="mt-5 border-t border-gray-200">
                    <dl className="divide-y divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                            <dt className="text-sm font-medium text-gray-500">Kursname</dt>
                            <dd className="flex mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <span className="flex-grow">{event.name}</span>
                                <span className="flex-shrink-0 ml-4">
                                    {/* <button
										type="button"
										className="font-medium text-indigo-600 bg-white rounded-md hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									>
										Update
									</button> */}
                                </span>
                            </dd>
                        </div>
                        <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
                            <dt className="text-sm font-medium text-gray-500">Veranstalter</dt>
                            <dd className="flex mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {/* <span className="flex-grow">{event.organizer}</span> */}
                                <span className="flex-shrink-0 ml-4">
                                    {/* <button
										type="button"
										className="font-medium text-indigo-600 bg-white rounded-md hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									>
										Update
									</button> */}
                                </span>
                            </dd>
                        </div>
                        <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
                            <dt className="text-sm font-medium text-gray-500">Email Addresse</dt>
                            <dd className="flex mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {/* <span className="flex-grow">{event.contact}</span> */}
                                <span className="flex-shrink-0 ml-4">
                                    {/* <button
										type="button"
										className="font-medium text-indigo-600 bg-white rounded-md hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									>
										Update
									</button> */}
                                </span>
                            </dd>
                        </div>
                        <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
                            <dt className="text-sm font-medium text-gray-500">Datum</dt>
                            <dd className="flex mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <span className="flex-grow">{
                                    (event.startDate?.getTime() === event.endDate?.getTime() || isNaN(event.endDate?.getFullYear())) 
                                    ? `${event.startDate?.getDate()}.${event.startDate?.getMonth()}.${event.startDate?.getFullYear()}` 
                                    : `${event.startDate?.getDate()}.${event.startDate?.getMonth()}.${event.startDate?.getFullYear()} - ${event.endDate?.getDate()}.${event.endDate?.getMonth()}.${event.endDate?.getFullYear()}`
                                }</span>
                                <span className="flex-shrink-0 ml-4">
                                    {/* <button
										type="button"
										className="font-medium text-indigo-600 bg-white rounded-md hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									>
										Update
									</button> */}
                                </span>
                            </dd>
                        </div>
                        <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
                            <dt className="text-sm font-medium text-gray-500">Beschreibung</dt>
                            <dd className="flex mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <span className="flex-grow">
                                    {event.description}
                                </span>
                                <span className="flex-shrink-0 ml-4">
                                    {/* <button
										type="button"
										className="font-medium text-indigo-600 bg-white rounded-md hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									>
										Update
									</button> */}
                                </span>
                            </dd>
                        </div>
                    </dl>
                </div>
            </>
            
            {event.isLongRunning
                ? <CourseList courseId={params.pid}/>
                : <AttendeeList courseId={params.pid}/>}

            <QRCodeDialog courseId={event.id}/>                
        </>
    )
}