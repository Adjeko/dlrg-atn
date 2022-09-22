import AppShell from "../components/appshell"
import { CalendarIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { PlusIcon as PlusIconOutline } from '@heroicons/react/24/outline'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Link from "next/link"
import { useDLRGStore } from "../src/useDLRGStore"
import { Models } from "appwrite"


const positions = [
	{
		id: 1,
		title: 'Back End Developer',
		department: 'Engineering',
		closeDate: '2020-01-07',
		closeDateFull: 'January 7, 2020',
		applicants: [
			{
				name: 'Dries Vincent',
				email: 'dries.vincent@example.com',
				imageUrl:
					'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
			},
			{
				name: 'Lindsay Walton',
				email: 'lindsay.walton@example.com',
				imageUrl:
					'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
			},
			{
				name: 'Courtney Henry',
				email: 'courtney.henry@example.com',
				imageUrl:
					'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
			},
			{
				name: 'Tom Cook',
				email: 'tom.cook@example.com',
				imageUrl:
					'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
			},
		],
	},
	{
		id: 2,
		title: 'Front End Developer',
		department: 'Engineering',
		closeDate: '2020-01-07',
		closeDateFull: 'January 7, 2020',
		applicants: [
			{
				name: 'Whitney Francis',
				email: 'whitney.francis@example.com',
				imageUrl:
					'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
			},
			{
				name: 'Leonard Krasner',
				email: 'leonard.krasner@example.com',
				imageUrl:
					'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
			},
			{
				name: 'Floyd Miles',
				email: 'floy.dmiles@example.com',
				imageUrl:
					'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
			},
		],
	},
	{
		id: 3,
		title: 'User Interface Designer',
		department: 'Design',
		closeDate: '2020-01-14',
		closeDateFull: 'January 14, 2020',
		applicants: [
			{
				name: 'Emily Selman',
				email: 'emily.selman@example.com',
				imageUrl:
					'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
			},
			{
				name: 'Kristin Watson',
				email: 'kristin.watson@example.com',
				imageUrl:
					'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
			},
			{
				name: 'Emma Dorsey',
				email: 'emma.dorsey@example.com',
				imageUrl:
					'https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
			},
		],
	},
]

const Organizer = () => {
	const [open, setOpen] = useState(false)
	const cancelButtonRef = useRef(null)

	const appwriteDatabase = useDLRGStore((state) => state.appDatabase);
	const [events, SetEvents] = useState<Models.Document[]>();

	const [addEventTitle, SetAddEventTitle] = useState("");

	function closeDialog() {
		setOpen(false);
	}
	function openDialog() {
		setOpen(true);
	}

	function onDialogCancel() {
		closeDialog();
	}

	function onDialogSave(e) {
		e.preventDefault();
		const promise = appwriteDatabase.createDocument('632c679ca801b391db60', "unique()", {title: addEventTitle})

		closeDialog();
	}

	useEffect(() => {
		const promise = appwriteDatabase.listDocuments('632c679ca801b391db60');
		promise.then(response => {
			if(response.total > 0) {
				SetEvents(response.documents);
			}
		}, error => {
			alert(error);
		});
	},[appwriteDatabase]);


	return (
		<AppShell>
			{/* Heading */}
			<div className="pb-5 border-b border-gray-200">
				<h3 className="text-lg font-medium text-gray-900 leading-36">Deine Veranstaltungen</h3>
			</div>

			{/* Fortbildungsliste */}
			<div className="overflow-hidden bg-white shadow sm:rounded-md">
				<ul role="list" className="divide-y divide-gray-200">
					{events?.map((position) => (
						<li key={position.id}>
							<Link href="/course" className="block hover:bg-gray-50">
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
													<form className="space-y-8 divide-y divide-gray-200">
														<div className="space-y-8 divide-y divide-gray-200">
															<div className="pt-8">
																<div className="grid grid-cols-1 mt-6 gap-y-6 gap-x-4 sm:grid-cols-6">
																	<div className="sm:col-span-4">
																		<label htmlFor="email" className="block text-sm font-medium text-gray-700">
																			Kursname
																		</label>
																		<div className="mt-1">
																			<input
																				id="email"
																				name="email"
																				type="text"
																				autoComplete="off"
																				className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
																				onChange={(e) => SetAddEventTitle(e.target.value)}
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
																	onClick={onDialogSave}
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


		</AppShell>
	)
}

export default Organizer