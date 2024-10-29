import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useProject } from '../../context/ProjectContext';
import { formatNumber, formatDate } from '../../utils/formatters';

function Reports() {
  const { projects, pos } = useProject();
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredProjects = projects.filter(project => {
    const matchesStatus = statusFilter === 'all' ? true :
                         statusFilter === project.status;
    
    const projectDate = new Date(project.createdAt);
    const matchesDate = (!dateRange.start || projectDate >= new Date(dateRange.start)) &&
                       (!dateRange.end || projectDate <= new Date(dateRange.end));
    
    return matchesStatus && matchesDate;
  });

  const handleExportExcel = () => {
    const data = filteredProjects.map(project => {
      const projectPOs = pos.filter(po => po.projectId === project.id);
      const usedBudget = projectPOs.reduce((sum, po) => sum + po.amount, 0);
      const remainingBudget = (project.budget?.availableBudget || 0) - usedBudget;

      return {
        '프로젝트 번호': project.projectNumber,
        '담당자': project.manager,
        '총 예산': project.budget?.availableBudget || 0,
        '사용 예산': usedBudget,
        '잔여 예산': remainingBudget,
        '상태': project.status === 'active' ? '진행중' : '완료',
        '생성일': formatDate(project.createdAt)
      };
    });

    const worksheet = window.XLSX.utils.json_to_sheet(data);
    const workbook = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(workbook, worksheet, '프로젝트 예산 현황');
    window.XLSX.writeFile(workbook, '프로젝트_예산_현황.xlsx');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">리포트</h2>
        <Button onClick={handleExportExcel} className="inline-flex items-center">
          <Download className="h-4 w-4 mr-2" />
          엑셀 다운로드
        </Button>
      </div>

      <div className="flex gap-4 items-end">
        <div className="flex-1 grid grid-cols-2 gap-4">
          <Input
            label="시작일"
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
          />
          <Input
            label="종료일"
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
          />
        </div>
        <div className="w-48">
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'completed')}
          >
            <option value="all">전체 상태</option>
            <option value="active">진행중</option>
            <option value="completed">완료</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">프로젝트 예산 현황</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  프로젝트 번호
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  담당자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  총 예산
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  사용 예산
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  잔여 예산
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.map((project) => {
                const projectPOs = pos.filter(po => po.projectId === project.id);
                const usedBudget = projectPOs.reduce((sum, po) => sum + po.amount, 0);
                const remainingBudget = (project.budget?.availableBudget || 0) - usedBudget;

                return (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.projectNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.manager}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatNumber(project.budget?.availableBudget || 0)}원
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatNumber(usedBudget)}원
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatNumber(remainingBudget)}원
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${project.status === 'active' ? 'bg-green-100 text-green-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {project.status === 'active' ? '진행중' : '완료'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;