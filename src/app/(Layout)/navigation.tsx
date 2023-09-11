

//TODO type anlegen
function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function Navigation() {

  const navigation = [
    { name: 'Teilnehmer', href: '/', current: true },
    { name: 'Veranstalter', href: '/organizer', current: false },
    { name: 'Exports', href: '/exports', current: false },
  ]

  return (
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
      </div>
    </div>
  );
}