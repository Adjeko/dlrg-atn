import React, { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { QrScanner as QrCodeScanner } from '@yudiel/react-qr-scanner';
import { PlusIcon as PlusIconOutline } from '@heroicons/react/24/outline'
import QrScanner from 'qr-scanner';
import { registerUserAsCourseMember } from '@/services/pocketbase';

export default function qrCodeReader() {
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const cancelButtonRef = useRef(null)

  const camerRef = useRef<HTMLVideoElement>(null);
  const Scanner = useRef<QrScanner>();

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
  }
  function closeDialog2() {
    setOpen2(false);
  }

  function onQRScannerResult(result: any) {
    console.log(result)
    if (!!result) {
      registerUserAsCourseMember(result);
      closeDialog();
    }
  }

  function onCameraPermissions() {
    // requestMediaPermissions({ audio: false, video: true })
    //   .then(() => { console.log("Camera granted"); Sentry.captureMessage("Camera granted"); })
    //   .catch((err: MediaPermissionsError) => { console.log("Camera Permission Error") });
  }
  return (
    <>

      <button
        type="button"
        className="fixed inline-flex items-center p-3 text-white bg-yellow-500 border border-transparent rounded-full shadow-sm bottom-6 right-6 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={openDialog2}
      >
        <PlusIconOutline className="w-8 h-8" aria-hidden="true" />
      </button>


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
                            onDecode={(result: any) => {
                              console.log(result);
                              onQRScannerResult(result);
                              closeDialog2();
                            }}
                            onError={(error: any) => console.log(error?.message)}
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

    </>
  );
}