import { useAuth } from "../context/AuthContext"

export default function SettingsPage(){
  const { logout } = useAuth()

  return (
    <main className="w-screen pt-36 px-4 flex flex-col">
      <p className="text-xl text-gray-800 cursor-pointer" onClick={logout}>Log out</p>
    </main>
  )
}
