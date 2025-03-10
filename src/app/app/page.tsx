import React from 'react'
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import TaskList from './components/TaskList';
import { notFound, redirect } from "next/navigation";

export default async function AppHome() {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/sign-in');
  }

  // Get the user's inbox tasks
  const tasks = await prisma.task.findMany({
    where: {
      owner_id: userId,
      project_id: null
    },
    orderBy: {
      created_at: 'desc'
    }
  });

  return (
    <div className='h-screen flex'>
      <TaskList 
        title="Inbox" 
        tasks={tasks} 
      />
    </div>
  )
}