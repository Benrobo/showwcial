// Server Response Type
export interface ServerResponseType {
  errorStatus?: boolean;
  code?: string;
  message?: string;
  statusCode?: number;
}

export interface NuroThemeProps {
  userImage?: string;
  fullname?: string;
  tagline?: string;
  email?: string;
  experiences?: {
    id: number | string;
    companyName?: string;
    title?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    description?: string;
  }[];
  about?: {
    content?: string;
    stacks?: string[];
  };
  resumeUrl?: string;
  projects?: {
    name?: string;
    description?: string;
    tags?: string[];
    ghUrl?: string;
    live_url?: string;
    image: string;
  }[];
  ghRepo?: {
    name?: string;
    decsription?: string;
    tags?: string[];
    url?: string;
  }[];
  socialLinks?: {
    label?: string;
    url?: string;
  }[];
  showcaseprofile?: string;
}

export interface OasisProps {
  resumeUrl?: string;
  userImage?: string;
  email?: string;
  socialLinks?: {
    label?: string;
    url?: string;
  }[];
  fullname?: string;
  tagline?: string;
  headline?: string;
  showwcaseProfile?: string;
  about?: string;
  stacks?: string[];
  experiences?: {
    id: string | number;
    companyName?: string;
    title?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    description?: string;
  }[];
  projects?: {
    name?: string;
    decsription?: string;
    tags?: string[];
    githubUrl?: string;
    liveUrl?: string;
    image: string;
  }[];
  ghRepo?: {
    name?: string;
    decsription?: string;
    tags?: string[];
    url?: string;
  }[];
}
