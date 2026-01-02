import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  Bot,
  MessageSquare,
  Zap,
  MessageSquarePlus,
  Trash,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input"; // Import Input
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserChats, deleteChat } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner"; // Import toast

/* ------------------ Static Frontend Data ------------------ */

const mainNav = [
  { title: "Home", url: "/", icon: Home },
  { title: "Search", url: "/search", icon: Search },
  { title: "Settings", url: "/settings", icon: Settings },
];

/* ------------------ Component ------------------ */

export function AppSidebar() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { chat_uid } = useParams();

  const { data: chats = [], isLoading } = useQuery({
    queryKey: ["userChats", search],
    queryFn: () => getUserChats(search),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteChat,
    onSuccess: () => {
      queryClient.invalidateQueries(["userChats"]);
      toast.success("Chat deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete chat");
    }
  });

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this chat?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          if (id === chat_uid) {
            navigate("/");
          }
        },
      });
    }
  };

  return (
    <Sidebar className="bg-background text-foreground border-r">
      <SidebarContent className="flex h-full flex-col justify-between">
        <div>
          {/* Main Menu */}
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 pb-2 pt-4 text-xs uppercase text-muted-foreground">
              Main Menu
              <Badge
                variant="secondary"
                className="ml-2 px-1.5 py-0.5 text-[10px]"
              >
                Pro
              </Badge>
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {mainNav.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className="flex items-center gap-3 rounded-md px-4 py-2 transition hover:bg-muted"
                      >
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Search & New Chat */}
          <div className="px-4 pt-4 space-y-2">
             <Input 
              placeholder="Search chats..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8"
            />
            <Button
              variant="secondary"
              className="w-full justify-start gap-2"
              asChild
            >
              <Link to="/">
                <MessageSquarePlus className="h-4 w-4" />
                New Chat
              </Link>
            </Button>
          </div>

          {/* Chat Sections */}
          {isLoading ? (
            <div className="px-5 py-4 text-xs text-muted-foreground">Loading chats...</div>
          ) : (
            <ChatSection title="Recent Chats" chats={chats} onDelete={handleDelete} />
          )}

          {/* Explore GPTs */}
          <SidebarGroup className="mt-6">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="#"
                    className="flex items-center gap-3 rounded-md px-4 py-2 transition hover:bg-muted"
                  >
                    <Bot className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-semibold">
                      Explore GPTs
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </div>

        {/* Upgrade CTA */}
        <div className="border-t p-4">
          <Link
            to="#"
            className="flex items-center justify-between rounded-md bg-primary px-4 py-2 text-primary-foreground transition hover:bg-primary/90"
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              <Zap className="h-4 w-4" />
              Upgrade to Pro
            </span>
            <Badge variant="secondary" className="px-1.5 py-0.5 text-[10px]">
              New
            </Badge>
          </Link>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

/* ------------------ Reusable Chat Section ------------------ */

function ChatSection({ title, chats, onDelete }) {
  if (!chats.length) return null;

  return (
    <SidebarGroup className="mt-6">
      <SidebarGroupLabel className="px-4 pb-2 text-xs uppercase text-muted-foreground">
        {title}
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu className="max-h-[300px] overflow-y-auto">
          {chats.map((chat) => (
            <SidebarMenuItem key={chat.id}>
              <div className="relative group">
                <NavLink to={`/chats/${chat.id}`} className="block">
                  {({ isActive }) => (
                    <SidebarMenuButton
                      className={cn(
                        "flex items-center gap-3 rounded-md px-4 py-2 transition pr-9", // Added pr-9 for space for delete button
                        isActive ? "bg-muted" : "hover:bg-muted"
                      )}
                    >
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate text-sm">
                        {chat.title || "Untitled Chat"}
                      </span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete(chat.id);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:text-destructive"
                >
                  <Trash size={14} />
                </button>
              </div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
