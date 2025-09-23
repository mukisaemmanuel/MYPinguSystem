import { DatabaseStorage } from "./db-storage";

// Initialize database with seed data
export async function initializeDefaultData(storage: DatabaseStorage) {
  // Check if data already exists
  const hasData = await storage.hasUsers();
  if (hasData) {
    console.log("Database already initialized");
    return;
  }

  console.log("Initializing database with default data...");
  
  // Create default user
  const defaultUser = await storage.createUser({
    username: "Alex the Warrior",
    level: 12,
    currentXP: 340,
    totalXP: 2200,
    streak: 7,
    lastActiveDate: new Date().toISOString().split('T')[0]
  });

  // Create default categories
  const healthCategory = await storage.createCategory({
    userId: defaultUser.id,
    name: "Health",
    color: "chart-1",
    totalXP: 450,
    questCount: 12
  });

  const workCategory = await storage.createCategory({
    userId: defaultUser.id,
    name: "Work",
    color: "chart-2",
    totalXP: 820,
    questCount: 18
  });

  const personalCategory = await storage.createCategory({
    userId: defaultUser.id,
    name: "Personal",
    color: "chart-3",
    totalXP: 320,
    questCount: 8
  });

  const studyCategory = await storage.createCategory({
    userId: defaultUser.id,
    name: "Study",
    color: "chart-4",
    totalXP: 610,
    questCount: 15
  });

  // Create default quests
  await storage.createQuest({
    userId: defaultUser.id,
    title: "Morning Meditation",
    description: "20 minutes of mindfulness practice",
    xp: 20,
    timeEstimate: "20 min",
    category: "Health",
    status: "active"
  });

  await storage.createQuest({
    userId: defaultUser.id,
    title: "Complete React Project",
    description: "Finish the dashboard components and testing",
    xp: 50,
    timeEstimate: "2 hrs",
    category: "Work",
    status: "active"
  });

  await storage.createQuest({
    userId: defaultUser.id,
    title: "Read 30 Pages",
    description: "Continue reading \"Atomic Habits\"",
    xp: 25,
    timeEstimate: "45 min",
    category: "Personal",
    status: "active"
  });

  // Create default rewards
  await storage.createReward({
    userId: defaultUser.id,
    title: "Game Time",
    description: "1 hour of gaming",
    icon: "🎮",
    xpRequired: 100,
    unlocked: true,
    claimed: false
  });

  await storage.createReward({
    userId: defaultUser.id,
    title: "Movie Night",
    description: "Watch a favorite movie",
    icon: "🍿",
    streakRequired: 3,
    unlocked: true,
    claimed: false
  });

  await storage.createReward({
    userId: defaultUser.id,
    title: "Shopping Spree",
    description: "Need 200 more XP",
    icon: "🛍️",
    xpRequired: 500,
    unlocked: false,
    claimed: false
  });

  // Create default achievements
  await storage.createAchievement({
    userId: defaultUser.id,
    title: "Streak Master",
    description: "Completed 7 days in a row",
    icon: "🔥",
    xpReward: 100
  });

  await storage.createAchievement({
    userId: defaultUser.id,
    title: "Health Warrior",
    description: "Earned 500 XP in Health category",
    icon: "💪",
    xpReward: 75
  });

  console.log("Database initialization complete!");
}