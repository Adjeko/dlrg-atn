
export default function Timeline() {

  return (
    <>
      {/* Timeline Section Header */}
      <div className="pb-5 mt-10 mb-6 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Timeline</h3>
      </div>

      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {timeline?.events.map((event: any) => (
            <li key={event.id}>
              <div className="relative pb-8">
                {/* {eventIdx !== timeline.length - 1 ? (
          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
        ) : null} */}
                <div className="relative flex space-x-3">
                  <div>
                    {/* <span
              className={classNames(
                event.iconBackground,
                'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white'
              )}
            >
            </span> */}
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        {"Beigetreten: "}{' '}
                        <a href={`course/${event.id}`} className="font-medium text-gray-900">
                          {event.title}
                        </a>
                      </p>
                    </div>
                    <div className="text-sm text-right text-gray-500 whitespace-nowrap">
                      {/* <time dateTime={event.date?.toDateString()}>{event.date?.toString()}</time> */}
                      <p>{`${event.points} LE`}</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

