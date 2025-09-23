import type { Achievement } from "@shared/schema";
import { Card } from "@/components/ui/card";

interface AchievementsProps {
  achievements: Achievement[];
}

export default function Achievements({ achievements }: AchievementsProps) {
  const recentAchievements = achievements.slice(-5); // Show last 5 achievements

  return (
    <section className="glass-effect rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Recent Achievements</h2>
      
      {achievements.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="font-semibold mb-2">No Achievements Yet</h3>
          <p className="text-sm text-muted-foreground">
            Complete quests and maintain streaks to unlock achievements!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentAchievements.map((achievement) => (
            <Card key={achievement.id} className="bg-accent/10 border-accent/30 p-3" data-testid={`achievement-card-${achievement.id}`}>
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm" data-testid="text-achievement-title">{achievement.title}</h3>
                  <p className="text-xs text-muted-foreground" data-testid="text-achievement-description">{achievement.description}</p>
                </div>
                <div className="text-accent font-bold text-sm" data-testid="text-achievement-xp">+{achievement.xpReward} XP</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
