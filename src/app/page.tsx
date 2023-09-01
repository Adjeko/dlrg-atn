'use client'

import Stats from './(Page)/stats';
import QrCodeReader from './(Page)/qrCodeReader';
import Timeline from './(Page)/timeline';

export default function Home() {

  return (
    <main className="">
      <div>
        <Stats/>
        <Timeline/>
      </div>

      <QrCodeReader/>
    </main>
  )
}
