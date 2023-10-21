import { createSubCourse, getSubCourses } from "@/services/pocketbase";
import { RecordModel } from "pocketbase";
import { useEffect, useState } from "react";
import { PlusCircleIcon as PlusCircleIcon } from '@heroicons/react/24/outline'

export default function CourseList({ courseId }: { courseId: string }) {

  const [subCoursesList, setSubCoursesList] = useState<RecordModel[]>();

  useEffect(() => {
    (async () => {
      const subCoursesList = await getSubCourses(courseId)
      setSubCoursesList(subCoursesList)
    })();
  }, [])

  function createSub(){
    createSubCourse(courseId)
  }

  return (<>
    {/* Kurse Section Heading */}
    < div className="flex pb-5 mt-6 mb-3 border-b border-gray-200" >
      <h3 className="text-lg font-medium leading-6 text-gray-900">Kurse</h3>
      <button className="ml-4 w-6" onClick={createSub}>
        <PlusCircleIcon/>
      </button>
    </div >

    {/* KursListe */}
    < ul role="list" className="divide-y divide-gray-200" >
      {subCoursesList?.map((course) => (
        <li key={course.id} className="flex py-4">
          <div className="ml-3">
            <a href={`${course.id}`} className="font-medium text-gray-900">
              {course.name}
            </a>
            <p className="text-sm text-gray-500">{`${new Date(course.startDate).getDate()}.${new Date(course.startDate).getMonth()}.${new Date(course.startDate).getFullYear()}`} </p>
          </div>
        </li>
      ))
      }
    </ul >

  </>
  );
}