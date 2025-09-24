import React, { useEffect, useState } from "react";

const THEMES = [
  { name: "Light", value: "light" },
  { name: "Dark", value: "dark" },
  { name: "Retro", value: "retro" },
  { name: "Ocean", value: "ocean" },
];

function saveTheme(theme: string) {
  localStorage.setItem("app-theme", theme);
}

function getSavedTheme(): string {
  return localStorage.getItem("app-theme") || "light";
}

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(getSavedTheme());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    saveTheme(theme);
  }, [theme]);

  return (
    <div className="flex items-center gap-2">
      <span className="font-medium">Theme:</span>
      <select
        value={theme}
        onChange={e => setTheme(e.target.value)}
        className="border rounded px-2 py-1 bg-background"
      >
        {THEMES.map(t => (
          <option key={t.value} value={t.value}>{t.name}</option>
        ))}
      </select>
    </div>
  );
}
