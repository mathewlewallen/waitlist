import { SignIn } from '@clerk/nextjs'
import React from 'react'

function SignInPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn />
    </div>
  )
}

export default SignInPage