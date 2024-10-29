import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Filter, Search, TrendingUp } from 'lucide-react';
import { Card, Title } from '@tremor/react';
import { useProject } from '../../context/ProjectContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { formatNumber } from '../../utils/formatters';

function BudgetManagement() {
  const { projects, pos } = useProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.projectNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' ? true :
                         filterStatus === 'active' ? project.status === 'active' :
                         project.status === 'completed';
    return matchesSearch && matchesStatus;
  });

  const calculateProjectUsage = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project?.budget) return 0;
    
    const projectPOs = pos.filter(po => po.projectId === projectId);
    const usedBudget = projectPOs.reduce((sum, po) => sum + po.amount, 0);
    return (usedBudget / project.budget.availableBudget) * 100;
  };

  const handleExportExcel = () => {
    const data = filteredProjects.map(project => ({
      '프로젝트 번호': project.projectNumber,
      '담당자': project.manager,
      '총 예산': project.budget?.availableBudget || 0,
      '사용률': `${calculateProjectUsage(project.id).toFixed(1)}%`,
      '상태': project.status === 'active' ? '진행중' : '완료'
    }));

    const worksheet = window.XLSX.utils.json_to_sheet(data);
    const workbook = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(workbook, worksheet, '예산 현황');
    window.XLSX.writeFile(workbook, '예산현황.xlsx');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">예산 관리</h2>
        <Button onClick={handleExportExcel} className="inline-flex items-center">
          <Download className="h-4 w-4 mr-2" />
          엑셀 다운로드
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            label=""
            type="text"
            placeholder="프로젝트 번호 또는 담당자 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<Search className="h-4 w-4 text-gray-400" />}
          />
        </div>
        <div className="w-48">
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'completed')}
          >
            <option value="all">전체 상태</option>
            <option value="active">진행중</option>
            <option value="completed">완료</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredProjects.map((project) => {
          const usagePercentage = calculateProjectUsage(project.id);
          
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {project.projectNumber}
                    </h3>
                    <p className="text-sm text-gray-500">담당자: {project.manager}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${project.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {project.status === 'active' ? '진행중' : '완료'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">총 예산</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatNumber(project.budget?.availableBudget || 0)}원
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">사용 금액</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatNumber(
                        pos
                          .filter(po => po.projectId === project.id)
                          .reduce((sum, po) => sum + po.amount, 0)
                      )}원
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">예산 사용률</p>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className={`h-5 w-5 ${
                        usagePercentage > 90 ? 'text-red-500' :
                        usagePercentage > 70 ? 'text-yellow-500' :
                        'text-green-500'
                      }`} />
                      <p className="text-lg font-semibold text-gray-900">
                        {usagePercentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        usagePercentage > 90 ? 'bg-red-500' :
                        usagePercentage > 70 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default BudgetManagement;