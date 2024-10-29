import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Budget, BudgetParams, Project, PO } from '../types/project';
import { generateProjectNumber, generatePONumber } from '../utils/projectNumber';
import { db } from '../db/db';

interface ProjectContextType {
  projects: Project[];
  pos: PO[];
  currentProject: Project | null;
  addProject: (project: Omit<Project, 'id' | 'projectNumber'>) => Promise<void>;
  addPO: (po: Omit<PO, 'id' | 'poNumber'>) => Promise<void>;
  calculateBudget: (params: BudgetParams) => Budget;
  getProjectPOs: (projectId: string) => PO[];
  setCurrentProject: (project: Project | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  
  const projects = useLiveQuery(() => db.projects.toArray()) ?? [];
  const pos = useLiveQuery(() => db.pos.toArray()) ?? [];

  const addProject = async (projectData: Omit<Project, 'id' | 'projectNumber'>) => {
    const projectNumber = generateProjectNumber(projects.length);
    const newProject: Omit<Project, 'id'> = {
      projectNumber,
      ...projectData,
      status: 'draft',
      createdAt: new Date(),
    };
    
    await db.projects.add(newProject as Project);
  };

  const addPO = async (poData: Omit<PO, 'id' | 'poNumber'>) => {
    const projectPOs = pos.filter(po => po.projectId === poData.projectId);
    const poNumber = generatePONumber(poData.projectId, projectPOs.length);
    
    const newPO: Omit<PO, 'id'> = {
      poNumber,
      ...poData,
      status: 'pending',
      createdAt: new Date(),
    };
    
    await db.pos.add(newPO as PO);
  };

  const calculateBudget = ({ maxBidAmount, startDate, endDate }: BudgetParams): Budget => {
    const expectedBidAmount = maxBidAmount;
    const vatExcluded = Math.floor(expectedBidAmount / 1.1);
    const agencyFee = Math.floor(vatExcluded * 0.08);
    const companyMargin = Math.floor(vatExcluded * 0.10);
    
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const internalLaborRate = days * 0.00075;
    const internalLabor = Math.floor(vatExcluded * internalLaborRate);
    
    const availableBudget = Math.floor(vatExcluded - (agencyFee + companyMargin + internalLabor));

    return {
      expectedBidAmount,
      vatExcluded,
      agencyFee,
      companyMargin,
      internalLabor,
      internalLaborRate: internalLaborRate * 100,
      availableBudget,
    };
  };

  const getProjectPOs = (projectId: string) => {
    return pos.filter(po => po.projectId === projectId);
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      pos,
      currentProject,
      addProject,
      addPO,
      calculateBudget,
      getProjectPOs,
      setCurrentProject,
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}