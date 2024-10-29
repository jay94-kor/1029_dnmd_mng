import React, { useState } from 'react';
import { toast } from 'sonner';
import { useProject } from '../context/ProjectContext';
import { Input } from './common/Input';
import { Button } from './common/Button';
import { BudgetResult } from './budget/BudgetResult';
import { Budget } from '../types/budget';

function ProjectForm() {
  const { calculateBudget, addProject } = useProject();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    manager: '',
    announcementNumber: '',
    maxBidAmount: '',
    startDate: '',
    endDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.manager.trim()) {
      newErrors.manager = '담당자명을 입력해주세요.';
    }
    
    if (!formData.announcementNumber.trim()) {
      newErrors.announcementNumber = '공고번호를 입력해주세요.';
    }
    
    if (!formData.maxBidAmount || Number(formData.maxBidAmount) <= 0) {
      newErrors.maxBidAmount = '유효한 입찰 금액을 입력해주세요.';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = '계약 시작일을 선택해주세요.';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = '계약 마감일을 선택해주세요.';
    } else if (formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = '계약 마감일은 시작일 이후여야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  React.useEffect(() => {
    if (formData.maxBidAmount && formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (endDate > startDate) {
        const result = calculateBudget({
          maxBidAmount: Number(formData.maxBidAmount),
          startDate,
          endDate,
        });
        setBudget(result);
      }
    }
  }, [formData.maxBidAmount, formData.startDate, formData.endDate, calculateBudget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !budget) return;

    try {
      setIsSubmitting(true);
      await addProject({
        manager: formData.manager,
        announcementNumber: formData.announcementNumber,
        maxBidAmount: Number(formData.maxBidAmount),
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        status: 'active',
        createdAt: new Date(),
        budget,
      });

      toast.success('프로젝트가 성공적으로 생성되었습니다.');
      handleReset();
    } catch (error) {
      toast.error('프로젝트 생성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      manager: '',
      announcementNumber: '',
      maxBidAmount: '',
      startDate: '',
      endDate: '',
    });
    setBudget(null);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">프로젝트 초안 발행</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="담당자명"
            type="text"
            name="manager"
            id="manager"
            required
            value={formData.manager}
            onChange={handleChange}
            error={errors.manager}
          />

          <Input
            label="공고번호"
            type="text"
            name="announcementNumber"
            id="announcementNumber"
            required
            value={formData.announcementNumber}
            onChange={handleChange}
            error={errors.announcementNumber}
          />

          <Input
            label="최대 입찰 금액"
            type="number"
            name="maxBidAmount"
            id="maxBidAmount"
            required
            value={formData.maxBidAmount}
            onChange={handleChange}
            suffix="원"
            error={errors.maxBidAmount}
          />

          <Input
            label="계약 시작일"
            type="date"
            name="startDate"
            id="startDate"
            required
            value={formData.startDate}
            onChange={handleChange}
            error={errors.startDate}
          />

          <Input
            label="계약 마감일"
            type="date"
            name="endDate"
            id="endDate"
            required
            value={formData.endDate}
            onChange={handleChange}
            error={errors.endDate}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={handleReset}
          disabled={isSubmitting}
        >
          초기화
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          초안 발행
        </Button>
      </div>

      <BudgetResult budget={budget} />
    </form>
  );
}

export default ProjectForm;