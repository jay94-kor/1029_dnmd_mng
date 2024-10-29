import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import { AreaChart, Card, Title, Text } from '@tremor/react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { mockProjects, mockPOs } from '../../data/mockData';
import { formatNumber } from '../../utils/formatters';

const chartdata = [
  { date: '2024-01', '예산 집행률': 65 },
  { date: '2024-02', '예산 집행률': 75 },
  { date: '2024-03', '예산 집행률': 85 },
];

function Dashboard() {
  const activeProjects = mockProjects.filter(p => p.status === 'active');
  const pendingPOs = mockPOs.filter(po => po.status === 'pending');
  
  const totalBudget = activeProjects.reduce((sum, p) => sum + (p.budget?.availableBudget || 0), 0);
  const usedBudget = mockPOs.reduce((sum, po) => sum + po.supplyAmount, 0);
  const budgetUsageRate = Math.round((usedBudget / totalBudget) * 100);

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">진행 중인 프로젝트</h3>
              <p className="text-3xl font-semibold text-indigo-600">{activeProjects.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-50 to-white p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">이번 달 예산 집행률</h3>
              <p className="text-3xl font-semibold text-green-600">{budgetUsageRate}%</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">미지급 PO</h3>
              <p className="text-3xl font-semibold text-yellow-600">{pendingPOs.length}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Title>월별 예산 집행 추이</Title>
          <AreaChart
            className="h-72 mt-4"
            data={chartdata}
            index="date"
            categories={['예산 집행률']}
            colors={['indigo']}
            valueFormatter={(value) => `${value}%`}
          />
        </Card>

        <Card>
          <Title>최근 프로젝트 현황</Title>
          <div className="mt-4">
            {activeProjects.slice(0, 3).map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 border-b border-gray-100"
              >
                <div>
                  <Text className="font-medium">{project.projectNumber}</Text>
                  <Text className="text-gray-500">{project.manager}</Text>
                </div>
                <div className="text-right">
                  <Text className="font-medium">
                    {formatNumber(project.budget?.availableBudget || 0)}원
                  </Text>
                  <Text className="text-gray-500">
                    {format(project.endDate, 'yyyy년 MM월 dd일', { locale: ko })} 마감
                  </Text>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;