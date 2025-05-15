export interface PaginationMeta {
  total_items: number;
  page_size: number;
  current_page: number;
  total_pages: number;
  links: {
    self: string | null;
    prev: string | null;
    next: string | null;
  };
}
