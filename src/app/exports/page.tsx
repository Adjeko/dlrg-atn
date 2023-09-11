'use client'

const statuses = {
  Complete: 'text-green-700 bg-green-50 ring-green-600/20',
  'In progress': 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Archived: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
}
const projects = [
  {
    id: 1,
    name: 'GraphQL API',
    href: '#',
    status: 'Complete',
    description: 'GraphQL and stuff',
  },
  {
    id: 2,
    name: 'New benefits plan',
    href: '#',
    status: 'In progress',
    description: 'Benefits and stuff',
  },
  {
    id: 3,
    name: 'Onboarding emails',
    href: '#',
    status: 'In progress',
    description: 'Onboarding and stuff',
  },
  {
    id: 4,
    name: 'iOS app',
    href: '#',
    status: 'In progress',
    description: 'IOS and stuff',
  },
  {
    id: 5,
    name: 'Marketing site redesign',
    href: '#',
    status: 'Archived',
    description: 'Marketing and stuff',
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
              <a
                href={project.href}
                className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
              >
                View project<span className="sr-only">, {project.name}</span>
              </a>
            </div>
          </li>
        ))}
      </ul>

    </main>
  )
}