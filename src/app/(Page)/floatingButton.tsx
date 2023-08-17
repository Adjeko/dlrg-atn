

import { PlusIcon as PlusIconOutline } from '@heroicons/react/24/outline'

export default function FloatingButton() {

  function openDialog2() {
    // setOpen2(true);
  }

  return (
    <button
      type="button"
      className="fixed inline-flex items-center p-3 text-white bg-yellow-500 border border-transparent rounded-full shadow-sm bottom-6 right-6 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      onClick={openDialog2}
    >
      <PlusIconOutline className="w-8 h-8" aria-hidden="true" />
    </button>
  );
}