import AppShell from "../components/appshell"
import type { NextPage } from 'next'
// import { CheckIcon, HandThumbUpIcon, UserIcon } from '@heroicons/react/20/solid'
import { PlusIcon as PlusIconOutline } from '@heroicons/react/24/outline'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { trpc } from '../utils/trpc'
import QrScanner from 'qr-scanner';
import {QrScanner as QrCodeScanner} from '@yudiel/react-qr-scanner';
import {
  MediaPermissionsError,
  requestMediaPermissions
} from 'mic-check';
import * as Sentry from "@sentry/nextjs";
import { getServerAuthSession } from "../server/common/get-server-auth-session"

export async function getServerSideProps( {req, res} : any){
  return {
    props:{
      // session: await getServerAuthSession({req, res})
    }
  }
}

const Home: NextPage = () => {
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const cancelButtonRef = useRef(null)

  const camerRef = useRef<HTMLVideoElement>(null);
  const Scanner = useRef<QrScanner>();

  const timelineQuery = trpc.index.getTimeline.useQuery();
  const timeline = timelineQuery.data;

  const joinEventMutation = trpc.index.joinEvent.useMutation();

  // const [mediaDevicesSupported, setMediaDevicesSupported] = useState(false);
  // const [getUserMediaSupported, setGetUserMediaSupported] = useState(false);

  // useEffect(() => {
  //   if('mediaDevices' in navigator){
  //     setMediaDevicesSupported(true);
  //   }
  //   if('getUserMedia' in navigator.mediaDevices){
  //     setGetUserMediaSupported(true);
  //   }
  // }, []);

  function closeDialog() {
      if (Scanner.current != null) {
        Scanner.current.stop()
      }
    setOpen(false);
  }

  function openDialog() {
    setOpen(true);
    setTimeout(() => {
      if (camerRef.current != null) {
        Scanner.current = new QrScanner(camerRef.current, (result: any) => onQRScannerResult(result), {
          // onDecodeError: (error) => { console.log(error) },
          // returnDetailedScanResult: true,
          // maxScansPerSecond: 2,
          preferredCamera: 'environment',
          highlightScanRegion: true,
          highlightCodeOutline: true
        })

        Scanner.current.start()
      }
    }, 100)
  }

  function openDialog2() {
    setOpen2(true);
    setTimeout(() => {
      if (camerRef.current != null) {
        Scanner.current = new QrScanner(camerRef.current, (result: any) => onQRScannerResult(result), {
          // onDecodeError: (error) => { console.log(error) },
          // returnDetailedScanResult: true,
          // maxScansPerSecond: 2,
          preferredCamera: 'environment',
          highlightScanRegion: true,
          highlightCodeOutline: true
        })

        Scanner.current.start()
      }
    }, 100)
  }

  function closeDialog2() {
    
  setOpen2(false);
}

  function onQRScannerResult(result : any) {
    
    if (!!result) {
      joinEventMutation.mutate({eventId: result?.data})
      closeDialog();
    }
  }

  function onCameraPermissions() {
    requestMediaPermissions({ audio: false, video: true })
      .then(() => { console.log("Camera granted"); Sentry.captureMessage("Camera granted"); })
      .catch((err: MediaPermissionsError) => { console.log("Camera Permission Error") });
  }

  return (
    <AppShell>
      <div>
        {/* <button className="bg-gray-200" onClick={onCameraPermissions}> Camera Permissions </button>
        <div>Media: {mediaDevicesSupported ? '✅' : '❌'}</div>
        <div>UserMedia: {getUserMediaSupported ? '✅' : '❌'}</div> */}
        {/* Statistiken */}
        <dl className="grid grid-cols-1 overflow-hidden bg-white divide-y divide-gray-200 rounded-lg shadow md:grid-cols-2 md:divide-y-0 md:divide-x">

          <div key={"Fortbildungen"} className="px-4 py-5 sm:p-6">
            <dt className="text-base font-normal text-gray-900">Fortbildungen</dt>
            <dd className="flex items-baseline justify-between mt-1 md:block lg:flex">
              <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                {timeline?.events.length}
              </div>
            </dd>
          </div>
          <div key={"Fortbildungsstunden"} className="px-4 py-5 sm:p-6">
            <dt className="text-base font-normal text-gray-900">Fortbildungsstunden</dt>
            <dd className="flex items-baseline justify-between mt-1 md:block lg:flex">
              <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                {timeline?.events.reduce((r, c) => {
                  r.points = r.points + c.points
                  return r
                }, {points: 0}).points}
                <span className="ml-2 text-sm font-medium text-gray-500">von 20</span>
              </div>
            </dd>
          </div>
        </dl>

        {/* Timeline Section Header */}
        <div className="pb-5 mt-10 mb-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Timeline</h3>
        </div>

        {/* Timeline */}
        <div className="flow-root">
          <ul role="list" className="-mb-8">
            {timeline?.events.map((event) => (
              <li key={event.id}>
                <div className="relative pb-8">
                  {/* {eventIdx !== timeline.length - 1 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                  ) : null} */}
                  <div className="relative flex space-x-3">
                    <div>
                      {/* <span
                        className={classNames(
                          event.iconBackground,
                          'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white'
                        )}
                      >
                      </span> */}
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          {"Beigetreten: "}{' '}
                          <a href={`course/${event.id}`} className="font-medium text-gray-900">
                            {event.title}
                          </a>
                        </p>
                      </div>
                      <div className="text-sm text-right text-gray-500 whitespace-nowrap">
                        {/* <time dateTime={event.date?.toDateString()}>{event.date?.toString()}</time> */}
                        <p>{`${event.points} LE`}</p>
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
      {/* <button
        type="button"
        className="fixed inline-flex items-center p-3 text-white bg-indigo-600 border border-transparent rounded-full shadow-sm bottom-6 right-6 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={openDialog}
      >
        <PlusIconOutline className="w-8 h-8" aria-hidden="true" />
      </button> */}

      {/* Floating Button */}
      {/* <button
        type="button"
        className="fixed inline-flex items-center p-3 text-white bg-green-500 border border-transparent rounded-full shadow-sm bottom-6 right-44 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={onCameraPermissions}
      >
        <PlusIconOutline className="w-8 h-8" aria-hidden="true" />
      </button> */}

      {/* Floating Button */}
      <button
        type="button"
        className="fixed inline-flex items-center p-3 text-white bg-yellow-500 border border-transparent rounded-full shadow-sm bottom-6 right-6 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={openDialog2}
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
                          <video ref={camerRef} className="w-full h-full"></video>
                        </>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="button"
                      className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                      onClick={() => closeDialog()}
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

      {/* QR Code Dialog */}
      <Transition.Root show={open2} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen2}>
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
                        Scanne den QR-Code 2
                      </Dialog.Title>
                      <div className="mt-2">
                        {/* QR-Code Scanner */}
                        <>
                          <QrCodeScanner
                            onDecode={(result) => console.log(result)}
                            onError={(error) => console.log(error?.message)}
                          />
                        </>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="button"
                      className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                      onClick={() => closeDialog2()}
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
