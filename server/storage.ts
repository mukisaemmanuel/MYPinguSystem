import { 
  type User, 
  type InsertUser,
  type Quest,
  type InsertQuest,
  type Reward,
  type InsertReward,
  type Achievement,
  type InsertAchievement,
  type Category,
  type InsertCategory
} from "@shared/schema";
import { DatabaseStorage } from "./db-storage";
import { initializeDefaultData } from "./db-init";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Quest methods
  getQuests(userId: string): Promise<Quest[]>;
  getQuest(id: string): Promise<Quest | undefined>;
  createQuest(quest: InsertQuest): Promise<Quest>;
  updateQuest(id: string, updates: Partial<Quest>): Promise<Quest | undefined>;
  deleteQuest(id: string): Promise<boolean>;
  getQuestsByCategory(userId: string, category: string): Promise<Quest[]>;

  // Reward methods
  getRewards(userId: string): Promise<Reward[]>;
  createReward(reward: InsertReward): Promise<Reward>;
  updateReward(id: string, updates: Partial<Reward>): Promise<Reward | undefined>;
  deleteReward(id: string): Promise<boolean>;

  // Achievement methods
  getAchievements(userId: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;

  // Category methods
  getCategories(userId: string): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, updates: Partial<Category>): Promise<Category | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private quests: Map<string, Quest>;
  private rewards: Map<string, Reward>;
  private achievements: Map<string, Achievement>;
  private categories: Map<string, Category>;

  constructor() {
    this.users = new Map();
    this.quests = new Map();
    this.rewards = new Map();
    this.achievements = new Map();
    this.categories = new Map();
    
    // Initialize with default user and data
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    // Create default user
    const defaultUser = await this.createUser({
      username: "Alex the Warrior",
      level: 12,
      currentXP: 340,
      totalXP: 2200,
      streak: 7,
      lastActiveDate: new Date().toISOString().split('T')[0]
    });

    // Create default categories
    const healthCategory = await this.createCategory({
      userId: defaultUser.id,
      name: "Health",
      color: "chart-1",
      totalXP: 450,
      questCount: 12
    });

    const workCategory = await this.createCategory({
      userId: defaultUser.id,
      name: "Work",
      color: "chart-2",
      totalXP: 820,
      questCount: 18
    });

    const personalCategory = await this.createCategory({
      userId: defaultUser.id,
      name: "Personal",
      color: "chart-3",
      totalXP: 320,
      questCount: 8
    });

    const studyCategory = await this.createCategory({
      userId: defaultUser.id,
      name: "Study",
      color: "chart-4",
      totalXP: 610,
      questCount: 15
    });

    // Create default quests
    await this.createQuest({
      userId: defaultUser.id,
      title: "Morning Meditation",
      description: "20 minutes of mindfulness practice",
      xp: 20,
      timeEstimate: "20 min",
      category: "Health",
      status: "active"
    });

    await this.createQuest({
      userId: defaultUser.id,
      title: "Complete React Project",
      description: "Finish the dashboard components and testing",
      xp: 50,
      timeEstimate: "2 hrs",
      category: "Work",
      status: "active"
    });

    await this.createQuest({
      userId: defaultUser.id,
      title: "Read 30 Pages",
      description: "Continue reading \"Atomic Habits\"",
      xp: 25,
      timeEstimate: "45 min",
      category: "Personal",
      status: "active"
    });

    // Create default rewards
    await this.createReward({
      userId: defaultUser.id,
      title: "Game Time",
      description: "1 hour of gaming",
      icon: "🎮",
      xpRequired: 100,
      unlocked: true,
      claimed: false
    });

    await this.createReward({
      userId: defaultUser.id,
      title: "Movie Night",
      description: "Watch a favorite movie",
      icon: "🍿",
      streakRequired: 3,
      unlocked: true,
      claimed: false
    });

    await this.createReward({
      userId: defaultUser.id,
      title: "Shopping Spree",
      description: "Need 200 more XP",
      icon: "🛍️",
      xpRequired: 500,
      unlocked: false,
      claimed: false
    });

    // Create default achievements
    await this.createAchievement({
      userId: defaultUser.id,
      title: "Streak Master",
      description: "Completed 7 days in a row",
      icon: "🔥",
      xpReward: 100
    });

    await this.createAchievement({
      userId: defaultUser.id,
      title: "Health Warrior",
      description: "Earned 500 XP in Health category",
      icon: "💪",
      xpReward: 75
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id,
      username: insertUser.username,
      level: insertUser.level ?? 1,
      currentXP: insertUser.currentXP ?? 0,
      totalXP: insertUser.totalXP ?? 0,
      streak: insertUser.streak ?? 0,
      lastActiveDate: insertUser.lastActiveDate ?? null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Quest methods
  async getQuests(userId: string): Promise<Quest[]> {
    return Array.from(this.quests.values()).filter(
      (quest) => quest.userId === userId
    );
  }

  async getQuest(id: string): Promise<Quest | undefined> {
    return this.quests.get(id);
  }

  async createQuest(insertQuest: InsertQuest): Promise<Quest> {
    const id = randomUUID();
    const quest: Quest = {
      id,
      userId: insertQuest.userId,
      title: insertQuest.title,
      description: insertQuest.description ?? null,
      xp: insertQuest.xp ?? 20,
      timeEstimate: insertQuest.timeEstimate ?? null,
      category: insertQuest.category,
      status: insertQuest.status ?? "active",
      createdAt: new Date(),
      completedAt: null
    };
    this.quests.set(id, quest);
    return quest;
  }

  async updateQuest(id: string, updates: Partial<Quest>): Promise<Quest | undefined> {
    const quest = this.quests.get(id);
    if (!quest) return undefined;
    
    const updatedQuest = { ...quest, ...updates };
    this.quests.set(id, updatedQuest);
    return updatedQuest;
  }

  async deleteQuest(id: string): Promise<boolean> {
    return this.quests.delete(id);
  }

  async getQuestsByCategory(userId: string, category: string): Promise<Quest[]> {
    return Array.from(this.quests.values()).filter(
      (quest) => quest.userId === userId && quest.category === category
    );
  }

  // Reward methods
  async getRewards(userId: string): Promise<Reward[]> {
    return Array.from(this.rewards.values()).filter(
      (reward) => reward.userId === userId
    );
  }

  async createReward(insertReward: InsertReward): Promise<Reward> {
    const id = randomUUID();
    const reward: Reward = {
      id,
      userId: insertReward.userId,
      title: insertReward.title,
      description: insertReward.description ?? null,
      icon: insertReward.icon ?? "🎁",
      xpRequired: insertReward.xpRequired ?? null,
      streakRequired: insertReward.streakRequired ?? null,
      unlocked: insertReward.unlocked ?? false,
      claimed: insertReward.claimed ?? false,
      createdAt: new Date()
    };
    this.rewards.set(id, reward);
    return reward;
  }

  async updateReward(id: string, updates: Partial<Reward>): Promise<Reward | undefined> {
    const reward = this.rewards.get(id);
    if (!reward) return undefined;
    
    const updatedReward = { ...reward, ...updates };
    this.rewards.set(id, updatedReward);
    return updatedReward;
  }

  async deleteReward(id: string): Promise<boolean> {
    return this.rewards.delete(id);
  }

  // Achievement methods
  async getAchievements(userId: string): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(
      (achievement) => achievement.userId === userId
    );
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = randomUUID();
    const achievement: Achievement = {
      id,
      userId: insertAchievement.userId,
      title: insertAchievement.title,
      description: insertAchievement.description ?? null,
      icon: insertAchievement.icon ?? "🏆",
      xpReward: insertAchievement.xpReward ?? 0,
      unlockedAt: new Date()
    };
    this.achievements.set(id, achievement);
    return achievement;
  }

  // Category methods
  async getCategories(userId: string): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(
      (category) => category.userId === userId
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = {
      id,
      userId: insertCategory.userId,
      name: insertCategory.name,
      color: insertCategory.color,
      totalXP: insertCategory.totalXP ?? 0,
      questCount: insertCategory.questCount ?? 0
    };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...updates };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }
}

// Create database storage instance
export const storage = new DatabaseStorage();

// Initialize with default data on startup
initializeDefaultData(storage).catch(console.error);
