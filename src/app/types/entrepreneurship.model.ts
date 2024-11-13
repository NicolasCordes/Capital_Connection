
export interface Entrepreneurship {
  id?: number;
  idUser: string;
  name: string;
  description: string;
  goal: number;
  category: string;
  images: string[];
  videos: string[];
  collected?: number;
  activated?: boolean;
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
