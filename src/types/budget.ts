export interface Budget {
  id?: number;
  projectId: string;
  expectedBidAmount: number;
  vatExcluded: number;
  agencyFee: number;
  companyMargin: number;
  internalLabor: number;
  internalLaborRate: number;
  availableBudget: number;
  createdAt: Date;
}

export interface BudgetParams {
  maxBidAmount: number;
  startDate: Date;
  endDate: Date;
}