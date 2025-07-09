export interface Announcement {
  id: string;
  title: string;
  content: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  authorName: string;
  isPublished: boolean;
  publishedAt?: string;
}

export interface AnnouncementFilters {
  searchTerm: string;
  isPublished?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface AnnouncementListResponse {
  data: Announcement[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
  isPublished: boolean;
}

export interface UpdateAnnouncementData {
  title?: string;
  content?: string;
  isPublished?: boolean;
}

export interface AnnouncementSelection {
  selectedRowKeys: string[];
  selectedRows: Announcement[];
}
