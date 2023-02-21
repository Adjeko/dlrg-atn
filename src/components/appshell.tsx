import { Fragment } from 'react'
import { Menu, Popover, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useSession, signOut, signIn } from "next-auth/react"
import * as Sentry from "@sentry/nextjs";

const navigation = [
  { name: 'Teilnehmer', href: '/', current: true },
  { name: 'Veranstalter', href: '/organizer', current: false },
]
const userNavigation = [
  // { name: 'Your Profile', href: '#', onClick: ()=>{}},
  { name: 'Einstellungen', href: '#', onClick: () => null },
  { name: 'Anmelden', href: '', onClick: (e : any) => { signIn() } },
]
//TODO type anlegen
function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

//TODO type anlegen
const AppShell = (props: any) => {

  const session = useSession();
  console.log(session)
  const userImageUrl = `https://ui-avatars.com/api/?name=${session.data?.user?.name}?background=random`

  if (session.status == 'authenticated' && session.data) {
    const newNavigation = { name: 'Abmelden', href: '', onClick: (e : any) => { 
      Sentry.captureMessage("Signing OUT");
      e.preventDefault();
      signOut() } 
    };
    userNavigation[userNavigation.length - 1] = newNavigation;
  }

  if(session.status === 'loading'){
    return <></>
  }

  if(session.status === 'unauthenticated'){
    signIn()
    return <></>
  }

  return (
    <>
      <div className="min-h-full">
        <Popover as="header" className="pb-24 bg-[#FF222B]">
          {({ open }) => (
            <>
              <div className="max-w-3xl px-4 mx-auto sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="relative flex items-center justify-center py-5 lg:justify-between">
                  {/* Logo */}
                  <div className="absolute left-0 flex-shrink-0 lg:static">
                    <a href="#">
                      <span className="sr-only">Workflow</span>
                      <img
                        className="w-auto h-8"
                        src="https://asset.brandfetch.io/id1kbwnF66/id90RqLdal.svg?updated=1635891151637"
                        alt="Workflow"
                      />
                    </a>
                  </div>

                  {/* Right section on desktop */}
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
                        <Menu.Items className="absolute z-40 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg -right-2 ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            <p className='block px-4 py-2 text-sm text-gray-700'>{session.data?.user?.name}</p>
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

                  {/* Search für die mobile Groeße */}
                  <div className="flex-1 min-w-0 px-12 lg:hidden">
                    {/* TODO: nicht auf invisible Setzen, sondern vernünftig spacen */}
                    <div className="invisible w-full max-w-xs mx-auto">
                      <label htmlFor="desktop-search" className="sr-only">
                        SearchDESKTOP
                      </label>
                      <div className="relative text-white focus-within:text-gray-600">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <MagnifyingGlassIcon className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <input
                          id="desktop-search"
                          className="block w-full py-2 pl-10 pr-3 leading-5 text-gray-900 placeholder-white bg-white border border-transparent rounded-md bg-opacity-20 focus:outline-none focus:bg-opacity-100 focus:border-transparent focus:placeholder-gray-500 focus:ring-0 sm:text-sm"
                          placeholder="Search"
                          type="search"
                          name="search"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Menu button */}
                  <div className="absolute right-0 flex-shrink-0 lg:hidden">
                    {/* Mobile menu button */}
                    <Popover.Button className="inline-flex items-center justify-center p-2 text-indigo-200 bg-transparent rounded-md hover:text-white hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block w-6 h-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block w-6 h-6" aria-hidden="true" />
                      )}
                    </Popover.Button>
                  </div>
                </div>
                <div className="hidden py-5 border-t border-white lg:block border-opacity-20">
                  <div className="grid items-center grid-cols-3 gap-8">
                    <div className="col-span-2">
                      <nav className="flex space-x-4">
                        {navigation.map((item) => {
                          return (<a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current ? 'text-white' : 'text-indigo-100',
                              'text-sm font-medium rounded-md bg-white bg-opacity-0 px-3 py-2 hover:bg-opacity-10'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                          >
                            {item.name}
                          </a>)
                        })}
                      </nav>
                    </div>
                    <div>
                      {/* <div className="w-full max-w-md mx-auto">
                        <label htmlFor="mobile-search" className="sr-only">
                          SearchMOBILE
                        </label>
                        <div className="relative text-white focus-within:text-gray-600">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <MagnifyingGlassIcon className="w-5 h-5" aria-hidden="true" />
                          </div>
                          <input
                            id="mobile-search"
                            className="block w-full py-2 pl-10 pr-3 leading-5 text-gray-900 placeholder-white bg-white border border-transparent rounded-md bg-opacity-20 focus:outline-none focus:bg-opacity-100 focus:border-transparent focus:placeholder-gray-500 focus:ring-0 sm:text-sm"
                            placeholder="Search"
                            type="search"
                            name="search"
                          />
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>

              {/* HamburgerMenu im mobile Modus */}
              <Transition.Root as={Fragment}>
                <div className="lg:hidden">
                  <Transition.Child
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="duration-150 ease-in"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Popover.Overlay className="fixed inset-0 z-20 bg-black bg-opacity-25" />
                  </Transition.Child>

                  <Transition.Child
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="duration-150 ease-in"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Popover.Panel
                      focus
                      className="absolute inset-x-0 top-0 z-30 w-full max-w-3xl p-2 mx-auto transition origin-top transform"
                    >
                      <div className="bg-white divide-y divide-gray-200 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
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
                              <div className="text-base font-medium text-gray-800 truncate">{session.data?.user?.name}</div>
                              <div className="text-sm font-medium text-gray-500 truncate">{session.data?.user?.email}</div>
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
                    </Popover.Panel>
                  </Transition.Child>
                </div>
              </Transition.Root>
            </>
          )}
        </Popover>
        <main className="pb-8 -mt-24">
          <div className="max-w-3xl px-4 mx-auto sm:px-6 lg:max-w-7xl lg:px-8">
            <h1 className="sr-only">Page title</h1>
            {/* Main 3 column grid */}
            <div className="grid items-start grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
              {/* Left column */}
              <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                <section aria-labelledby="section-1-title">
                  <h2 className="sr-only" id="section-1-title">
                    Section title
                  </h2>
                  <div className="overflow-hidden bg-white rounded-lg shadow">
                    {/* CONTENT */}
                    <div className="p-6">{props.children}</div>
                  </div>
                </section>
              </div>

              {/* Right column */}
              {/* <div className="grid grid-cols-1 gap-4">
                <section aria-labelledby="section-2-title">
                  <h2 className="sr-only" id="section-2-title">
                    Section title
                  </h2>
                  <div className="overflow-hidden bg-white rounded-lg shadow">
                    <div className="p-6"> YOUR CONTENT HERE </div>
                  </div>
                </section>
              </div> */}
            </div>
          </div>
        </main>
        <footer>
          <div className="max-w-3xl px-4 mx-auto sm:px-6 lg:px-8 lg:max-w-7xl">
            <div className="py-8 text-sm text-center text-gray-500 border-t border-gray-200 sm:text-left">
              <span className="block sm:inline"></span>{' '}
              <span className="block sm:inline"></span>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default AppShell
