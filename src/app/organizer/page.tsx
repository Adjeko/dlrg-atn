'use client'

import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { PlusIcon as PlusIconOutline } from '@heroicons/react/24/outline'
import React, { Fragment, useEffect, useRef, useState, } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Link from "next/link"
import { createCourse, getOrganizerCourses } from '@/services/pocketbase'
import { RecordModel } from 'pocketbase'

const categories: any = {
  Seminar: "inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700",
  Web: "inline-flex items-center rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700",
  Workshop: "inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800",
}

export default function Organizer() {

  const [open, setOpen] = useState(false)
	const cancelButtonRef = useRef(null)
  const [courses, setCourses] = useState<RecordModel[]>()
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now()))
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now()))

  function closeDialog() {
		setOpen(false);
	}
	function openDialog() {
		setOpen(true);
	}
	function onDialogCancel() {
		closeDialog();
	}

	async function onDialogSave(e: any) {
		e.preventDefault();

    const courseName = e.target[0].value as string
    const category = e.target[1].value as string
    const isLongRunning = e.target[2].value as boolean
		// const organizer = e.target[1].value as string
		// const email = e.target[2].value as string
		const pointsInH = parseInt(e.target[3].value) as number
    const pointsInLE = parseInt(e.target[4].value) as number
    const startDate = e.target[5].value as Date
    const endDate = e.target[6].value as Date
    const description = e.target[7].value as string

    let points = 0

    if(pointsInH) {
      points = Math.round(pointsInH * (4/3))
    }
    if(pointsInLE) {
      points = pointsInLE
    }

		await createCourse({
      name: courseName,
      points: points,
      startDate: startDate,
      endDate: endDate,
      description: description,
      category: category,
      isLongRunning: isLongRunning,
    })
		closeDialog();
	}

  useEffect(() => {
    (async () => {
      const courses = await getOrganizerCourses()
      setCourses(courses)
    })();    
  }, [])

  return (
    <>
      {/* Heading */}
      <div className="pb-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 leading-36">Deine Veranstaltungen</h3>
      </div>

      {/* Fortbildungsliste */}
      <div className="overflow-hidden bg-white shadow sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {courses?.map((course) => (
            <li key={course.id}>
              <Link href={`/course/${course.id}`} className="block hover:bg-gray-50">
                <div className="flex items-center px-4 py-4 sm:px-6">
                  <div className="flex-1 min-w-0 sm:flex sm:items-center sm:justify-between">
                    <div className="truncate">
                      <div className="flex text-sm">
                        <p className="font-medium text-indigo-600 truncate">{course.name}</p>
                        <p className="flex-shrink-0 ml-1 font-bold text-gray-500 px-3"> {course.points} LE</p>
                        <p className={categories[course.category]}> {course.category}</p>
                      </div>
                      {/* Datumse */}
                      {/* <div className="flex mt-2">
												<div className="flex items-center text-sm text-gray-500">
													<CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
													<p>
														Closing on <time dateTime={position.closeDate}>{position.closeDateFull}</time>
													</p>
												</div>
											</div> */}
                    </div>
                    {/* Teilnehmer */}
                    {/* <div className="flex-shrink-0 mt-4 sm:mt-0 sm:ml-5">
											<div className="flex -space-x-1 overflow-hidden">
												{position.applicants.map((applicant) => (
													<img
														key={applicant.email}
														className="inline-block w-6 h-6 rounded-full ring-2 ring-white"
														src={applicant.imageUrl}
														alt={applicant.name}
													/>
												))}
											</div>
										</div> */}
                  </div>
                  <div className="flex-shrink-0 ml-5">
                    <ChevronRightIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Floating Button */}
      <button
        type="button"
        className="fixed inline-flex items-center p-3 text-white bg-indigo-600 border border-transparent rounded-full shadow-sm bottom-6 right-6 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={openDialog}
      >
        <PlusIconOutline className="w-8 h-8" aria-hidden="true" />
      </button>

      {/* Course Add Dialog */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative w-full px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Neuer Kurs
                      </Dialog.Title>
                      <div className="mt-2">
                        {/* Neuen Kurs anlegen Dialog */}
                        <>
                          <form className="space-y-8 divide-y divide-gray-200" onSubmit={onDialogSave}>
                            <div className="space-y-8 divide-y divide-gray-200">
                              <div className="pt-8">
                                <div className="grid grid-cols-1 mt-6 gap-y-6 gap-x-4 sm:grid-cols-4">
                                  <div className="sm:col-span-4">
                                    <label htmlFor="coursename" className="block text-sm font-medium text-gray-700">
                                      Kursname
                                    </label>
                                    <div className="mt-1">
                                      <input
                                        id="coursename"
                                        name="Kursname"
                                        type="text"
                                        className="block w-full py-2 pl-3 bg-gray-200 border-gray-400 rounded-md shadow-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      />
                                    </div>
                                  </div>
                                  <div className="sm:col-span-4">
                                    <label htmlFor="coursename" className="block text-sm font-medium text-gray-700">
                                      Kategorie
                                    </label>
                                    <div className="mt-1">
                                      <select
                                        name="Kategorie" 
                                        id="category" 
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 bg-gray-200 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                        <option value="Seminar">Seminar</option>
                                        <option value="Web">Web</option>
                                        <option value="Workshop">Workshop</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="sm:col-span-4 flex items-start space-x-5">
                                    <label htmlFor="coursename" className="flex text-sm font-medium text-gray-700">
                                      Laufender Termin?
                                    </label>
                                    <div className="flex">
                                      <input
                                        name="isLongRunning" 
                                        id="isLongRunning"
                                        type='checkbox' 
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600">
                                      </input>
                                    </div>
                                  </div>
                                  {/* <div className="sm:col-span-4">
                                    <label htmlFor="organizer" className="block text-sm font-medium text-gray-700">
                                      Veranstalter
                                    </label>
                                    <div className="mt-1">
                                      <input
                                        id="organizer"
                                        name="organizer"
                                        type="text"
                                        className="block w-full py-2 pl-3 bg-gray-200 border-gray-400 rounded-md shadow-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      />
                                    </div>
                                  </div>
                                  <div className="sm:col-span-4">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                      Email
                                    </label>
                                    <div className="mt-1">
                                      <input
                                        id="email"
                                        name="email"
                                        type="text"
                                        className="block w-full py-2 pl-3 bg-gray-200 border-gray-400 rounded-md shadow-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      />
                                    </div>
                                  </div> */}
                                  <div className="sm:col-span-4">
                                    <label htmlFor="points" className="block text-sm font-medium text-gray-700">
                                      Lerneinheiten
                                    </label>
                                    <div className="flex justify-between mt-1 px-12">
                                      <input
                                        id="pointsInH"
                                        name="pointsInH"
                                        type="text"
                                        placeholder="in Stunden"
                                        className="w-auto py-2 pl-3 bg-gray-200 border-gray-400 rounded-md shadow-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      />
                                      <input
                                        id="pointsInLE"
                                        name="pointsInLE"
                                        type="text"
                                        placeholder="in LE"
                                        className="w-auto py-2 pl-3 bg-gray-200 border-gray-400 rounded-md shadow-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      />
                                    </div>
                                  </div>
                                  <div className="sm:col-span-4">
                                    <label htmlFor="points" className="block text-sm font-medium text-gray-700">
                                      Datum
                                    </label>
                                    <div className='flex justify-between mt-1 px-12'>
                                      <input
                                        id="startDate"
                                        name="startDate"
                                        type="date"
                                        className="block w-auto py-2 pl-3 bg-gray-200 border-gray-400 rounded-md shadow-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        defaultValue={startDate.toISOString().substring(0,10)}
                                        onChange={(e) => {setEndDate(e.target.valueAsDate!)}}
                                      />
                                      <p className='pt-1' >bis</p>
                                      <input
                                        id="endDate"
                                        name="endDate"
                                        type="date"
                                        defaultValue={endDate.toISOString().substring(0,10)}
                                        value={endDate.toISOString().substring(0,10)}
                                        className="block w-auto py-2 pl-3 bg-gray-200 border-gray-400 rounded-md shadow-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        onChange={(e) => {setEndDate(e.target.valueAsDate!)}}
                                      />
                                    </div>
                                  </div>
                                  <div className="sm:col-span-4">
                                    <label htmlFor="points" className="block text-sm font-medium text-gray-700">
                                      Beschreibung
                                    </label>
                                    <div className="mt-1">
                                      <input
                                        id="description"
                                        name="description"
                                        type="text"
                                        className="block w-full py-2 pl-3 bg-gray-200 border-gray-400 rounded-md shadow-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="pt-5">
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  onClick={onDialogCancel}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </form>
                        </>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}