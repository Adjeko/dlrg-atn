import { getUser } from "@/services/pocketbase";
import { AuthModel, RecordModel } from "pocketbase";
import { useCallback, useEffect, useState } from "react";


//TODO type anlegen
function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function Navigation() {

  const [user, setUser] = useState<RecordModel>()

  const getUserData = useCallback(async () => {
    const user = await getUser()
    setUser(user)
  }, [])

  useEffect(() => {
    getUserData()
  }, [getUserData])

  const navigation = [
    { name: 'Teilnehmer', href: '/', current: true, roles: ['attendee', 'organizer', 'admin'] },
    { name: 'Veranstalter', href: '/organizer', current: false, roles: ['organizer', 'admin'] },
    { name: 'Exports', href: '/exports', current: false, roles: ['attendee', 'organizer', 'admin']},
  ]

  return (
    <div className="hidden py-5 border-t border-white lg:block border-opacity-20">
      <div className="grid items-center grid-cols-3 gap-8">
        <div className="col-span-2">
          <nav className="flex space-x-4">
            {navigation.map((item) => {
              
              if(item.roles.includes(user?.role)){
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
              }              
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}