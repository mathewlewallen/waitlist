'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createTask } from "@/app/app/actions";
import { PlusIcon } from "lucide-react";

interface Props {
  projectId?: string;
}

export default function CreateTaskInput({ projectId }: Props) {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't create a task if the title is empty
    if (!title.trim()) return;
    
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("title", title);
      if (projectId) {
        formData.append("project_id", projectId);
      }
      await createTask(formData);
      setTitle("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-full p-2 relative group focus-within:shadow-[0_4px_20px_-2px_rgba(96,165,250,0.3),0_4px_20px_-2px_rgba(192,132,252,0.3)] transition-shadow duration-200">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/25 to-purple-400/25 transition-opacity duration-200 group-focus-within:from-blue-400 group-focus-within:to-purple-400"></div>
      <div className="absolute inset-[1px] group-focus-within:inset-[2px] transition-all rounded-full bg-white dark:bg-gray-800"></div>
      <div className="relative">
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 w-full items-center"
        >
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a task..."
            className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 dark:text-gray-100 shadow-none"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isSubmitting || !title.trim()}
            className="!rounded-full !h-[30px] !w-[30px] !p-0 flex items-center justify-center !min-h-0 !leading-none"
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
