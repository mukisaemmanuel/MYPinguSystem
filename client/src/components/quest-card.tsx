import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Quest } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreVertical, Check } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface QuestCardProps {
  quest: Quest;
}

const categoryColors: Record<string, string> = {
  Health: "chart-1",
  Work: "chart-2", 
  Personal: "chart-3",
  Study: "chart-4",
};

export default function QuestCard({ quest }: QuestCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const completeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PATCH", `/api/quests/${quest.id}`, {
        status: "completed",
        completedAt: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/achievements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rewards"] });
      
      toast({
        title: "Quest Completed! 🎉",
        description: `You earned ${quest.xp} XP!`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete quest. Please try again.",
        variant: "destructive"
      });
    },
  });

  const handleComplete = async () => {
    if (quest.status === "completed") return;
    
    setIsCompleting(true);
    await completeMutation.mutateAsync();
    setIsCompleting(false);
  };

  const isCompleted = quest.status === "completed";
  const categoryColor = categoryColors[quest.category] || "muted";

  return (
    <Card className={`quest-card cursor-pointer transition-all duration-200 ${
      isCompleted 
        ? "bg-primary/10 border-primary/30 opacity-75" 
        : "bg-card border-border hover:shadow-lg"
    }`} data-testid={`quest-card-${quest.id}`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className={`font-semibold mb-1 ${isCompleted ? "line-through" : ""}`} data-testid="text-quest-title">
              {quest.title}
            </h3>
            <p className="text-sm text-muted-foreground" data-testid="text-quest-description">
              {quest.description}
            </p>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <span 
              className={`bg-${categoryColor}/20 text-${categoryColor} px-2 py-1 rounded text-xs`}
              data-testid="text-quest-category"
            >
              {quest.category}
            </span>
            <div className="text-right">
              <div className={`font-bold text-sm ${isCompleted ? "text-primary" : "text-accent"}`} data-testid="text-quest-xp">
                {isCompleted ? "✓ " : "+"}
                {quest.xp} XP
              </div>
              {quest.timeEstimate && (
                <div className="text-xs text-muted-foreground" data-testid="text-quest-time">
                  {isCompleted ? "Completed" : quest.timeEstimate}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isCompleted ? (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <Check className="w-4 h-4 text-background" />
                </div>
                <span className="text-sm text-primary font-semibold">Quest Complete!</span>
              </div>
            ) : (
              <>
                <Checkbox
                  checked={false}
                  onCheckedChange={handleComplete}
                  disabled={isCompleting || completeMutation.isPending}
                  className="border-primary data-[state=checked]:bg-primary"
                  data-testid="checkbox-complete-quest"
                />
                <span className="text-sm text-muted-foreground">
                  {isCompleting || completeMutation.isPending ? "Completing..." : "Mark as complete"}
                </span>
              </>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-muted-foreground hover:text-foreground h-8 w-8"
            data-testid="button-quest-menu"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
