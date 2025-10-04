import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Project, ProjectStatus } from '@/types';

export const useProjectStore = defineStore('project', () => {
  const projects = ref<Project[]>([
    {
      id: '1',
      title: 'Slack',
      description:
        'These project will need a new brand identity where they will get recognise.',
      status: 'working',
      tags: ['IOS APP', 'ANDROID'],
      attachments: 3,
      comments: 3,
      members: ['user1', 'user2', 'user3'],
      image: '/slack-mockup.png',
    },
    {
      id: '2',
      title: 'Google',
      description:
        'These project will need a new brand identity where they will get recognise.',
      status: 'working',
      tags: ['BRANDING'],
      attachments: 3,
      comments: 3,
      members: ['user1', 'user2', 'user3'],
    },
    {
      id: '3',
      title: 'Twitter',
      description:
        'These project will need a new brand identity where they will get recognise.',
      status: 'inProgress',
      tags: ['WEBSITE'],
      attachments: 3,
      comments: 3,
      members: ['user1', 'user2', 'user3'],
    },
    {
      id: '4',
      title: 'Maxxis Tyres',
      description:
        'These project will need a new brand identity where they will get recognise.',
      status: 'inProgress',
      tags: ['IOS APP', 'ANDROID'],
      attachments: 3,
      comments: 3,
      members: ['user1', 'user2', 'user3'],
    },
    {
      id: '5',
      title: 'Samsung',
      description:
        'These project will need a new brand identity where they will get recognise.',
      status: 'inProgress',
      tags: ['IOT', 'AR'],
      attachments: 3,
      comments: 3,
      members: ['user1'],
    },
    {
      id: '6',
      title: 'Tesla',
      description:
        'These project will need a new brand identity where they will get recognise.',
      status: 'completed',
      tags: ['IOS APP', 'ANDROID'],
      attachments: 3,
      comments: 3,
      members: ['user1'],
    },
    {
      id: '7',
      title: 'Slack',
      description:
        'These project will need a new brand identity where they will get recognise.',
      status: 'completed',
      tags: ['IOS APP', 'ANDROID'],
      attachments: 3,
      comments: 3,
      members: ['user1'],
      image: '/slack-screens.png',
    },
  ]);

  const getProjectsByStatus = (status: ProjectStatus) => {
    return computed(() => projects.value.filter((p) => p.status === status));
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
    };
    projects.value.push(newProject);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const index = projects.value.findIndex((p) => p.id === id);
    if (index !== -1) {
      projects.value[index] = { ...projects.value[index], ...updates };
    }
  };

  const deleteProject = (id: string) => {
    projects.value = projects.value.filter((p) => p.id !== id);
  };

  return {
    projects,
    getProjectsByStatus,
    addProject,
    updateProject,
    deleteProject,
  };
});
