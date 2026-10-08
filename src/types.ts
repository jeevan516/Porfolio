export type TargetRole = 'all' | 'ai-ml' | 'it-devops' | 'observability' | 'data-eng';

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'ai-ml' | 'it-devops' | 'observability' | 'data-eng';
  tags: string[];
  impact: string;
  metrics?: { label: string; value: string }[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  status: 'Production at WaDaCon' | 'Open Source' | 'Research' | 'Deployed' | 'Defended & Verified (TU Clausthal)' | 'Production at WaDaCon (Completed)';
  viewsCount: number;
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: {
    name: string;
    level: number; // 0-100
    experience: string;
    highlight?: boolean;
  }[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  skills: string[];
  icon: string;
  certificateId?: string;
  accreditation?: string; // e.g. "CompTIA® / PMI® #4101", "IIBA® #189294", "NASBA #140940", "BAMF / g.a.s.t."
  category?: 'ai-ml' | 'business-analysis' | 'it-management' | 'data-eng' | 'languages';
  year?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  location: string;
  period: string;
  logo?: string;
  skillsAcquired: string[];
  description?: string;
  thesisTitle?: string;
  thesisAdvisors?: string[];
  thesisUrl?: string;
  githubUrl?: string;
  publicRepoUrl?: string;
  highlights: string[];
  verifiedOnLinkedIn: boolean;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  employmentType?: string;
  description: string;
  achievements: string[];
  technologies: string[];
  category: 'work' | 'education';
}

export type PipelineStage = 'inquiry' | 'screening' | 'technical' | 'offer' | 'archived';

export interface RecruiterInquiry {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  roleTitle: string;
  locationType: 'Hamburg Onsite' | 'Hybrid Germany' | 'Remote' | 'Other';
  stage: PipelineStage;
  message: string;
  salaryOrBudget?: string;
  dateAdded: string;
  notes?: string;
}

export interface PortfolioAnalytics {
  totalViews: number;
  uniqueRecruiters: number;
  briefDownloads: number;
  inquiriesReceived: number;
  topRegions: { region: string; percentage: number; count: number }[];
  projectInteractions: { projectId: string; title: string; views: number; clickRate: string }[];
  weeklyTraffic: { day: string; views: number; recruiters: number }[];
}

export interface AcademicReference {
  id: string;
  name: string;
  title: string;
  institution: string;
  department: string;
  location: string;
  relationship: string;
  subjectArea: string;
  quote: string;
  endorsements: string[];
  contactEmail?: string;
  verificationNote: string;
}
