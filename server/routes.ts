import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuestSchema, insertRewardSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user (for MVP, we'll use the default user)
  app.get("/api/user", async (req, res) => {
    try {
      const allUsers = Array.from((storage as any).users.values());
      const user = allUsers[0]; // Get first user for MVP
      if (!user) {
        return res.status(404).json({ message: "No users found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user
  app.patch("/api/user/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.updateUser(id, req.body);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Get all quests for user
  app.get("/api/quests", async (req, res) => {
    try {
      const allUsers = Array.from((storage as any).users.values());
      const userId = allUsers[0]?.id;
      if (!userId) {
        return res.status(404).json({ message: "User not found" });
      }
      const quests = await storage.getQuests(userId);
      res.json(quests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quests" });
    }
  });

  // Create quest
  app.post("/api/quests", async (req, res) => {
    try {
      const allUsers = Array.from((storage as any).users.values());
      const userId = allUsers[0]?.id;
      if (!userId) {
        return res.status(404).json({ message: "User not found" });
      }

      const validatedData = insertQuestSchema.parse({
        ...req.body,
        userId
      });
      
      const quest = await storage.createQuest(validatedData);
      res.status(201).json(quest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid quest data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create quest" });
    }
  });

  // Update quest (for completion, editing, etc.)
  app.patch("/api/quests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const quest = await storage.updateQuest(id, req.body);
      if (!quest) {
        return res.status(404).json({ message: "Quest not found" });
      }

      // If quest is being completed, update user XP and check for achievements
      if (req.body.status === "completed" && req.body.completedAt) {
        await handleQuestCompletion(quest);
      }

      res.json(quest);
    } catch (error) {
      res.status(500).json({ message: "Failed to update quest" });
    }
  });

  // Delete quest
  app.delete("/api/quests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteQuest(id);
      if (!success) {
        return res.status(404).json({ message: "Quest not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete quest" });
    }
  });

  // Get rewards for user
  app.get("/api/rewards", async (req, res) => {
    try {
      const allUsers = Array.from((storage as any).users.values());
      const userId = allUsers[0]?.id;
      if (!userId) {
        return res.status(404).json({ message: "User not found" });
      }
      const rewards = await storage.getRewards(userId);
      res.json(rewards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rewards" });
    }
  });

  // Create reward
  app.post("/api/rewards", async (req, res) => {
    try {
      const allUsers = Array.from((storage as any).users.values());
      const userId = allUsers[0]?.id;
      if (!userId) {
        return res.status(404).json({ message: "User not found" });
      }

      const validatedData = insertRewardSchema.parse({
        ...req.body,
        userId
      });
      
      const reward = await storage.createReward(validatedData);
      res.status(201).json(reward);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid reward data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create reward" });
    }
  });

  // Claim reward
  app.patch("/api/rewards/:id/claim", async (req, res) => {
    try {
      const { id } = req.params;
      const reward = await storage.updateReward(id, { claimed: true });
      if (!reward) {
        return res.status(404).json({ message: "Reward not found" });
      }
      res.json(reward);
    } catch (error) {
      res.status(500).json({ message: "Failed to claim reward" });
    }
  });

  // Get achievements for user
  app.get("/api/achievements", async (req, res) => {
    try {
      const allUsers = Array.from((storage as any).users.values());
      const userId = allUsers[0]?.id;
      if (!userId) {
        return res.status(404).json({ message: "User not found" });
      }
      const achievements = await storage.getAchievements(userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Get categories for user
  app.get("/api/categories", async (req, res) => {
    try {
      const allUsers = Array.from((storage as any).users.values());
      const userId = allUsers[0]?.id;
      if (!userId) {
        return res.status(404).json({ message: "User not found" });
      }
      const categories = await storage.getCategories(userId);
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Helper function to handle quest completion logic
  async function handleQuestCompletion(quest: any) {
    try {
      const allUsers = Array.from((storage as any).users.values());
      const user = allUsers[0];
      if (!user) return;

      // Update user XP
      const newCurrentXP = user.currentXP + quest.xp;
      const newTotalXP = user.totalXP + quest.xp;
      
      // Check for level up (every 500 XP)
      const newLevel = Math.floor(newTotalXP / 500) + 1;
      const leveledUp = newLevel > user.level;

      // Update streak (simplified logic for MVP)
      const today = new Date().toISOString().split('T')[0];
      const newStreak = user.lastActiveDate === today ? user.streak : user.streak + 1;

      await storage.updateUser(user.id, {
        currentXP: newCurrentXP % 500, // Reset current XP on level up
        totalXP: newTotalXP,
        level: newLevel,
        streak: newStreak,
        lastActiveDate: today
      });

      // Update category stats
      const categories = await storage.getCategories(user.id);
      const category = categories.find(c => c.name === quest.category);
      if (category) {
        await storage.updateCategory(category.id, {
          totalXP: category.totalXP + quest.xp,
          questCount: category.questCount + 1
        });
      }

      // Check for achievements
      if (leveledUp) {
        await storage.createAchievement({
          userId: user.id,
          title: "Level Up!",
          description: `Reached level ${newLevel}`,
          icon: "⭐",
          xpReward: 50
        });
      }

      if (newStreak >= 7 && newStreak % 7 === 0) {
        await storage.createAchievement({
          userId: user.id,
          title: "Streak Master",
          description: `Maintained ${newStreak} day streak`,
          icon: "🔥",
          xpReward: 100
        });
      }

      // Check and unlock rewards
      const rewards = await storage.getRewards(user.id);
      for (const reward of rewards) {
        if (!reward.unlocked) {
          let shouldUnlock = false;
          
          if (reward.xpRequired && newTotalXP >= reward.xpRequired) {
            shouldUnlock = true;
          }
          
          if (reward.streakRequired && newStreak >= reward.streakRequired) {
            shouldUnlock = true;
          }
          
          if (shouldUnlock) {
            await storage.updateReward(reward.id, { unlocked: true });
          }
        }
      }
    } catch (error) {
      console.error("Error handling quest completion:", error);
    }
  }

  const httpServer = createServer(app);
  return httpServer;
}
