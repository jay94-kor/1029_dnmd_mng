import { Project, PO } from '../types/project';
import { Budget, BudgetParams } from '../types/budget';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function fetchWithError(url: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  projects: {
    getAll: () => fetchWithError('/projects'),
    getById: (id: string) => fetchWithError(`/projects/${id}`),
    create: (project: Omit<Project, 'id' | 'projectNumber'>) =>
      fetchWithError('/projects', {
        method: 'POST',
        body: JSON.stringify(project),
      }),
    update: (id: string, project: Partial<Project>) =>
      fetchWithError(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(project),
      }),
    delete: (id: string) =>
      fetchWithError(`/projects/${id}`, { method: 'DELETE' }),
  },

  pos: {
    getAll: () => fetchWithError('/pos'),
    getByProject: (projectId: string) =>
      fetchWithError(`/projects/${projectId}/pos`),
    create: (po: Omit<PO, 'id' | 'poNumber'>) =>
      fetchWithError('/pos', {
        method: 'POST',
        body: JSON.stringify(po),
      }),
    update: (id: string, po: Partial<PO>) =>
      fetchWithError(`/pos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(po),
      }),
  },

  budget: {
    calculate: (params: BudgetParams): Promise<Budget> =>
      fetchWithError('/budget/calculate', {
        method: 'POST',
        body: JSON.stringify(params),
      }),
  },
};