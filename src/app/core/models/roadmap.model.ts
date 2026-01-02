export type RoadmapStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface RoadmapNotes {
  learned: string | null;
  application: string | null;
  additions: string | null;
}

export interface RoadmapItem {
  id: number;
  title: string;
  description: string | null;
  status: RoadmapStatus;
  progress: number;
  notes: RoadmapNotes | null;
  links: string[];
  subItems: RoadmapItem[];
}

export interface RoadmapCategory {
  id: number;
  name: string;
  icon: string;
  color: string;
  items: RoadmapItem[];
  userId?: number;
}

export interface RoadmapItemDTO {
  id?: number;
  title: string;
  description: string | null;
  categoryId: number;
  status: RoadmapStatus;
  progress: number;
  links: string[];
  learned: string | null;
  application: string | null;
  additions: string | null;
}
