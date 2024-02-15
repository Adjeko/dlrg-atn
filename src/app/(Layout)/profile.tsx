// 'use server'

import { Fragment, useCallback, useEffect, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { AuthModel } from 'pocketbase';
import Cookies from 'js-cookie';
import { getCurrentUser, getPocketBase } from '@/services/pocketbase';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function Profile() {

  const [user, setUser] = useState<AuthModel>(getCurrentUser());
  const [userImageUrl, setUserImageUrl] = useState<string>(`https://ui-avatars.com/api/?name=Unknown?background=random`)

  const getUserData = useCallback(async () => {
    setUserImageUrl(`https://ui-avatars.com/api/?name=${user?.name}?background=random`)
  }, [])

  const userNavigation = [
    // { name: 'Your Profile', href: '#', onClick: ()=>{}},
    { name: 'Abmelden', href: '', onClick: (e: any) => { signOut() } },
  ]
  function signOut() {
    const pb = getPocketBase();

    if (pb.authStore.isValid) {
      pb.authStore.clear()
      Cookies.remove("pb_auth", { secure: false, domain: '.dlrgtrack.de' })
    }
  }

  useEffect( () => {
    const pb = getPocketBase()

    if(pb.authStore.isValid && user?.email != pb.authStore.model?.email){
      setUser(getCurrentUser())
    }
  }, [user])

  useEffect(() => {
    getUserData()
  }, [user])

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
                <p className='block px-4 py-2 text-sm text-gray-700'>{user?.name}</p>
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