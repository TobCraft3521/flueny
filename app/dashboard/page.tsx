import LanguageCard from "@/components/global/language-card"
import { initProfile } from "@/lib/profiles"
import { auth, redirectToSignUp } from "@clerk/nextjs"
import { DE, ES, FR, IT } from "country-flag-icons/react/3x2"
import { useRouter } from "next/navigation"

interface DashboardProps {}

const languages = [
  {
    name: "French",
    code: "fr",
    icon: <FR />,
  },
  {
    name: "German",
    code: "de",
    icon: <DE />,
  },
  {
    name: "Spanish",
    code: "es",
    icon: <ES />,
  },
  {
    name: "Italian",
    code: "it",
    icon: <IT />,
  },
]

const Dashboard = async ({}: DashboardProps) => {
  const userId = auth()
  if (!userId) return redirectToSignUp()
  const user = await initProfile()

  return (
    <div className="bg-gray-0 h-[100vh] flex flex-1 flex-col p-8">
      <div>
        <h1 className="text-2xl font-medium text-center mt-8">
          Welcome{" "}
          <span className="bg-gradient-to-r inline-block from-[#7F00FF] to-[#E100FF] text-transparent bg-clip-text">
            {user?.userName}
          </span>
          !
          <br />
          Select a language to get started.
        </h1>
        <p className="text-center font-light text-slate-400">
          Don't worry, you can always learn other languages later.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 w-full gap-4 md:p-16">
        {languages.map((language) => (
          <LanguageCard language={language} />
        ))}
      </div>
    </div>
  )
}

export default Dashboard