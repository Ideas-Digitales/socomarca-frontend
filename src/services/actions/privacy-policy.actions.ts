'use server';

import { cookiesManagement } from '@/stores/base/utils/cookiesManagement';
import { BACKEND_URL } from '@/utils/getEnv';

export async function savePrivacyPolicy(content: string) {
  try {
    if (!content || !content.trim()) {
      return { success: false, error: 'Content is required' };
    }

    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    if (!token) {
      return { success: false, error: 'Unauthorized: No token provided' };
    }

    const response = await fetch(`${BACKEND_URL}/privacy-policy`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        content: content
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return { 
        success: true, 
        message: 'Privacy policy updated successfully',
        data: data
      };
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update privacy policy');
    }
  } catch (error) {
    console.error('Error updating privacy policy:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal server error' 
    };
  }
}

export async function getPrivacyPolicy() {
  try {
    const { getCookie } = await cookiesManagement();
    const token = getCookie('token');

    if (!token) {
      return {
        success: false,
        error: 'Unauthorized: No token provided',
        content: 'Comienza a escribir tu contenido aquí...'
      };
    }

    const response = await fetch(`${BACKEND_URL}/privacy-policy`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    }); 
    if (response.ok) {
      const data = await response.json();
      return { 
        success: true, 
        content: data.content || 'Comienza a escribir tu contenido aquí...'
      };
    } else {
      throw new Error('Failed to fetch privacy policy');
    }
  } catch (error) {
    console.error('Error fetching privacy policy:', error);
    return { 
      success: false, 
      error: 'Internal server error',
      content: 'Comienza a escribir tu contenido aquí...'
    };
  }
}

export async function getPrivacyPolicyPublic() {
  try {
    const response = await fetch(`${BACKEND_URL}/privacy-policy`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store'
    }); 
    
    if (response.ok) {
      const data = await response.json();
      return { 
        success: true, 
        content: data.content || 'No hay contenido disponible en este momento.'
      };
    } else {
      console.log('Failed to fetch privacy policy, status:', response.status);
      return { 
        success: false, 
        error: 'Failed to fetch privacy policy',
        content: 'No hay contenido disponible en este momento.'
      };
    }
  } catch (error) {
    console.error('Error fetching privacy policy:', error);
    return { 
      success: false, 
      error: 'Internal server error',
      content: 'No hay contenido disponible en este momento.'
    };
  }
} 