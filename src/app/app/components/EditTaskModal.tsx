'use client';

import React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/navigation';
import { updateTask, toggleTask, deleteTask } from '../actions';
import { Folder, MoreVertical, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Task } from '../models';

interface Props {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName?: string;
}

export default function EditTaskModal({ task: initialTask, open, onOpenChange, projectName }: Props) {
  const [task, setTask] = React.useState(initialTask);  
  const [title, setTitle] = React.useState(task.title); 
  const [description, setDescription] = React.useState(task.description || '');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  // Reset form when modal opens
  React.useEffect(() => {
    if (open) {
      setTask(initialTask);
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
    }
  }, [open, initialTask]);

  const saveChanges = useDebouncedCallback(async () => {
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('id', task.id);
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      await updateTask(formData);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }, 1000);

  async function onToggleCompleted() {
    const newIsCompleted = !task.is_completed;
    setTask(prev => ({ ...prev, is_completed: newIsCompleted }));
    try {
      await toggleTask(task.id);
    } catch (error) {
      // Revert on error
      setTask(prev => ({ ...prev, is_completed: !newIsCompleted }));
    }
  }

  function titleRef(el: HTMLTextAreaElement | null) {
    if (el) {
      el.style.height = '2.5rem'; // Set initial height
      const scrollHeight = el.scrollHeight;
      const minHeight = 40; // 2.5rem in pixels
      el.style.height = `${Math.max(scrollHeight, minHeight)}px`;
    }
  }

  function onTitleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setTitle(e.target.value);
    saveChanges();

    // Auto-adjust height after value changes
    const el = e.target;
    el.style.height = '2.5rem'; // Reset to minimum height
    const scrollHeight = el.scrollHeight;
    const minHeight = 40; // 2.5rem in pixels
    el.style.height = `${Math.max(scrollHeight, minHeight)}px`;
  }

  function onDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setDescription(e.target.value);
    saveChanges();
  }

  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <>
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="p-0 h-[80vh] flex flex-col gap-0 [&>button]:hidden">
          <DialogHeader className="border-b border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-sm">
                <Folder size={14} />  {projectName ?? "Inbox"}
              </DialogTitle>
              <div className="flex items-center gap-1">
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              </div>
            </div>
          </DialogHeader>
        <div className="flex-1 flex flex-col">
          <div className="flex items-start border-b border-gray-200 p-3">
            <div className="pt-[0.7rem]">
              <input
                type="checkbox"
                checked={task.is_completed}
                onChange={onToggleCompleted}
                className="h-4 w-4 rounded border-gray-300 text-primary hover:cursor-pointer"
              />
            </div>

            <Textarea
              ref={titleRef}
              value={title}
              onChange={onTitleChange}
              placeholder="Task title"
              disabled={isSubmitting}
              className="min-h-0 font-semibold flex-1 md:text-base border-none bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 focus:border focus:border-gray-200 dark:focus:border-gray-800 transition-colors shadow-none focus:shadow-none ring-0 focus:ring-0 outline-none resize-none overflow-hidden leading-normal"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                }
              }}
            />
          </div>

          <div className="flex-1">
            <Textarea
              value={description}
              onChange={onDescriptionChange}
              placeholder="Add a description..."
              disabled={isSubmitting}
              className="h-full border-0 shadow-none rounded-none resize-y p-3 focus:ring-0 focus-visible:ring-0 focus:outline-none focus-visible:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // Allow line breaks
                  e.stopPropagation();
                }
              }}
            />
          </div>
        </div>
        <div className="p-2 text-[10px] text-gray-400 dark:text-gray-500 border-t border-gray-200 flex justify-between">
          <div>Created {new Date(task.created_at).toLocaleDateString()} at {new Date(task.created_at).toLocaleTimeString()}</div>
          <div>Updated {new Date(task.updated_at).toLocaleDateString()} at {new Date(task.updated_at).toLocaleTimeString()}</div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
