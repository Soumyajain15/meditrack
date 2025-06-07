import type React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import LogoIcon from '@/components/icons/logo';

interface PageHeaderProps {
  onAddPatient: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onAddPatient }) => {
  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-card shadow-sm rounded-lg">
      <div className="flex items-center gap-3">
        <LogoIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-headline font-semibold text-primary">MediTrack</h1>
      </div>
      <Button onClick={onAddPatient} className="font-semibold">
        <PlusCircle className="mr-2 h-5 w-5" /> Add New Patient
      </Button>
    </div>
  );
};

export default PageHeader;
