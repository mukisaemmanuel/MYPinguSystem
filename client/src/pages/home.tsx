import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { User, Quest, Reward, Achievement, Category } from "@shared/schema";
import UserHeader from "@/components/user-header";
import DailySummary from "@/components/daily-summary";
import QuestCard from "@/components/quest-card";
import CreateQuestModal from "@/components/create-quest-modal";
import CategoryStats from "@/components/category-stats";
import RewardsSection from "@/components/rewards-section";
import Achievements from "@/components/achievements";
import BottomNavigation from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { QuestCategory } from "@/lib/types";
import HabitSuggestion from "@/components/habit-suggestion";

export default function Home() {
  const [activeTab, setActiveTab] = useState("quests");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCreateQuestOpen, setIsCreateQuestOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);

  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const { data: quests = [], isLoading: questsLoading } = useQuery<Quest[]>({
    queryKey: ["/api/quests"],
  });

  const { data: rewards = [] } = useQuery<Reward[]>({
    queryKey: ["/api/rewards"],
  });

  const { data: achievements = [] } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const filteredQuests = quests.filter(quest => 
    selectedCategory === "all" || quest.category === selectedCategory
  );

  const activeQuests = filteredQuests.filter(quest => quest.status === "active");
  const completedQuests = filteredQuests.filter(quest => quest.status === "completed");

  const dailySummary = {
    completedQuests: completedQuests.length,
    xpGained: completedQuests.reduce((total, quest) => total + quest.xp, 0),
    activeStreak: user?.streak || 0
  };

  // Example: infer habits from completed quest categories
  const habitCategories = Array.from(new Set(completedQuests.map(q => q.category)));

  if (userLoading || questsLoading) {
    return (
      <div className="max-w-md mx-auto bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your RPG world...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Failed to load user data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none"></div>
      
      {/* Header */}
      <UserHeader user={user} />

      {/* Main Content */}
      <main className="relative z-10 p-4 pb-20 space-y-6">
        {activeTab === "quests" && (
          <>
            {/* Daily Summary */}
            <DailySummary summary={dailySummary} />

            {/* Quest Suggestions based on user habits */}
            <HabitSuggestion habits={habitCategories} onSuggestQuest={(quest) => setIsCreateQuestOpen(true)} />

            {/* Quest Management */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Active Quests</h2>
                <Button 
                  onClick={() => setIsCreateQuestOpen(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid="button-create-quest"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Quest
                </Button>
              </div>

              {/* Category Filter */}
              <div className="flex space-x-2 mb-4 overflow-x-auto">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === "all" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                  data-testid="filter-category-all"
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                      selectedCategory === category.name 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                    data-testid={`filter-category-${category.name.toLowerCase()}`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Quest List */}
              <div className="space-y-3">
                {activeQuests.map((quest) => (
                  <QuestCard 
                    key={quest.id} 
                    quest={quest} 
                    onEdit={(quest) => {
                      setEditingQuest(quest);
                      setIsCreateQuestOpen(true);
                    }}
                  />
                ))}
                
                {completedQuests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}

                {filteredQuests.length === 0 && (
                  <div className="glass-effect rounded-lg p-8 text-center">
                    <div className="text-4xl mb-4">⚔️</div>
                    <h3 className="font-semibold mb-2">No Quests Available</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {selectedCategory === "all" 
                        ? "Create your first quest to start your RPG journey!"
                        : `No quests in the ${selectedCategory} category yet.`}
                    </p>
                    <Button 
                      onClick={() => setIsCreateQuestOpen(true)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      data-testid="button-create-first-quest"
                    >
                      Create Quest
                    </Button>
                  </div>
                )}
              </div>
            </section>

            {/* Category Stats */}
            <CategoryStats categories={categories} />
          </>
        )}

        {activeTab === "rewards" && <RewardsSection rewards={rewards} />}
        {activeTab === "achievements" && <Achievements achievements={achievements} />}
        {activeTab === "stats" && (
          <div className="glass-effect rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4 gradient-text">Player Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total XP Earned</span>
                <span className="font-bold text-accent">{user.totalXP}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Level</span>
                <span className="font-bold text-primary">{user.level}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Streak</span>
                <span className="font-bold text-destructive">{user.streak} days</span>
              </div>
              <div className="flex justify-between">
                <span>Total Quests</span>
                <span className="font-bold">{quests.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed Quests</span>
                <span className="font-bold text-primary">{completedQuests.length}</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsCreateQuestOpen(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full shadow-lg flex items-center justify-center text-black font-bold text-xl hover:scale-110 transition-transform z-40"
        data-testid="button-floating-create-quest"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Create Quest Modal */}
      <CreateQuestModal 
        isOpen={isCreateQuestOpen} 
        onClose={() => {
          setIsCreateQuestOpen(false);
          setEditingQuest(null);
        }} 
        editQuest={editingQuest}
      />
    </div>
  );
}
