import { Popover } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

interface MenuButtonProps {
  open: boolean
}

export default function MenuButton({open,} : MenuButtonProps) {

  return (
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
  );
}

