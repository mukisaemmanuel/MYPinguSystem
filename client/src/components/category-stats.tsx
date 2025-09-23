import type { Category } from "@shared/schema";

interface CategoryStatsProps {
  categories: Category[];
}

const categoryColors: Record<string, string> = {
  Health: "chart-1",
  Work: "chart-2", 
  Personal: "chart-3",
  Study: "chart-4",
};

export default function CategoryStats({ categories }: CategoryStatsProps) {
  if (categories.length === 0) {
    return (
      <section className="glass-effect rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Category Stats</h2>
        <p className="text-muted-foreground text-center">No category data available yet.</p>
      </section>
    );
  }

  return (
    <section className="glass-effect rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Category Stats</h2>
      <div className="space-y-3">
        {categories.map((category) => {
          const colorClass = categoryColors[category.name] || "muted";
          return (
            <div key={category.id} className="flex items-center justify-between" data-testid={`category-stat-${category.name.toLowerCase()}`}>
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 bg-${colorClass} rounded-full`}></div>
                <span className="font-medium" data-testid="text-category-name">{category.name}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold" data-testid="text-category-xp">{category.totalXP} XP</div>
                <div className="text-xs text-muted-foreground" data-testid="text-category-quest-count">{category.questCount} quests</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
