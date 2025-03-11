import React from 'react'
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import TaskList from '../../../../components/TaskList';

interface ProjectPageProps {
  params: Promise<{
    _id: string;
  }>;
}

export default async function Project({ params }: ProjectPageProps) {
  const { userId } = await auth();

  // If the user is not logged in, redirect to the sign-in page
  if (!userId) {
    return redirect('/sign-in');
  }

  const { _id } = await params;
  const project = await prisma.project.findUnique({
    where: {
      id: _id,
    },
  });

  // Check if the project exists and belongs to the user
  if (!project || project.owner_id !== userId) {
    notFound();
  }

  // Get the project tasks
  const tasks = await prisma.task.findMany({
    where: {
      project_id: _id,
      owner_id: userId,
    },
    orderBy: {
      created_at: 'desc'
    }
  });

  return (
    <div className='h-screen flex'>
      <TaskList 
        title={project.name} 
        tasks={tasks} 
        projectId={project.id}
      />
    </div>
  );
}