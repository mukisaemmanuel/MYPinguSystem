export type QuestCategory = "Health" | "Work" | "Personal" | "Study";

export interface DailySummary {
  completedQuests: number;
  xpGained: number;
  activeStreak: number;
}
