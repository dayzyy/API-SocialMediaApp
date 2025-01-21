import { useLocation } from "react-router-dom"

export default function NotFound(){
  const location = useLocation()

  return (
    <main className="pt-36 w-screen h-screen flex flex-col items-center">
      <h1 className="font-bold text-3xl">404 Page not found</h1>
      <h1 className="text-2xl">at http://localhost:3000{location.pathname}</h1>
    </main>
  )
}
