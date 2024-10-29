import { Budget } from './budget';

export interface Project {
  id: string;
  projectNumber: string;
  manager: string;
  announcementNumber: string;
  maxBidAmount: number;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'completed';
  createdAt: Date;
  budget?: Budget;
}

export interface PO {
  id: string;
  projectId: string;
  poNumber: string;
  amount: number;
  invoiceType: '세금계산서' | '사업소득' | '기타소득' | '면세사업자';
  supplyAmount: number;
  taxAmount: number;
  deductionAmount: number;
  paymentType: '선금' | '잔금';
  status: 'pending' | 'paid';
  createdAt: Date;
}