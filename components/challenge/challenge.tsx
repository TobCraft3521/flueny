"use client"

import { ClientTask } from "@/app/challenge/page"
import Task from "./task"
import { Loader2 } from "lucide-react"

interface ChallengeBodyProps {
  activeTaskIndex: number
  tasks: ClientTask[]
  isLoading: boolean
}
const ChallengeBody = ({ tasks, isLoading }: ChallengeBodyProps) => {
  return (
    <div className="flex w-full flex-1 items-center justify-center">
      <div className="max-w-[1024px] flex-1">
        {isLoading ? (
          <div className="flex h-[50vh] items-center justify-center">
            <Loader2 size={48} className="animate-spin text-zinc-600" />
          </div>
        ) : (
          <div>
            {tasks.map((task, index) => (
              <Task task={task} key={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChallengeBody
