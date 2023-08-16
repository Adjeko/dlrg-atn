// 'use server'

import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function Profile() {

  const userNavigation = [
    // { name: 'Your Profile', href: '#', onClick: ()=>{}},
    { name: 'Einstellungen', href: '#', onClick: () => null },
    { name: 'Anmelden', href: '', onClick: (e: any) => { signIn() } },
  ]
  function signIn() {

  }
  const userImageUrl = `https://ui-avatars.com/api/?name=Herbert Pietrzyk?background=random`

  return (
    <>
      <div className="hidden lg:ml-4 lg:flex lg:items-center lg:pr-0.5">
        {/* Profile dropdown */}
        <Menu as="div" className="relative flex-shrink-0 ml-4">
          <div>
            <Menu.Button className="flex text-sm bg-white rounded-full ring-2 ring-white ring-opacity-20 focus:outline-none focus:ring-opacity-100">
              <span className="sr-only">Open user menu</span>
              <img className="w-8 h-8 rounded-full" src={userImageUrl} alt="" />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute z-40 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg -right-2 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                <p className='block px-4 py-2 text-sm text-gray-700'>Herbert Pietrzyk</p>
              </Menu.Item>
              {userNavigation.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <a
                      href={item.href}
                      className={classNames(
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700'
                      )}
                      onClick={(e) => item.onClick(e)}
                    >
                      {item.name}
                    </a>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </>
  );
}