'use client';

import { Button } from '@/components/ui/button';
import { LadeCoderLogo } from '@/components/icons';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isVisible: boolean;
  onNewProject: () => void;
}

export function Header({ isVisible, onNewProject }: HeaderProps) {
  return (
    <header
      className={cn(
        'h-16 border-b px-4 items-center justify-between transition-opacity duration-500 md:hidden',
        isVisible ? 'flex' : 'hidden'
      )}
    >
      <div className="flex items-center gap-2">
        <LadeCoderLogo className="w-8 h-8" />
        <h2 className="text-lg font-semibold">Lade Coder</h2>
      </div>
      <Button variant="ghost" size="icon" onClick={onNewProject}>
        <Plus className="h-5 w-5" />
      </Button>
    </header>
  );
}
