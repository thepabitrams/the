export interface PreviewSlide {
  mode: 'desktop' | 'mobile';
  image: string;
}

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
    preview?: PreviewSlide[];
  };
  body?: string;
}