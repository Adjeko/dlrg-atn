'use client'
import { PlusIcon as PlusIconOutline } from '@heroicons/react/24/outline'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import QRCode from "react-qr-code";
import ReactPDF, { Document, Page, Text, View, StyleSheet, PDFViewer, PDFDownloadLink, pdf, Image } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import QRCode2 from "qrcode";
import { getCourse } from '@/services/pocketbase';
import { RecordModel } from 'pocketbase';

// The 'theme' object is your Tailwind theme config
const tw = createTw({

});

export default function QRCodeDialog({ courseId }: { courseId: string }) {

  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);

  const [qrCode, setQrCode] = useState("");
  const [course, setCourse] = useState<RecordModel>();

  function closeDialog() {
    setOpen(false);
  }
  function openDialog() {
    setOpen(true);
  }

  useEffect(() => {
    (async () => {
      if(courseId){
      const qr = await QRCode2.toDataURL(courseId)
        setQrCode(qr)
      }
  
      const course = await getCourse(courseId)
      setCourse(course)
    })();    
  }, [courseId])

  function QrCodePdf() {
    return (

      <Document>
        <Page size="A4" style={tw("p-12")}>
          <View style={tw("p-20 bg-gray-100")}>
            <Image src={qrCode} />
            <Text style={tw("text-3xl")}>{`${course?.name}`}</Text>
            <Text> {`${new Date(course?.startDate).getDate()}.${new Date(course?.startDate).getMonth()}.${new Date(course?.startDate).getFullYear()}`}</Text>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <>
      < Transition.Root show={open} as={Fragment}>
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
                          <QRCode value={courseId} />
                        </>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    {/* <button
                      type="button"
                      className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                      onClick={() => {

                        setOpen(false)
                      }}
                    >
                      Teile den QR-Code
                    </button> */}
                    <div className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm">
                      <PDFDownloadLink document={<QrCodePdf />} fileName={`${course?.name}.pdf`}>
                        {({ blob, url, loading, error }) => (loading ? 'Lade das Dokument...' : 'Als PDF herunterladen!')}
                      </PDFDownloadLink>
                    </div>
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
      </Transition.Root >

      {/* Floating Button */}
      <button
        type="button"
        className="fixed inline-flex items-center p-3 text-white bg-indigo-600 border border-transparent rounded-full shadow-sm bottom-6 right-6 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={openDialog}
      >
        <PlusIconOutline className="w-8 h-8" aria-hidden="true" />
      </button>
    </>
  );
}