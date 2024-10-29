import Dexie, { Table } from 'dexie';
import { Project, PO } from '../types/project';
import { Budget } from '../types/budget';

export class ProjectDatabase extends Dexie {
  projects!: Table<Project>;
  pos!: Table<PO>;
  budgets!: Table<Budget>;

  constructor() {
    super('ProjectDatabase');
    
    this.version(1).stores({
      projects: '++id, projectNumber, manager, status, createdAt',
      pos: '++id, projectId, poNumber, status, createdAt',
      budgets: '++id, projectId, expectedBidAmount, createdAt'
    });
  }

  async getProjectWithBudget(projectId: string): Promise<Project & { budget: Budget }> {
    const project = await this.projects.get(projectId);
    const budget = await this.budgets.where('projectId').equals(projectId).first();
    
    if (!project) throw new Error('Project not found');
    if (!budget) throw new Error('Budget not found');
    
    return { ...project, budget };
  }

  async getProjectPOs(projectId: string): Promise<PO[]> {
    return await this.pos.where('projectId').equals(projectId).toArray();
  }

  async calculateProjectUsage(projectId: string): Promise<{
    usedBudget: number;
    remainingBudget: number;
    usagePercentage: number;
  }> {
    const project = await this.getProjectWithBudget(projectId);
    const pos = await this.getProjectPOs(projectId);
    
    const usedBudget = pos.reduce((sum, po) => sum + po.amount, 0);
    const remainingBudget = project.budget.availableBudget - usedBudget;
    const usagePercentage = (usedBudget / project.budget.availableBudget) * 100;
    
    return {
      usedBudget,
      remainingBudget,
      usagePercentage
    };
  }
}

export const db = new ProjectDatabase();