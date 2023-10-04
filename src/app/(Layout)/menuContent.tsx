import { Popover } from '@headlessui/react'
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function MenuContent() {

  const navigation = [
    { name: 'Teilnehmer', href: '/', current: true },
    { name: 'Veranstalter', href: '/organizer', current: false },
  ]
  const userNavigation = [
    // { name: 'Your Profile', href: '#', onClick: ()=>{}},
    { name: 'Anmelden', href: '', onClick: (e: any) => { signIn() } },
  ]
  const userImageUrl = `https://ui-avatars.com/api/?name=Herbert Pietrzyk?background=random`
  function signIn() {

  }

  return (
    <div className="bg-white divide-y divide-gray-200 rounded-lg shadow-lg ring-black ring-opacity-5">
      <div className="pt-3 pb-2">
        <div className="flex items-center justify-between px-4">
          <div>
            <img
              className="w-auto h-8"
              src="https://asset.brandfetch.io/id1kbwnF66/id90RqLdal.svg?updated=1635891151637"
              alt="Workflow"
            />
          </div>
          <div className="-mr-2">
            <Popover.Button className="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="w-6 h-6" aria-hidden="true" />
            </Popover.Button>
          </div>
        </div>
        <div className="px-2 mt-3 space-y-1">
          {navigation.map((item) => (
            <a
              key={item.name + "hamburger"}
              href={item.href}
              className={classNames("block px-3 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-100 hover:text-gray-800"
              )}
              aria-current={item.current ? 'page' : undefined}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
      <div className="pt-4 pb-2">
        <div className="flex items-center px-5">
          <div className="flex-shrink-0">
            <img className="w-10 h-10 rounded-full" src={userImageUrl} alt="" />
          </div>
          <div className="flex-1 min-w-0 ml-3">
            <div className="text-base font-medium text-gray-800 truncate">Herbert Pietrzyk</div>
            <div className="text-sm font-medium text-gray-500 truncate">Herbert@Pietrzyk.com</div>
          </div>
          <button
            type="button"
            className="flex-shrink-0 p-1 ml-auto text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
        <div className="px-2 mt-3 space-y-1">
          {userNavigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block px-3 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-100 hover:text-gray-800"
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}