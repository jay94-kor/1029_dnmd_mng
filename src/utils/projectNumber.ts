export function generateProjectNumber(currentCount: number): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const counter = (currentCount + 1).toString().padStart(3, '0');
  
  return `${counter}-${year}${month}`;
}

export function generatePONumber(projectId: string, poCount: number): string {
  return `${projectId}-${(poCount + 1).toString().padStart(3, '0')}`;
}

export function calculatePaymentBudget(
  totalAmount: number,
  ratio: number,
  agencyFeeRate: number,
  companyMarginRate: number,
  internalLaborRate: number
): number {
  const baseAmount = totalAmount * (ratio / 100);
  const deductions = baseAmount * (agencyFeeRate + companyMarginRate + internalLaborRate);
  return Math.floor(baseAmount - deductions);
}