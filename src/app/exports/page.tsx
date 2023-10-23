'use client'

import { getPDFAsData } from "@/services/exports"

const statuses: any = {
  Complete: 'text-green-700 bg-green-50 ring-green-600/20',
  'In progress': 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Archived: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
  New: 'text-purple-800 bg-purple-50 ring-purple-600/20',
}
const projects = [
  {
    id: 1,
    name: 'Download 2023 Report',
    status: 'New',
    description: 'Erstellt dir deine Fortbildungen aus 2023 als Liste in einem PDF',
    action: (<></>)//downloadPDFButton()
  },
  {
    id: 2,
    name: 'Send Email',
    status: 'In progress',
    description: 'Sende eine Email an irgendwen',
    // action: (<a href="mailto:john@demosite.com?subject=Test%20email&cc=test@gmail.com&body=This is <b>my</b> body text">Hallo</a>)
    action: (<button onClick={async () => {
      navigator.share({text: "Hallo Welt", title: "Sharing oder was ?", files: [new File([await getPDFAsData()], "test.pdf", {type: (await getPDFAsData()).type})]})
    }}>Mail senden</button>)
  },
]

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function Exports() {

  return (
    <main className="">
      <ul role="list" className="divide-y divide-gray-100">
        {projects.map((project) => (
          <li key={project.id} className="flex items-center justify-between gap-x-6 py-5">
            <div className="min-w-0">
              <div className="flex items-start gap-x-3">
                <p className="text-sm font-semibold leading-6 text-gray-900">{project.name}</p>
                <p
                  className={classNames(
                    statuses[project.status],
                    'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset'
                  )}
                >
                  {project.status}
                </p>
              </div>
              <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                <p className="whitespace-nowrap">
                  {project.description}
                </p>
              </div>
            </div>
            <div className="flex flex-none items-center gap-x-4">
              {project.action}
            </div>
          </li>
        ))}
      </ul>

    </main>
  )
}