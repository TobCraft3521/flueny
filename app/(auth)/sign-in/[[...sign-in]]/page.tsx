import { SignIn } from "@clerk/nextjs"
import "./style.css"

export default function Page() {
  return (
    <div className="flex flex-1 justify-center items-center h-full bgcontainer">
      <SignIn />
    </div>
  )
}
