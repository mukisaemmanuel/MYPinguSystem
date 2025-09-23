import type { DailySummary } from "@/lib/types";

interface DailySummaryProps {
  summary: DailySummary;
}

export default function DailySummary({ summary }: DailySummaryProps) {
  return (
    <section className="glass-effect rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4 gradient-text">Today's Progress</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary" data-testid="text-completed-quests">
            {summary.completedQuests}
          </div>
          <div className="text-xs text-muted-foreground">Quests Done</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent" data-testid="text-xp-gained">
            +{summary.xpGained}
          </div>
          <div className="text-xs text-muted-foreground">XP Gained</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-chart-3" data-testid="text-active-streak">
            {summary.activeStreak}
          </div>
          <div className="text-xs text-muted-foreground">Day Streak</div>
        </div>
      </div>
    </section>
  );
}
