import AppShell from "../components/appshell"
import type { NextPage } from 'next'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'
// import { CheckIcon, HandThumbUpIcon, UserIcon } from '@heroicons/react/20/solid'
import { PlusIcon as PlusIconOutline } from '@heroicons/react/24/outline'
import React, { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { QrReader } from 'react-qr-reader'
import { trpc } from '../utils/trpc'
import { useSession, signIn, signOut } from "next-auth/react"

//TODO type anlegen
function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

const Home: NextPage = () => {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState('');
  const cancelButtonRef = useRef(null)

  const {data: session} = useSession();
  let authButton;
  if (session) {
    authButton =
      <>
        Signed in as {session.user.email} <br />
        UserID: {session.user.id} <br/>
        <button onClick={() => signOut()}>Sign out</button>
      </>
  } else {
    authButton =
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  }




  const statsQuery = trpc.index.getStats.useQuery();
  const stats = statsQuery.data ?? [];

  const timelineQuery = trpc.index.getTimeline.useQuery();
  const timeline = timelineQuery.data ?? [];

  function closeDialog() {
    setOpen(false);
  }
  function openDialog() {
    setOpen(true);
  }
  function onQRReaderResult(result : any, error : any) {
    if (!!result) {
      setData(result?.getText());

      closeDialog();
    }

    if (!!error) {
      setData(error.message);
    }
  }

  return (
    <AppShell>
      {authButton}

      <div>
        {/* Statistiken */}
        <dl className="grid grid-cols-1 overflow-hidden bg-white divide-y divide-gray-200 rounded-lg shadow md:grid-cols-2 md:divide-y-0 md:divide-x">
          {stats.map((item) => (
            <div key={item.name} className="px-4 py-5 sm:p-6">
              <dt className="text-base font-normal text-gray-900">{item.name}</dt>
              <dd className="flex items-baseline justify-between mt-1 md:block lg:flex">
                <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                  {item.stat}
                  <span className="ml-2 text-sm font-medium text-gray-500">from {item.previousStat}</span>
                </div>

                <div
                  className={classNames(
                    item.changeType === 'increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                    'inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium md:mt-2 lg:mt-0'
                  )}
                >
                  {item.changeType === 'increase' ? (
                    <ArrowUpIcon
                      className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-green-500"
                      aria-hidden="true"
                    />
                  ) : (
                    <ArrowDownIcon
                      className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-red-500"
                      aria-hidden="true"
                    />
                  )}

                  <span className="sr-only">{item.changeType === 'increase' ? 'Increased' : 'Decreased'} by</span>
                  {item.change}
                </div>
              </dd>
            </div>
          ))}
        </dl>

        {/* Timeline Section Header */}
        <div className="pb-5 mt-10 mb-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Timeline</h3>
        </div>

        {/* Timeline */}
        <div className="flow-root">
          <ul role="list" className="-mb-8">
            {timeline.map((event, eventIdx) => (
              <li key={event.id}>
                <div className="relative pb-8">
                  {eventIdx !== timeline.length - 1 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span
                        className={classNames(
                          event.iconBackground,
                          'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white'
                        )}
                      >
                        {/* <event.icon className="w-5 h-5 text-white" aria-hidden="true" /> */}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          {event.content}{' '}
                          <a href={event.href} className="font-medium text-gray-900">
                            {event.target}
                          </a>
                        </p>
                      </div>
                      <div className="text-sm text-right text-gray-500 whitespace-nowrap">
                        <time dateTime={event.datetime}>{event.date}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>

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
                        Scanne den QR-Code
                      </Dialog.Title>
                      <div className="mt-2">
                        {/* QR-Code Scanner */}
                        <>
                          <QrReader
                            onResult={(result, error) => {
                              onQRReaderResult(result, error);
                            }}
                            className="w-full h-full"
                            constraints={{ facingMode: 'environment' }}
                          />
                          <p>{data}</p>
                        </>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
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

export default Home
