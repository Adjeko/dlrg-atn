'use client'

import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { PlusIcon as PlusIconOutline } from '@heroicons/react/24/outline'
import React, { Fragment, useRef, useState, } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Link from "next/link"
import { createCourse } from '@/services/pocketbase'

export default function Organizer() {

  const [open, setOpen] = useState(false)
	const cancelButtonRef = useRef(null)
  var events: any

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
		// const organizer = e.target[1].value as string
		// const email = e.target[2].value as string
		const points = parseInt(e.target[1].value) as number

		await createCourse({
      name: courseName,
      organizer: '',
      points: points
    })
		closeDialog();
	}

  return (
    <>
      {/* Heading */}
      <div className="pb-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 leading-36">Deine Veranstaltungen</h3>
      </div>

      {/* Fortbildungsliste */}
      <div className="overflow-hidden bg-white shadow sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {events?.map((position : any) => (
            <li key={position.id}>
              <Link href={`/course/${position.id}`} className="block hover:bg-gray-50">
                <div className="flex items-center px-4 py-4 sm:px-6">
                  <div className="flex-1 min-w-0 sm:flex sm:items-center sm:justify-between">
                    <div className="truncate">
                      <div className="flex text-sm">
                        <p className="font-medium text-indigo-600 truncate">{position.title}</p>
                        {/* <p className="flex-shrink-0 ml-1 font-normal text-gray-500">in {position.department}</p> */}
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
                                    <div className="mt-1">
                                      <input
                                        id="points"
                                        name="points"
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