import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Lock, Building, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../common/Button';

interface SettingItem {
  id: string;
  label: string;
  enabled?: boolean;
  type?: 'toggle' | 'text';
  value?: string;
}

interface SettingSection {
  id: string;
  title: string;
  icon: any;
  description: string;
  items: SettingItem[];
}

function Settings() {
  const [settings, setSettings] = useState<SettingSection[]>([
    {
      id: 'notifications',
      title: '알림 설정',
      icon: Bell,
      description: '예산 초과, 지급 일정 등의 알림 설정을 관리합니다.',
      items: [
        { id: 'budget-alert', label: '예산 초과 알림', enabled: true, type: 'toggle' },
        { id: 'payment-alert', label: '지급 일정 알림', enabled: true, type: 'toggle' },
        { id: 'po-alert', label: 'PO 발행 알림', enabled: false, type: 'toggle' },
      ],
    },
    {
      id: 'security',
      title: '보안 설정',
      icon: Lock,
      description: '시스템 접근 권한 및 보안 설정을 관리합니다.',
      items: [
        { id: 'two-factor', label: '2단계 인증', enabled: false, type: 'toggle' },
        { id: 'session-timeout', label: '세션 타임아웃 (분)', value: '30', type: 'text' },
      ],
    },
    {
      id: 'company',
      title: '회사 정보',
      icon: Building,
      description: '기본 회사 정보 및 정책을 설정합니다.',
      items: [
        { id: 'company-name', label: '회사명', value: 'DNMD', type: 'text' },
        { id: 'tax-rate', label: '기본 부가세율 (%)', value: '10', type: 'text' },
      ],
    },
  ]);

  const handleToggle = (sectionId: string, itemId: string) => {
    setSettings(prevSettings => 
      prevSettings.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map(item => 
              item.id === itemId ? { ...item, enabled: !item.enabled } : item
            )
          };
        }
        return section;
      })
    );
  };

  const handleTextChange = (sectionId: string, itemId: string, value: string) => {
    setSettings(prevSettings => 
      prevSettings.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map(item => 
              item.id === itemId ? { ...item, value } : item
            )
          };
        }
        return section;
      })
    );
  };

  const handleSave = () => {
    // Here you would typically save to your backend
    toast.success('설정이 저장되었습니다.');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <SettingsIcon className="h-6 w-6 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900">시스템 설정</h2>
        </div>
        <Button onClick={handleSave} className="inline-flex items-center">
          <Save className="h-4 w-4 mr-2" />
          저장
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {settings.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                </div>
                <p className="mt-1 text-sm text-gray-500">{section.description}</p>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {section.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{item.label}</span>
                      {item.type === 'toggle' ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={item.enabled}
                            onChange={() => handleToggle(section.id, item.id)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      ) : (
                        <input
                          type="text"
                          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm w-32"
                          value={item.value}
                          onChange={(e) => handleTextChange(section.id, item.id, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Settings;