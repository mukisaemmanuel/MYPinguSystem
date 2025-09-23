import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Reward } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Lock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RewardsSectionProps {
  rewards: Reward[];
}

export default function RewardsSection({ rewards }: RewardsSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const claimMutation = useMutation({
    mutationFn: async (rewardId: string) => {
      return apiRequest("PATCH", `/api/rewards/${rewardId}/claim`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rewards"] });
      toast({
        title: "Reward Claimed! 🎉",
        description: "Enjoy your well-earned reward!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to claim reward. Please try again.",
        variant: "destructive"
      });
    },
  });

  const unlockedRewards = rewards.filter(r => r.unlocked && !r.claimed);
  const lockedRewards = rewards.filter(r => !r.unlocked);

  return (
    <section className="glass-effect rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Available Rewards</h2>
      
      {rewards.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎁</div>
          <h3 className="font-semibold mb-2">No Rewards Yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create some rewards to motivate yourself!
          </p>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90" data-testid="button-create-first-reward">
            <Plus className="w-4 h-4 mr-2" />
            Create Reward
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Unlocked Rewards */}
            {unlockedRewards.map((reward) => (
              <Card key={reward.id} className="bg-accent/10 border-accent/30 p-3 text-center" data-testid={`reward-card-${reward.id}`}>
                <div className="text-2xl mb-2">{reward.icon}</div>
                <h3 className="font-semibold text-sm mb-1" data-testid="text-reward-title">{reward.title}</h3>
                <p className="text-xs text-muted-foreground mb-2" data-testid="text-reward-description">{reward.description}</p>
                <Button 
                  onClick={() => claimMutation.mutate(reward.id)}
                  disabled={claimMutation.isPending}
                  className="bg-accent text-accent-foreground px-3 py-1 rounded text-xs font-semibold hover:bg-accent/90 transition-colors w-full"
                  data-testid="button-claim-reward"
                >
                  {claimMutation.isPending ? "Claiming..." : "Claim"}
                </Button>
              </Card>
            ))}

            {/* Locked Rewards */}
            {lockedRewards.map((reward) => (
              <Card key={reward.id} className="bg-muted/20 border-muted p-3 text-center opacity-50" data-testid={`locked-reward-card-${reward.id}`}>
                <div className="text-2xl mb-2">{reward.icon}</div>
                <h3 className="font-semibold text-sm mb-1" data-testid="text-locked-reward-title">{reward.title}</h3>
                <p className="text-xs text-muted-foreground mb-2" data-testid="text-locked-reward-description">
                  {reward.xpRequired && `Need ${reward.xpRequired} XP`}
                  {reward.streakRequired && `Need ${reward.streakRequired}-day streak`}
                </p>
                <div className="bg-muted text-muted-foreground px-3 py-1 rounded text-xs w-full flex items-center justify-center">
                  <Lock className="w-3 h-3 mr-1" />
                  Locked
                </div>
              </Card>
            ))}
          </div>

          <Button 
            variant="outline"
            className="w-full border-border text-muted-foreground hover:bg-muted/20 transition-colors"
            data-testid="button-create-reward"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Reward
          </Button>
        </>
      )}
    </section>
  );
}
