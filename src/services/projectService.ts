import { Project, PO } from '../types/project';
import { db } from '../db/db';
import { budgetService } from './budgetService';

export const projectService = {
  async createProject(project: Omit<Project, 'id' | 'projectNumber'>): Promise<string> {
    const projectNumber = generateProjectNumber(await db.projects.count());
    const id = await db.projects.add({
      ...project,
      projectNumber,
      createdAt: new Date()
    });
    return String(id);
  },

  async getProject(id: string): Promise<Project & { budget?: Budget }> {
    const project = await db.projects.get(id);
    if (!project) throw new Error('Project not found');
    
    const budget = await budgetService.getBudget(id);
    return { ...project, budget };
  },

  async getProjects(): Promise<Project[]> {
    return await db.projects.toArray();
  },

  async updateProject(id: string, project: Partial<Project>): Promise<void> {
    await db.projects.update(id, project);
  },

  async deleteProject(id: string): Promise<void> {
    await db.projects.delete(id);
  }
};

function generateProjectNumber(currentCount: number): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const counter = (currentCount + 1).toString().padStart(3, '0');
  return `${counter}-${year}${month}`;
}