'use server';

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  if (!title?.trim()) {
    throw new Error("Title is required");
  }

  const project_id = formData.get("project_id") as string | null;

  await prisma.task.create({
    data: {
      title: title.trim(),
      owner_id: userId,
      project_id: project_id || null
    },
  });

  revalidatePath('/app');
}


export async function toggleTask(taskId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task || task.owner_id !== userId) {
    throw new Error("Task not found or unauthorized");
  }

  await prisma.task.update({
    where: { id: taskId },
    data: { is_completed: !task.is_completed },
  });

  revalidatePath('/app');
}

export async function updateTask(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!id || !title?.trim()) {
    throw new Error("Invalid input");
  }

  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (!task || task.owner_id !== userId) {
    throw new Error("Task not found or unauthorized");
  }

  await prisma.task.update({
    where: { id },
    data: {
      title: title.trim(),
      description: description?.trim() || null,
    },
  });

  revalidatePath('/app');
}

export async function createProject(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  if (!name?.trim()) {
    throw new Error("Project name is required");
  }

  const project = await prisma.project.create({
    data: {
      name: name.trim(),
      owner_id: userId,
    },
  });

  revalidatePath('/app');
  return project;
}

export async function getProjects() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  return prisma.project.findMany({
    where: {
      owner_id: userId,
    },
    orderBy: {
      created_at: 'asc'
    }
  });
}

export async function updateProject(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;

  if (!id || !name?.trim()) {
    throw new Error("Invalid input");
  }

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project || project.owner_id !== userId) {
    throw new Error("Project not found or unauthorized");
  }

  await prisma.project.update({
    where: { id },
    data: {
      name: name.trim(),
    },
  });

  revalidatePath('/app');
}

export async function deleteProject(projectId: string) {
  // Delete all tasks associated with the project first
  await prisma.task.deleteMany({
    where: {
      project_id: projectId
    }
  });

  // Then delete the project
  await prisma.project.delete({
    where: {
      id: projectId
    }
  });
}

export async function deleteTask(taskId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Delete the task
  await prisma.task.delete({
    where: {
      id: taskId,
      owner_id: userId // Ensure the task belongs to the user
    }
  });

  revalidatePath('/app');
}