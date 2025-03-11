import { Card } from '@/components/ui/card'
import React from 'react'

function WaitlistPage() {
  return (
    <Card className="p-2 flex gap-2 flex-col">
      <h1 className='text-xl font-bold'>You&apos;re on the waitlist!</h1>
      <div>You&apos;ll be notified when you&apos;ve been accepted to test out Cooking with Clerk.</div>
    </Card>
  )
}

export default WaitlistPage
