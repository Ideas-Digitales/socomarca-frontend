'use server';

import { cookiesManagement } from "@/stores/base/utils/cookiesManagement";
import { BACKEND_URL } from "@/utils/getEnv";

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

export interface FAQPaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface FAQPaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface FAQListResponse {
  data: FAQItem[];
  links: FAQPaginationLinks;
  meta: FAQPaginationMeta;
}

export interface FAQSingleResponse {
  data: FAQItem;
}

export interface FAQDeleteResponse {
  message: string;
}

export type ApiResponse<T = any> = {
  ok: boolean;
  data: T | null;
  error: string | null;
};

const getAuthHeaders = async () => {
  const { getCookie } = await cookiesManagement();
  const token = getCookie('token');
  
  if (!token) {
    throw new Error('Unauthorized: No token provided');
  }

  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

const handleApiRequest = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const headers = await getAuthHeaders();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `Error HTTP: ${response.status}`);
    }

    return {
      ok: true,
      data,
      error: null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('API Request Error:', errorMessage);
    
    return {
      ok: false,
      data: null,
      error: errorMessage,
    };
  }
};

export const fetchGetFAQ = async (params: {
  page: number;
  per_page: number;
}): Promise<ApiResponse<FAQListResponse>> => {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    per_page: params.per_page.toString(),
  });

  return handleApiRequest<FAQListResponse>(`${BACKEND_URL}/faq?${queryParams}`, {
    method: 'GET',
  });
};

export const fetchSearchFAQ = async (params: {
  search: string;
  per_page: number;
}): Promise<ApiResponse<FAQListResponse>> => {
  return handleApiRequest<FAQListResponse>(`${BACKEND_URL}/faq/search`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
};

export const fetchCreateFAQ = async (body: {
  question: string;
  answer: string;
}): Promise<ApiResponse<FAQSingleResponse>> => {
  return handleApiRequest<FAQSingleResponse>(`${BACKEND_URL}/faq`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

export const fetchUpdateFAQ = async (
  id: number,
  body: {
    question?: string;
    answer?: string;
  }
): Promise<ApiResponse<FAQSingleResponse>> => {
  return handleApiRequest<FAQSingleResponse>(`${BACKEND_URL}/faq/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
};

export const fetchDeleteFAQ = async (params: {
  id: number;
}): Promise<ApiResponse<FAQDeleteResponse>> => {
  return handleApiRequest<FAQDeleteResponse>(`${BACKEND_URL}/faq/${params.id}`, {
    method: 'DELETE',
  });
};

export const fetchFAQById = async (id: number): Promise<ApiResponse<FAQSingleResponse>> => {
  return handleApiRequest<FAQSingleResponse>(`${BACKEND_URL}/faq/${id}`, {
    method: 'GET',
  });
};

export const fetchBulkCreateFAQ = async (
  faqs: Array<{ question: string; answer: string }>
): Promise<ApiResponse<FAQListResponse>> => {
  return handleApiRequest<FAQListResponse>(`${BACKEND_URL}/faq/bulk`, {
    method: 'POST',
    body: JSON.stringify({ faqs }),
  });
};

export const fetchBulkUpdateFAQ = async (
  updates: Array<{ id: number; question?: string; answer?: string }>
): Promise<ApiResponse<FAQListResponse>> => {
  return handleApiRequest<FAQListResponse>(`${BACKEND_URL}/faq/bulk-update`, {
    method: 'PUT',
    body: JSON.stringify({ updates }),
  });
};

export const fetchBulkDeleteFAQ = async (
  ids: number[]
): Promise<ApiResponse<{ deleted_count: number }>> => {
  return handleApiRequest<{ deleted_count: number }>(`${BACKEND_URL}/faq/bulk-delete`, {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  });
};