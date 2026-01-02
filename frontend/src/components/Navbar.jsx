import { useEffect, useState } from "react";
import { Sun, Moon, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/AuthContext";

/* ------------------ Component ------------------ */

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const { user, logoutUser } = useAuth();

  /* Load theme from localStorage */
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const isDark = storedTheme === "dark";

    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  /* Toggle theme */
  const toggleTheme = () => {
    const nextTheme = !darkMode;

    setDarkMode(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme);
    localStorage.setItem("theme", nextTheme ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Left: Sidebar Trigger + Brand */}
        <div className="flex items-center gap-4">
          <SidebarTrigger />

          <span className="text-xl font-bold tracking-tight">
            <span className="text-primary">Prompt</span>ify
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="transition hover:bg-muted"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* User Info & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{user?.username || "User"}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            
            <Avatar className="h-8 w-8 ring-1 ring-muted-foreground/10 transition hover:ring-2">
              <AvatarFallback>{user?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={logoutUser}
              title="Logout"
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
