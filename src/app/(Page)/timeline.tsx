import { getCourseListOfUser } from "@/services/pocketbase";
import { RecordModel } from "pocketbase";
import { useEffect, useState } from "react";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

const categories: any = {
  Seminar: "inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700",
  Web: "inline-flex items-center rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700",
  Workshop: "inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800",
}

export default function Timeline() {

  const [eventList, setEventList] = useState<RecordModel[]>();

  useEffect(() => {
    (async () => {
      const list = await getCourseListOfUser();
      setEventList(list)
    })();
  }, [])

  return (
    <>
      {/* Timeline Section Header */}
      <div className="pb-5 mt-10 mb-6 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Timeline</h3>
      </div>

      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {eventList?.map((event: any) => (
            <li key={event.id}>
              <div className="relative pb-8">

                <div className="relative flex space-x-3">
                  {/* <div>
                    <span
                      className={classNames(
                        event.iconBackground,
                        'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white'
                      )}
                    >
                    </span>
                  </div> */}
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <span className={categories[event.expand.course.category]}>{event.expand.course.category}</span>
                      <a href={`course/${event.expand.course.id}`} className="font-medium text-gray-900 px-2">
                        {event.expand.course.name}
                      </a>
                    </div>
                    <div className="text-l font-bold text-right text-violet-500 whitespace-nowrap">
                      {/* <time dateTime={event.date?.toDateString()}>{event.date?.toString()}</time> */}
                      <p>{`${event.expand.course.points} LE`}</p>
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

