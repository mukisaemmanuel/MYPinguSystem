import type { User } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { Settings, Flame, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "./theme-switcher";

interface UserHeaderProps {
  user: User;
}

export default function UserHeader({ user }: UserHeaderProps) {
  const xpProgress = ((user.currentXP || 0) / 500) * 100;
  const nextLevelXP = 500;

  return (
    <header className="relative z-10 p-4 border-b border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Character Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <UserRound className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-lg font-bold" data-testid="text-username">{user.username}</h1>
            <p className="text-sm text-muted-foreground">
              Level <span className="text-accent font-semibold" data-testid="text-level">{user.level}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Streak Counter */}
          <div className="flex items-center space-x-1 bg-destructive/20 px-3 py-1 rounded-full">
            <Flame className="w-4 h-4 text-destructive" />
            <span className="text-sm font-semibold" data-testid="text-streak">{user.streak}</span>
          </div>
          {/* Theme Switcher */}
          <ThemeSwitcher />
          {/* Settings */}
          <Button 
            variant="ghost" 
            size="icon"
            className="hover:bg-muted rounded-full"
            data-testid="button-settings"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* XP Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span>XP Progress</span>
          <span>
            <span data-testid="text-current-xp">{user.currentXP}</span> / <span data-testid="text-next-level-xp">{nextLevelXP}</span>
          </span>
        </div>
        <Progress 
          value={xpProgress} 
          className="h-3 progress-glow"
          data-testid="progress-xp"
        />
      </div>
    </header>
  );
}
