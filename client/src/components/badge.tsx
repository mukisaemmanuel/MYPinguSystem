import React from "react";

interface BadgeProps {
  icon: string;
  title: string;
  description?: string;
  xpReward?: number;
}

export default function Badge({ icon, title, description, xpReward }: BadgeProps) {
  return (
    <div className="flex items-center space-x-3 bg-accent/10 border border-accent/30 rounded-lg p-2">
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <span className="font-semibold text-sm">{title}</span>
        {description && <span className="block text-xs text-muted-foreground">{description}</span>}
      </div>
      {xpReward !== undefined && (
        <span className="text-accent font-bold text-sm">+{xpReward} XP</span>
      )}
    </div>
  );
}
