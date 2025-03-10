'use client';

import React, { useCallback, useEffect } from 'react';
import TaskCard from './TaskCard';
import CreateTaskInput from './CreateTaskInput';
import { Input } from '@/components/ui/input';
import { updateProject } from '../actions';
import { useRouter } from 'next/navigation';
import { cn, debounce } from '@/lib/utils';
import { useProjectStore } from '@/lib/store';
import { Task } from '@prisma/client';

interface Props {
  title: string;
  tasks: Task[];
  projectId?: string;
}

export default function TaskList({ title, tasks, projectId }: Props) {
  const [editedTitle, setEditedTitle] = React.useState(title);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    setEditedTitle(title);
  }, [title]);

  // Create a stable reference to the debounced function
  const { updateProject: updateProjectInStore } = useProjectStore();

  const debouncedUpdate = useCallback(
    debounce(async (newTitle: string) => {
      if (!projectId || !newTitle.trim() || newTitle === title) return;

      try {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('id', projectId);
        formData.append('name', newTitle.trim());
        await updateProject(formData);
        // Update the store
        updateProjectInStore(projectId, { name: newTitle.trim() });
        router.refresh();
      } catch (error) {
        // If there's an error, reset to the original title
        setEditedTitle(title);
      } finally {
        setIsSubmitting(false);
      }
    }, 500),
    [projectId, title, updateProjectInStore]
  );

  return (
    <div className="h-screen flex flex-col w-full max-w-2xl p-8 gap-4">
      {projectId ? (
        <div className="group relative">
          <Input
            value={editedTitle}
            onChange={(e) => {
              setEditedTitle(e.target.value);
              debouncedUpdate(e.target.value);
            }}
            className={cn(
              "text-lg md:text-xl font-semibold h-auto p-1 w-full",
              "bg-transparent border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
              "placeholder:text-gray-500 dark:placeholder:text-gray-400",
              "hover:bg-gray-50 dark:hover:bg-gray-800/50 focus:bg-gray-50 dark:focus:bg-gray-800/50",
              "shadow-none transition-colors rounded px-1 -ml-1"
            )}
            disabled={isSubmitting}
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
          </div>
        </div>
      ) : (
        <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
      )}

      <div className="w-full flex-1 rounded-xl">
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No tasks</p>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} projectName={title} />
            ))
          )}
        </div>
      </div>
      <div className='w-full'>
        <CreateTaskInput projectId={projectId} />
      </div>
    </div>
  );
}
