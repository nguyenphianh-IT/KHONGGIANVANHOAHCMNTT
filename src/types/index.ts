export interface TimelineEvent {
  year?: string;
  exactDate?: string;
  title: string;
  shortDescription: string;
  fullDetail: string;
  significance: string;
  location?: string;
  imageUrl?: string;
  category: 'tuoi-tre' | 'cuu-nuoc' | 'lanh-dao' | 'di-chuc';
  isMemorial?: boolean;
}

export type ResourceCategory = 'all' | 'article' | 'image' | 'video' | 'book';

export interface ResourceItem {
  id: string;
  title: string;
  category: 'article' | 'image' | 'video' | 'book';
  categoryLabel: string;
  description: string;
  fullContent?: string;
  authorOrSource: string;
  dateOrEra: string;
  thumbnail: string;
  mediaUrl?: string;
  badgeText: string;
  isMockData: boolean;
  tags: string[];
}

export interface LearningTopic {
  id: string;
  title: string;
  subtitle: string;
  targetAudience: string;
  coreMessage: string;
  content: string[];
  actionAdvice: string[];
  quote: string;
  iconName: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SchoolActivity {
  id: string;
  title: string;
  date: string;
  academicYear: string;
  organizer: string;
  summary: string;
  fullDetail: string;
  imageUrl: string;
  participants: string;
  isSampleData: boolean;
  highlights: string[];
}
