import React from 'react';
import * as LucideIcons from 'lucide-react';
import { AgentType } from '../types';
import { AGENTS_MAP } from '../constants';

interface IconRendererProps {
  agentType: AgentType;
  className?: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ agentType, className }) => {
  const config = AGENTS_MAP[agentType] || AGENTS_MAP['UNKNOWN'];
  const IconComponent = (LucideIcons as any)[config.icon];

  if (!IconComponent) {
    return <LucideIcons.Terminal className={className} />;
  }

  return <IconComponent className={className} />;
};