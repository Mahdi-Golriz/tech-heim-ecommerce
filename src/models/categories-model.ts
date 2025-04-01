export interface Category {
  title: string;
  documentId: string;
  id: number;
  locale: "en" | "de";
  description: string;
  thumbnail: { url: string };
}

export interface CategoryResponse {
  data: Category[];
}
