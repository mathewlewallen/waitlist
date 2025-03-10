import { Project } from '@/app/app/models';
import { create } from 'zustand'

interface ProjectStore {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),
  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map((project) =>
      project.id === id ? { ...project, ...updates } : project
    ),
  })),
}));
