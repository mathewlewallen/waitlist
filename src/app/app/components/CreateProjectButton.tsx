'use client';

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProject } from "@/app/app/actions";
import { useFormStatus } from "react-dom";
import { PlusIcon } from "lucide-react";
import { useProjectStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      Create Project
    </Button>
  );
}

export default function CreateProjectButton() {
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { projects, setProjects } = useProjectStore();
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    try {
      const project = await createProject(formData);
      setProjects([...projects, project]);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-5 w-5 text-sm">
          <PlusIcon />
      </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new project</DialogTitle>
        </DialogHeader>
        <form
          ref={formRef}
          action={onSubmit}
          className="space-y-4"
        >
          <Input
            type="text"
            name="name"
            placeholder="Project name"
            required
          />
          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
