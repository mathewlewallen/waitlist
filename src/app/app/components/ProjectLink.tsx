'use client';

import React from 'react';
import Link from 'next/link';
import { FolderIcon, MoreVertical, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { deleteProject } from '../actions';
import { useProjectStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Project } from '../models';

interface Props {
  project: Project;
  isCollapsed?: boolean;
}

export default function ProjectLink({ project, isCollapsed }: Props) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);
  const { projects, setProjects } = useProjectStore();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteProject(project.id);
      setProjects(projects.filter(p => p.id !== project.id));
      router.push('/app');
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  return (
    <div className="group relative">
      <div className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 group-hover:bg-white/75 dark:group-hover:bg-gray-800/50 rounded-lg transition-colors">
        <Link
          href={`/app/projects/${project.id}`}
          className="flex flex-1 items-center gap-2"
        >
          <FolderIcon className="w-4 h-4 flex-shrink-0" />
          <span className={cn(
            "transition-opacity duration-200",
            isCollapsed && "opacity-0"
          )}>
            {project.name}
          </span>
        </Link>

        {!isCollapsed && (
          <DropdownMenu open={showMenu} onOpenChange={setShowMenu}>
            <DropdownMenuTrigger 
              className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1 rounded ml-2"
              onClick={(e) => e.preventDefault()}
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                className="text-red-600 dark:text-red-400"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Project</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{project.name}"? This action cannot be undone and will delete all tasks associated with this project.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 dark:bg-red-900 dark:hover:bg-red-800"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
