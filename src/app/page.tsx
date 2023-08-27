'use client'

import React, { useRef, useState } from 'react'
import QrScanner from 'qr-scanner';

import Timeline from './(Page)/timeline';
import FloatingButton from './(Page)/floatingButton';
import Stats from './(Page)/stats';
import QrCodeReader from './(Page)/qrCodeReader';


export default function Home() {
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



  function closeDialog2() {

    setOpen2(false);
  }

  function onQRScannerResult(result: any) {
    console.log(result)
    if (!!result) {
      // joinEventMutation.mutate({ eventId: result })
      closeDialog();
    }
  }

  function onCameraPermissions() {
    // requestMediaPermissions({ audio: false, video: true })
    //   .then(() => { console.log("Camera granted"); Sentry.captureMessage("Camera granted"); })
    //   .catch((err: MediaPermissionsError) => { console.log("Camera Permission Error") });
  }


  return (
    <main className="">
      <div>
        <Stats/>
        {/* <Timeline/> */}
      </div>

      <FloatingButton/>

      <QrCodeReader/>
    </main>
  )
}
