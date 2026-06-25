export interface Branch {
  id: number;
  name: string;
  code: string;
  email: string;
  commercial_email: string;
  phone: string;
  rut: string;
  business_name: string;
}

export interface BranchesResponse {
  data: Branch[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
