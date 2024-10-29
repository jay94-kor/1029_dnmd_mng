import React, { useState } from 'react';
import { User, UserPlus, Shield, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface UserData {
  id: number;
  name: string;
  role: string;
  department: string;
  lastLogin: string;
}

const mockUsers = [
  { id: 1, name: '김철수', role: '관리자', department: '경영지원팀', lastLogin: '2024-03-15 14:30' },
  { id: 2, name: '이영희', role: '프로젝트 관리자', department: '기획팀', lastLogin: '2024-03-15 11:20' },
  { id: 3, name: '박지민', role: '일반 사용자', department: '개발팀', lastLogin: '2024-03-14 17:45' },
];

function Users() {
  const [users, setUsers] = useState<UserData[]>(mockUsers);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    department: '',
    role: '일반 사용자'
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.department) {
      toast.error('모든 필드를 입력해주세요.');
      return;
    }

    const user: UserData = {
      id: users.length + 1,
      name: newUser.name,
      department: newUser.department,
      role: newUser.role,
      lastLogin: '-'
    };

    setUsers([...users, user]);
    setShowAddUser(false);
    setNewUser({ name: '', department: '', role: '일반 사용자' });
    toast.success('사용자가 추가되었습니다.');
  };

  const handleUpdateRole = (userId: number, newRole: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
    toast.success('권한이 업데이트되었습니다.');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">사용자 관리</h2>
        <Button 
          className="inline-flex items-center"
          onClick={() => setShowAddUser(true)}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          사용자 추가
        </Button>
      </div>

      {showAddUser && (
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">새 사용자 추가</h3>
            <button
              onClick={() => setShowAddUser(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="이름"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <Input
              label="부서"
              value={newUser.department}
              onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                권한
              </label>
              <select
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="일반 사용자">일반 사용자</option>
                <option value="프로젝트 관리자">프로젝트 관리자</option>
                <option value="관리자">관리자</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <Button variant="secondary" onClick={() => setShowAddUser(false)}>
              취소
            </Button>
            <Button onClick={handleAddUser}>
              추가
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  사용자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  부서
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  권한
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  최근 접속
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-indigo-500 mr-2" />
                      <span className="text-sm text-gray-900">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <select
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                    >
                      <option value="일반 사용자">일반 사용자</option>
                      <option value="프로젝트 관리자">프로젝트 관리자</option>
                      <option value="관리자">관리자</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Users;