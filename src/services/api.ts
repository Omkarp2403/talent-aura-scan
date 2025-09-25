const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Types
interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  token?: string;
  data?: T;
  pagination?: any;
}

interface CVDetail {
  id: number;
  requirement_id: string;
  candidate_name: string;
  email_id: string;
  years_of_experience: string;
  resume_score: number;
  job_description: string;
  required_locations: string;
  required_experience: string;
  evaluation_summary: string;
}

interface RequirementSummary {
  requirement_id: string;
  job_title: string;
  total_candidates: number;
  average_score: number;
  top_candidate: string;
  status: string;
}

// Auth helpers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Token ${token}` }),
  };
};

const handleResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || data.error || `HTTP ${response.status}`);
  }
  
  return data;
};

// Authentication API
export const authAPI = {
  async authenticate(username: string, password: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/authenticate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await handleResponse(response);
      
      if (result.token) {
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('username', result.username || username);
      }

      return { success: true, token: result.token, data: result };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  },

  async register(data: RegisterData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await handleResponse(response);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  },

  async checkUsername(username: string): Promise<{ available: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/check-username/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const result = await handleResponse(response);
      return result;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  },

  async checkEmail(email: string): Promise<{ available: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/check-email/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await handleResponse(response);
      return result;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
  },
};

// CV Processing API
export const cvAPI = {
  async getCVDetails(requirementId: string, page: number = 1, pageSize: number = 10): Promise<ApiResponse<CVDetail[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cv/details/${requirementId}/?page=${page}&page_size=${pageSize}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const result = await handleResponse(response);
      return { success: true, data: result.results || result, pagination: result.pagination };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  },

  async getRequirements(): Promise<ApiResponse<string[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cv/requirements/`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const result = await handleResponse(response);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  },

  async getRequirementDetails(requirementId: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cv/requirements/${requirementId}/`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const result = await handleResponse(response);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  },

  async downloadResume(candidateName: string): Promise<Blob> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cv/resume/${candidateName}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download resume: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      throw new Error((error as Error).message);
    }
  },

  async getRequirementSummary(): Promise<ApiResponse<RequirementSummary[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cv/summary/`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const result = await handleResponse(response);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  },

  async getCVStatistics(requirementId: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cv/statistics/${requirementId}/`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const result = await handleResponse(response);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  },

  async uploadFiles(files: FileList, requirementId?: string): Promise<ApiResponse> {
    try {
      const formData = new FormData();
      
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });
      
      if (requirementId) {
        formData.append('requirement_id', requirementId);
      }

      const response = await fetch(`${API_BASE_URL}/api/cv/upload/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      });

      const result = await handleResponse(response);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  },

  async processUploadedFiles(processingData: any): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cv/process-uploads/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(processingData),
      });

      const result = await handleResponse(response);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  },

  async getSupportedFileTypes(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cv/supported-types/`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const result = await handleResponse(response);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  },

  async deleteRequirement(requirementId: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cv/requirements/${requirementId}/delete/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const result = await handleResponse(response);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  },
};

// Core API
export const coreAPI = {
  async healthCheck(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health/`, {
        method: 'GET',
      });

      const result = await handleResponse(response);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  },
};

// Utility functions
export const apiUtils = {
  formatError(error: any): string {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.error) return error.error;
    return 'An unexpected error occurred';
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },

  getUsername(): string | null {
    return localStorage.getItem('username');
  },

  setAuthData(data: { authToken?: string; token?: string; username?: string }) {
    if (data.authToken || data.token) {
      localStorage.setItem('authToken', data.authToken || data.token!);
    }
    if (data.username) {
      localStorage.setItem('username', data.username);
    }
  },
};

// Default export
export default {
  auth: authAPI,
  cv: cvAPI,
  core: coreAPI,
  utils: apiUtils,
};