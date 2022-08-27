import AppShell from "../components/appshell"
import { PlusIcon as PlusIconOutline } from '@heroicons/react/24/outline'
import React, { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { PaperClipIcon } from '@heroicons/react/20/solid'
import QRCode from "react-qr-code";

const people = [
	{
		name: 'Calvin Hawkins',
		email: 'calvin.hawkins@example.com',
		image:
			'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
	},
	{
		name: 'Kristen Ramos',
		email: 'kristen.ramos@example.com',
		image:
			'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
	},
	{
		name: 'Ted Fox',
		email: 'ted.fox@example.com',
		image:
			'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
	},
]

const Course = () => {
	const [open, setOpen] = useState(false)
	const cancelButtonRef = useRef(null)

	function closeDialog() {
		setOpen(false);
	}
	function openDialog() {
		setOpen(true);
	}

	return (
		<AppShell>

			{/* Kursbeschreibung */}
			<>
				<div>
					<h3 className="text-2xl font-medium leading-6 text-gray-900">Sanitätskurs A</h3>
				</div>
				<div className="mt-5 border-t border-gray-200">
					<dl className="divide-y divide-gray-200">
						<div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
							<dt className="text-sm font-medium text-gray-500">Kursname</dt>
							<dd className="flex mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
								<span className="flex-grow">Sanitätskurs A</span>
								<span className="flex-shrink-0 ml-4">
									<button
										type="button"
										className="font-medium text-indigo-600 bg-white rounded-md hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									>
										Update
									</button>
								</span>
							</dd>
						</div>
						<div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
							<dt className="text-sm font-medium text-gray-500">Veranstalter</dt>
							<dd className="flex mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
								<span className="flex-grow">Timo Imhof</span>
								<span className="flex-shrink-0 ml-4">
									<button
										type="button"
										className="font-medium text-indigo-600 bg-white rounded-md hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									>
										Update
									</button>
								</span>
							</dd>
						</div>
						<div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
							<dt className="text-sm font-medium text-gray-500">Email Addresse</dt>
							<dd className="flex mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
								<span className="flex-grow">timo.imhof@dlrg.de</span>
								<span className="flex-shrink-0 ml-4">
									<button
										type="button"
										className="font-medium text-indigo-600 bg-white rounded-md hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									>
										Update
									</button>
								</span>
							</dd>
						</div>
						<div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
							<dt className="text-sm font-medium text-gray-500">Datum</dt>
							<dd className="flex mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
								<span className="flex-grow"> 01.01.1970 </span>
								<span className="flex-shrink-0 ml-4">
									<button
										type="button"
										className="font-medium text-indigo-600 bg-white rounded-md hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									>
										Update
									</button>
								</span>
							</dd>
						</div>
						<div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
							<dt className="text-sm font-medium text-gray-500">Beschreibung</dt>
							<dd className="flex mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
								<span className="flex-grow">
									Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur
									qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure
									nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu.
								</span>
								<span className="flex-shrink-0 ml-4">
									<button
										type="button"
										className="font-medium text-indigo-600 bg-white rounded-md hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									>
										Update
									</button>
								</span>
							</dd>
						</div>
					</dl>
				</div>
			</>


			{/* Teilnehmer Section Heading */}
			<div className="pb-5 mt-6 mb-3 border-b border-gray-200">
				<h3 className="text-lg font-medium leading-6 text-gray-900">Teilnehmer</h3>
			</div>


			{/* TeilnehmerListe */}
			<ul role="list" className="divide-y divide-gray-200">
				{people.map((person) => (
					<li key={person.email} className="flex py-4">
						<img className="w-10 h-10 rounded-full" src={person.image} alt="" />
						<div className="ml-3">
							<p className="text-sm font-medium text-gray-900">{person.name}</p>
							<p className="text-sm text-gray-500">{person.email}</p>
						</div>
					</li>
				))}
			</ul>

			{/* Floating Button */}
			<button
				type="button"
				className="fixed inline-flex items-center p-3 text-white bg-indigo-600 border border-transparent rounded-full shadow-sm bottom-6 right-6 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				onClick={openDialog}
			>
				<PlusIconOutline className="w-8 h-8" aria-hidden="true" />
			</button>

			{/* QR Code Dialog */}
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
												Präsentiere den QR-Code
											</Dialog.Title>
											<div className="flex justify-center mt-2">
												{/* QR-Code */}
												<>
													<QRCode value="hey" />
												</>
											</div>
										</div>
									</div>
									<div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
										<button
											type="button"
											className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
											onClick={() => setOpen(false)}
										>
											Teile QR-Code
										</button>
										<button
											type="button"
											className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
											onClick={() => setOpen(false)}
											ref={cancelButtonRef}
										>
											Cancel
										</button>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>

		</AppShell>
	)
}

export default Course