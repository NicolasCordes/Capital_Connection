export interface Entrepreneurship {
  id?: number;
  name: string;
  images: string[];
  description: string;
  videos: string[];
  goal: number;
  category: string;
  collected?: number;
  isActivated?: boolean;
  id_account: number;
}

export interface PageResponse {
  content: Entrepreneurship[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}
