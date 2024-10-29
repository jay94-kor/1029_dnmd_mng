import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { formatNumber } from '../../utils/formatters';
import { useProject } from '../../context/ProjectContext';
import { calculatePaymentBudget } from '../../utils/projectNumber';

interface POFormProps {
  onCancel: () => void;
}

type InvoiceType = '세금계산서' | '사업소득' | '기타소득' | '면세사업자';

function POForm({ onCancel }: POFormProps) {
  const { currentProject, addPO } = useProject();
  const [formData, setFormData] = useState({
    amount: '',
    invoiceType: '세금계산서' as InvoiceType,
    paymentType: '선금' as '선금' | '잔금',
  });

  const [showTaxFreeConfirm, setShowTaxFreeConfirm] = useState(false);
  const [calculatedAmounts, setCalculatedAmounts] = useState({
    supplyAmount: 0,
    taxAmount: 0,
    totalAmount: 0,
    deductionAmount: 0
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (formData.amount && currentProject?.budget) {
      const amount = Number(formData.amount);
      let supplyAmount = 0;
      let taxAmount = 0;
      let deductionAmount = 0;

      switch (formData.invoiceType) {
        case '세금계산서':
          supplyAmount = Math.floor(amount / 1.1);
          taxAmount = amount - supplyAmount;
          break;
        case '사업소득':
          deductionAmount = Math.floor(amount * 0.033);
          supplyAmount = amount - deductionAmount;
          break;
        case '기타소득':
          deductionAmount = Math.floor(amount * 0.088);
          supplyAmount = amount - deductionAmount;
          break;
        case '면세사업자':
          if (!showTaxFreeConfirm) {
            setShowTaxFreeConfirm(true);
            return;
          }
          supplyAmount = amount;
          break;
      }

      const ratio = formData.paymentType === '선금' ? 70 : 30;
      const availableBudget = calculatePaymentBudget(
        currentProject.budget.vatExcluded,
        ratio,
        0.08,
        0.10,
        currentProject.budget.internalLaborRate / 100
      );

      if (supplyAmount > availableBudget) {
        setError(`예산을 초과했습니다. 사용 가능한 예산: ${formatNumber(availableBudget)}원`);
      } else {
        setError(null);
      }

      setCalculatedAmounts({
        supplyAmount,
        taxAmount,
        totalAmount: amount,
        deductionAmount
      });
    }
  }, [formData, currentProject, showTaxFreeConfirm]);

  const handleSubmit = () => {
    if (!currentProject || error) return;

    const poData = {
      projectId: currentProject.id,
      amount: Number(formData.amount),
      invoiceType: formData.invoiceType,
      supplyAmount: calculatedAmounts.supplyAmount,
      taxAmount: calculatedAmounts.taxAmount,
      deductionAmount: calculatedAmounts.deductionAmount,
      paymentType: formData.paymentType,
    };

    addPO(poData);
    toast.success('PO가 성공적으로 발행되었습니다.');
    onCancel();
  };

  if (!currentProject) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-gray-50 rounded-lg text-center"
      >
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">프로젝트를 먼저 선택해주세요.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {currentProject.projectNumber} - {currentProject.manager}
        </h3>
        <p className="text-sm text-gray-500">
          가용 예산: {formatNumber(currentProject.budget?.availableBudget || 0)}원
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="금액"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          suffix="원"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            발행 종류
          </label>
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.invoiceType}
            onChange={(e) => setFormData({ ...formData, invoiceType: e.target.value as InvoiceType })}
          >
            <option value="세금계산서">세금계산서 (부가세 10%)</option>
            <option value="사업소득">사업소득 (3.3%)</option>
            <option value="기타소득">기타소득 (8.8%)</option>
            <option value="면세사업자">면세사업자 (0%)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            지급 구분
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                className="form-radio text-indigo-600"
                name="paymentType"
                value="선금"
                checked={formData.paymentType === '선금'}
                onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as '선금' | '잔금' })}
              />
              <span className="ml-2">선금 (70%)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                className="form-radio text-indigo-600"
                name="paymentType"
                value="잔금"
                checked={formData.paymentType === '잔금'}
                onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as '선금' | '잔금' })}
              />
              <span className="ml-2">잔금 (30%)</span>
            </label>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {calculatedAmounts.totalAmount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 p-6 rounded-lg space-y-4"
          >
            <h4 className="font-medium text-gray-900">계산 결과</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">공급가액</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatNumber(calculatedAmounts.supplyAmount)}원
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {formData.invoiceType === '세금계산서' ? '부가세' : '공제액'}
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatNumber(
                    formData.invoiceType === '세금계산서'
                      ? calculatedAmounts.taxAmount
                      : calculatedAmounts.deductionAmount
                  )}원
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 p-4 rounded-lg flex items-start space-x-3"
          >
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end space-x-3">
        <Button variant="secondary" onClick={onCancel}>
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!!error || !formData.amount}
        >
          PO 발행
        </Button>
      </div>

      <AnimatePresence>
        {showTaxFreeConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                면세사업자 확인
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                면세사업자가 맞습니까? 면세사업자 여부를 반드시 확인해주세요.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowTaxFreeConfirm(false);
                    setFormData({ ...formData, invoiceType: '세금계산서' });
                  }}
                >
                  취소
                </Button>
                <Button onClick={() => setShowTaxFreeConfirm(false)}>
                  확인
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default POForm;