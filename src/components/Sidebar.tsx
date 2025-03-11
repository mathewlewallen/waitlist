'use client'

import { cn } from '@/lib/utils';
import { ChevronRightIcon, ChevronLeftIcon, InboxIcon } from 'lucide-react';
import React from 'react'
import Link from 'next/link';
import CreateProjectButton from './CreateProjectButton';
import ProjectLink from './ProjectLink';
import { useProjectStore } from '@/lib/store';
import { UserButton } from '@clerk/nextjs';
import { getProjects } from '../app/app/actions';

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { projects, setProjects } = useProjectStore();

  React.useEffect(() => {
    // Only fetch if we don't have projects yet
    if (projects.length === 0) {
      void getProjects().then(setProjects);
    }
  }, [projects.length, setProjects]);

  return (
    <div 
      className={cn(
        "h-screen border-r border-gray-200 dark:border-gray-800 p-4 bg-gradient-to-b from-blue-50 via-purple-50/80 to-blue-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-blue-950/20",
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <nav className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className={cn(
            "transition-all duration-300",
            isCollapsed ? "w-0 overflow-hidden" : "w-auto"
          )}>
            <UserButton showName />
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-white/75 dark:hover:bg-gray-800/50 transition-colors flex-shrink-0"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-4 h-4" />
            ) : (
              <ChevronLeftIcon className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className={cn(
          "transition-all duration-300",
          isCollapsed ? "w-0 overflow-hidden" : "w-auto"
        )}>
          <Link 
            href="/app"
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-white/75 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <InboxIcon className="w-4 h-4" />
            <span>Inbox</span>
          </Link>
        </div>
        
        <div className={cn(
          "pt-4 transition-all duration-300",
          isCollapsed ? "w-0 overflow-hidden" : "w-auto"
        )}>
          <div className="px-3 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center justify-between">
            <span>Projects</span>
            <CreateProjectButton />
          </div>
          {projects.map((project) => (
            <ProjectLink key={project.id} project={project} isCollapsed={isCollapsed} />
          ))}
        </div>
      </nav>
    </div>
  );
}

export default Sidebar
