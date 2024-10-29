import React from 'react';
import { Budget } from '../../types/budget';
import { formatNumber } from '../../utils/formatters';

interface BudgetResultProps {
  budget: Budget | null;
}

export function BudgetResult({ budget }: BudgetResultProps) {
  if (!budget) return null;

  return (
    <div className="mt-8 bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">예산 계산 결과</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-500">예상 투찰 금액</p>
          <p className="text-lg font-semibold text-gray-900">{formatNumber(budget.expectedBidAmount)}원</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">부가세 제외 금액</p>
          <p className="text-lg font-semibold text-gray-900">{formatNumber(budget.vatExcluded)}원</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">일반 대행비 (8%)</p>
          <p className="text-lg font-semibold text-gray-900">{formatNumber(budget.agencyFee)}원</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">기업 마진 (10%)</p>
          <p className="text-lg font-semibold text-gray-900">{formatNumber(budget.companyMargin)}원</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">내부 인건비율</p>
          <p className="text-lg font-semibold text-gray-900">{budget.internalLaborRate.toFixed(2)}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">내부 인건비</p>
          <p className="text-lg font-semibold text-gray-900">{formatNumber(budget.internalLabor)}원</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm text-gray-500">가용 예산</p>
          <p className="text-xl font-semibold text-indigo-600">{formatNumber(budget.availableBudget)}원</p>
        </div>
      </div>
    </div>
  );
}