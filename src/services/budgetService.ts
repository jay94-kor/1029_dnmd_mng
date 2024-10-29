import { Budget, BudgetParams } from '../types/budget';
import { db } from '../db/db';

export const budgetService = {
  calculateBudget(params: BudgetParams): Budget {
    const { maxBidAmount, startDate, endDate } = params;
    
    // 예산 계산 로직
    const expectedBidAmount = maxBidAmount;
    const vatExcluded = Math.floor(expectedBidAmount / 1.1);
    const agencyFee = Math.floor(vatExcluded * 0.08);
    const companyMargin = Math.floor(vatExcluded * 0.10);
    
    // 내부 인건비 계산
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const internalLaborRate = days * 0.00075;
    const internalLabor = Math.floor(vatExcluded * internalLaborRate);
    
    const availableBudget = vatExcluded - (agencyFee + companyMargin + internalLabor);

    return {
      projectId: '', // 프로젝트 생성 시 설정됨
      expectedBidAmount,
      vatExcluded,
      agencyFee,
      companyMargin,
      internalLabor,
      internalLaborRate: internalLaborRate * 100,
      availableBudget,
      createdAt: new Date()
    };
  },

  async saveBudget(budget: Budget): Promise<string> {
    const id = await db.budgets.add(budget);
    return String(id);
  },

  async getBudget(projectId: string): Promise<Budget | undefined> {
    return await db.budgets.where('projectId').equals(projectId).first();
  },

  async updateBudget(projectId: string, budget: Partial<Budget>): Promise<void> {
    await db.budgets.where('projectId').equals(projectId).modify(budget);
  }
};