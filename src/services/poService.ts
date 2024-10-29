import { PO } from '../types/project';
import { db } from '../db/db';

export const poService = {
  async createPO(po: Omit<PO, 'id' | 'poNumber'>): Promise<string> {
    const projectPOs = await db.pos.where('projectId').equals(po.projectId).toArray();
    const poNumber = generatePONumber(po.projectId, projectPOs.length);
    
    const id = await db.pos.add({
      ...po,
      poNumber,
      createdAt: new Date()
    });
    
    return String(id);
  },

  async getPO(id: string): Promise<PO> {
    const po = await db.pos.get(id);
    if (!po) throw new Error('PO not found');
    return po;
  },

  async getProjectPOs(projectId: string): Promise<PO[]> {
    return await db.pos.where('projectId').equals(projectId).toArray();
  },

  async updatePO(id: string, po: Partial<PO>): Promise<void> {
    await db.pos.update(id, po);
  },

  async deletePO(id: string): Promise<void> {
    await db.pos.delete(id);
  }
};

function generatePONumber(projectId: string, poCount: number): string {
  return `${projectId}-${(poCount + 1).toString().padStart(3, '0')}`;
}