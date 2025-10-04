export type ProjectStatus = 'working' | 'inProgress' | 'completed';

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  tags: string[];
  attachments: number;
  comments: number;
  members: string[];
  image?: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}
