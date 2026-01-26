/**
 * Avatar Component for ChatBubble
 */

import React from 'react';
import type { AvatarProps } from './types';

// Shared avatar component - defined OUTSIDE to prevent recreation
export const Avatar: React.FC<AvatarProps> = ({ avatar, size = 'normal' }) => {
  if (!avatar) return null;

  if (typeof avatar === 'string') {
    return size === 'small' ? (
      <span className="text-lg">{avatar}</span>
    ) : (
      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
        <span className="text-white text-sm font-bold">{avatar}</span>
      </div>
    );
  }

  return <>{avatar}</>;
};
