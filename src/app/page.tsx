'use client'

import Stats from './(Page)/stats';
import QrCodeReader from './(Page)/qrCodeReader';

export default function Home() {

  return (
    <main className="">
      <div>
        <Stats/>
        {/* <Timeline/> */}
      </div>

      <QrCodeReader/>
    </main>
  )
}
