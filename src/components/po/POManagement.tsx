import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../common/Button';
import POList from './POList';
import POForm from './POForm';

function POManagement() {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">PO 관리</h2>
        <Button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          신규 PO 발행
        </Button>
      </div>

      {isCreating ? (
        <POForm onCancel={() => setIsCreating(false)} />
      ) : (
        <POList />
      )}
    </div>
  );
}

export default POManagement;