import { Suspense } from "react"
import SignInClient from "@/app/component/SignInClient"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SignInClient />
    </Suspense>
  )
}