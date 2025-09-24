import React from "react";

interface HabitSuggestionProps {
  habits: string[];
  onSuggestQuest: (quest: string) => void;
}

const SUGGESTIONS: Record<string, string[]> = {
  Health: ["Drink water", "Morning walk", "Stretch for 5 min"],
  Work: ["Plan your day", "Review tasks", "Take a break"],
  Personal: ["Read a book", "Call a friend", "Journal thoughts"],
  Study: ["Review notes", "Practice problems", "Watch a tutorial"],
};

export default function HabitSuggestion({ habits, onSuggestQuest }: HabitSuggestionProps) {
  const suggestedQuests = habits.flatMap(habit => SUGGESTIONS[habit] || []);

  return (
    <section className="rounded-lg p-4 border bg-background">
      <h2 className="text-xl font-bold mb-4">Suggested Quests</h2>
      {suggestedQuests.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">💡</div>
          <h3 className="font-semibold mb-2">No Suggestions Yet</h3>
          <p className="text-sm text-muted-foreground">
            Complete more quests to get personalized suggestions!
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {suggestedQuests.map((quest, idx) => (
            <li key={idx} className="flex items-center justify-between border-b pb-2">
              <span>{quest}</span>
              <button
                className="ml-4 px-2 py-1 rounded bg-primary text-white text-xs"
                onClick={() => onSuggestQuest(quest)}
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
