export interface ProjectEntry {
  slug: string;
  data: {
    title: string;
    description: string;
    techStack?: string[];
    image?: string;
    liveUrl?: string;
    githubUrl?: string;
    featured?: boolean;
  };
  body?: string;
}

export interface ProjectCardProps {
  project: ProjectEntry;
  delay?: number;
}