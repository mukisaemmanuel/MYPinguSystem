import React from "react";

export interface Friend {
  id: string;
  username: string;
  level: number;
  streak: number;
  totalXP: number;
}

interface FriendListProps {
  friends: Friend[];
  currentUserXP: number;
}

export default function FriendList({ friends, currentUserXP }: FriendListProps) {
  return (
    <section className="rounded-lg p-4 border bg-background">
      <h2 className="text-xl font-bold mb-4">Friend List & Progress</h2>
      {friends.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="font-semibold mb-2">No Friends Yet</h3>
          <p className="text-sm text-muted-foreground">
            Add friends to compare your progress and streaks!
          </p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left">Username</th>
              <th>Level</th>
              <th>Streak</th>
              <th>Total XP</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {friends.map(friend => (
              <tr key={friend.id} className="border-t">
                <td>{friend.username}</td>
                <td>{friend.level}</td>
                <td>{friend.streak}</td>
                <td>{friend.totalXP}</td>
                <td>
                  {currentUserXP > friend.totalXP ? (
                    <span className="text-green-600 font-bold">Ahead</span>
                  ) : currentUserXP < friend.totalXP ? (
                    <span className="text-red-600 font-bold">Behind</span>
                  ) : (
                    <span className="text-gray-600 font-bold">Even</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
