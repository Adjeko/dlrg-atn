import React, { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ChatBubbleBottomCenterTextIcon as ChatBubbleBottomCenterTextIconOutline } from '@heroicons/react/24/outline'
import { createFeedback } from '@/services/pocketbase'


export default function FeedbackButton() {

  const [open, setOpen] = useState(false)

  function openDialog() {
    setOpen(true);
  }
  function closeDialog() {
    setOpen(false);
  }

  function onDialogSave(e: any) {
    e.preventDefault();
    const text = e.target[0].value as string;

    createFeedback(text);
    closeDialog();
  }

  return (
    <>
      <button
        type="button"
        className="fixed inline-flex items-center p-3 text-white bg-indigo-500 border border-transparent rounded-full shadow-sm bottom-6 left-6 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={openDialog}
      >
        <ChatBubbleBottomCenterTextIconOutline className="w-8 h-8" aria-hidden="true" />
      </button>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
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
                        Gib Feedback zu dieser DLRG App ab!
                      </Dialog.Title>
                      <div className="mt-2">
                      <form className="space-y-8 divide-y divide-gray-200" onSubmit={onDialogSave}>
                            <div className="space-y-8 divide-y divide-gray-200">
                              <div className="pt-8">
                                <div className="grid grid-cols-1 mt-6 gap-y-6 gap-x-4 sm:grid-cols-4">
                                  <div className="sm:col-span-4">
                                    <label htmlFor="coursename" className="block text-sm font-medium text-gray-700">
                                      Feedback
                                    </label>
                                    
                                    <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                                      <label htmlFor="comment" className="sr-only">Your comment</label>
                                      <textarea id="comment" rows={4} className="block w-full py-2 pl-3 bg-gray-200 border-gray-400 rounded-md shadow-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Schreibe einen Kommentar" required></textarea>
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
                                  onClick={closeDialog}
                                >
                                  Abbrechen
                                </button>
                                <button
                                  type="submit"
                                  className="inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  Absenden
                                </button>
                              </div>
                            </div>
                          </form>
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

