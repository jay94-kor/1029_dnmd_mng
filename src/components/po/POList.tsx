import React from 'react';
import { formatNumber, formatDate } from '../../utils/formatters';

// 임시 데이터
const mockPOs = [
  {
    id: '1',
    projectId: 'PRJ-001',
    poNumber: 'PO-2024-001',
    amount: 50000000,
    paymentType: '선금',
    expectedPaymentDate: new Date('2024-04-01'),
    status: '미지급',
  },
  {
    id: '2',
    projectId: 'PRJ-001',
    poNumber: 'PO-2024-002',
    amount: 50000000,
    paymentType: '잔금',
    expectedPaymentDate: new Date('2024-06-01'),
    status: '미지급',
  },
];

function POList() {
  return (
    <div className="mt-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PO 번호
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                프로젝트 ID
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                금액
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                구분
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                지급 예정일
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockPOs.map((po) => (
              <tr key={po.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {po.poNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {po.projectId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatNumber(po.amount)}원
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {po.paymentType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(po.expectedPaymentDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    {po.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default POList;