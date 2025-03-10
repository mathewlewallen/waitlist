'use client';

import React from 'react';
import { toggleTask } from '../actions';
import EditTaskModal from './EditTaskModal';
import { cn } from '@/lib/utils';
import { Task } from '@prisma/client';

interface Props {
  task: Task;
  projectName?: string;
}

export default function TaskCard({ task, projectName }: Props) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Don't open modal if clicking the checkbox
    if (!target.closest('button')) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={cn(
          "p-2 rounded-lg border border-transparent hover:border-gray-100 dark:border-gray-800 dark:hover:bg-gray-800/50 cursor-pointer transition-colors duration-200",
          task.is_completed && "opacity-50"
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleTask(task.id);
              }}
              className="mt-1 h-4 w-4 flex-shrink-0 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-gray-400 dark:hover:border-gray-500"
            >
              {task.is_completed && (
                <svg className="h-3 w-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            {/* Task details */}
            <div>
              <h3 className={cn(
                "font-medium",
                task.is_completed && "line-through text-gray-400 dark:text-gray-500"
              )}>{task.title}</h3>

              {task.description && (
                <p className={cn(
                  "text-sm text-gray-500 dark:text-gray-400 mt-1",
                  task.is_completed && "line-through opacity-75"
                )}>
                  {task.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <EditTaskModal
        task={task}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        projectName={projectName}
      />
    </>
  );
}
