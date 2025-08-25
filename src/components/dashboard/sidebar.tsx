"use client"

import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar"
import { 
  Play, 
  Settings, 
  LogOut,
  Home,
  BarChart3,
  Users,
  FileText,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Simulator",
    url: "#",
    icon: Play,
  },
  {
    title: "Analytics",
    url: "#",
    icon: BarChart3,
  },
  {
    title: "Users",
    url: "#",
    icon: Users,
  },
  {
    title: "Reports",
    url: "#",
    icon: FileText,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

function SidebarContent_() {
  const { state, toggleSidebar } = useSidebar()
  const collapsed = state === "collapsed"

  return (
    <div className="relative">
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>Dashboard</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="px-6 py-3 group-data-[collapsible=icon]:px-3 group-data-[collapsible=icon]:justify-center">
                        <item.icon className="h-4 w-4" />
                        <span className={collapsed ? "sr-only" : "ml-3"}>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a 
                      href="#"
                      className="px-6 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 group-data-[collapsible=icon]:px-3 group-data-[collapsible=icon]:justify-center"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className={collapsed ? "sr-only" : "ml-3"}>Logout</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter className="border-t px-6 py-4">
          <div className={`text-xs text-muted-foreground ${collapsed ? "sr-only" : ""}`}>
            © 2024 Cerulion Cloud
          </div>
        </SidebarFooter>
      </Sidebar>
      
      {/* Toggle button positioned in the center */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-10 bg-background border border-border rounded-full p-1.5 shadow-md hover:bg-accent hover:text-accent-foreground transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    </div>
  )
}

export function DashboardSidebar() {
  return <SidebarContent_ />
}
