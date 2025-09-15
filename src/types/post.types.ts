import { Post } from "@/models"

export enum ScheduleOption {
  NOW = 'NOW',
  LATER = 'LATER'
}

export enum PostStatus {
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  FAILED = 'failed'
}

export interface PostQueryParams {
  page?: number
  limit?: number
  status?: 'SCHEDULED' | 'PUBLISHED' | 'FAILED'
  sortBy?: 'createdAt' | 'scheduledAt'
  sortOrder?: 'ASC' | 'DESC'
}

export interface PaginatedPostsResponse {
  data: Post[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}