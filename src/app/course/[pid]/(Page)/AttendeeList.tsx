import { getMembersOfCourse } from "@/services/pocketbase";
import { RecordModel } from "pocketbase";
import { useEffect, useState } from "react";


export default function AttendeeList({courseId} : {courseId: string}) {

  const [members, setMembers] = useState<RecordModel[]>();

  useEffect(() => {
    (async () => {
      const memberList = await getMembersOfCourse(courseId)
      setMembers(memberList)
    })();    
  }, [])

  return (<>
    {/* Teilnehmer Section Heading */}
    < div className="pb-5 mt-6 mb-3 border-b border-gray-200" >
      <h3 className="text-lg font-medium leading-6 text-gray-900">Teilnehmer</h3>
    </div >

    {/* TeilnehmerListe */}
    < ul role="list" className="divide-y divide-gray-200" >
      {members?.map((person) => (
        <li key={person.id} className="flex py-4">
          <img className="w-10 h-10 rounded-full" src={`https://ui-avatars.com/api/?name=${person.expand?.user.name}?background=random`} alt="" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{person.expand?.user.name}</p>
            <p className="text-sm text-gray-500">{person.expand?.user.email}</p>
          </div>
        </li>
      ))
      }
    </ul >

  </>
  );
}