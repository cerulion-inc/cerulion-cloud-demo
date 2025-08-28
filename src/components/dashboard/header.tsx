'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { SidebarIcon } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from 'react'
import Image from 'next/image'

interface User {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}

interface CachedUserData {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  cached_at: number
}

const USER_CACHE_KEY = 'dashboard_user_cache'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export default function DashboardHeader() {
  const [user, setUser] = useState<User | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const { toggleSidebar } = useSidebar()

  // Cache user data in localStorage
  const cacheUserData = useCallback((userData: User) => {
    if (!userData) return
    
    const cachedData: CachedUserData = {
      id: userData.id,
      email: userData.email || '',
      full_name: userData.user_metadata?.full_name,
      avatar_url: userData.user_metadata?.avatar_url,
      cached_at: Date.now()
    }
    
    try {
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(cachedData))
    } catch (error) {
      console.warn('Failed to cache user data:', error)
    }
  }, [])

  // Get cached user data from localStorage
  const getCachedUserData = useCallback((): CachedUserData | null => {
    try {
      const cached = localStorage.getItem(USER_CACHE_KEY)
      if (!cached) return null
      
      const cachedData: CachedUserData = JSON.parse(cached)
      
      // Check if cache is still valid
      if (Date.now() - cachedData.cached_at > CACHE_DURATION) {
        localStorage.removeItem(USER_CACHE_KEY)
        return null
      }
      
      return cachedData
    } catch (error) {
      console.warn('Failed to get cached user data:', error)
      localStorage.removeItem(USER_CACHE_KEY)
      return null
    }
  }, [])

  // Clear cached user data
  const clearCachedUserData = useCallback(() => {
    try {
      localStorage.removeItem(USER_CACHE_KEY)
    } catch (error) {
      console.warn('Failed to clear cached user data:', error)
    }
  }, [])

  useEffect(() => {
    const getUser = async () => {
      // First try to get cached data
      const cachedData = getCachedUserData()
      
      if (cachedData) {
        // Use cached data immediately for better UX
        setUser({
          id: cachedData.id,
          email: cachedData.email,
          user_metadata: {
            full_name: cachedData.full_name,
            avatar_url: cachedData.avatar_url
          }
        })
      }
      
      // Then fetch fresh data from Supabase
      const { data: { user: freshUser } } = await supabase.auth.getUser()
      
      if (freshUser) {
        setUser(freshUser)
        cacheUserData(freshUser)
      } else if (cachedData) {
        // If no fresh user but we have cached data, clear the cache
        clearCachedUserData()
        setUser(null)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
        cacheUserData(session.user)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        clearCachedUserData()
      } else if (session?.user) {
        setUser(session.user)
        cacheUserData(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, cacheUserData, getCachedUserData, clearCachedUserData])

  const handleSignOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast.error('Error signing out')
        return
      }
      
      clearCachedUserData()
      toast.success('Signed out successfully')
      router.push('/auth/login')
      router.refresh()
    } catch (err) {
      console.error('Sign out error:', err)
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
      setIsProfileOpen(false)
    }
  }

  // Memoize user data to prevent unnecessary re-renders
  const memoizedUser = useMemo(() => user, [user])

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getDisplayName = () => {
    if (memoizedUser?.user_metadata?.full_name) {
      return memoizedUser.user_metadata.full_name
    }
    return memoizedUser?.email || 'User'
  }

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = (): Array<{title: string, href: string, isCurrent: boolean}> => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: Array<{title: string, href: string, isCurrent: boolean}> = []
    
    if (segments.length === 0) return breadcrumbs
    
    // Always start with Dashboard
    breadcrumbs.push({
      title: 'Dashboard',
      href: '/dashboard',
      isCurrent: segments.length === 1
    })
    
    // Add other segments
    for (let i = 1; i < segments.length; i++) {
      const segment = segments[i]
      const href = `/${segments.slice(0, i + 1).join('/')}`
      const title = segment.charAt(0).toUpperCase() + segment.slice(1)
      
      breadcrumbs.push({
        title,
        href,
        isCurrent: i === segments.length - 1
      })
    }
    
    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        
        {/* Breadcrumbs */}
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={breadcrumb.href}>
                <BreadcrumbItem>
                  {breadcrumb.isCurrent ? (
                    <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={breadcrumb.href}>
                      {breadcrumb.title}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Profile Section */}
        <div className="flex items-center space-x-3 ml-auto">
          {memoizedUser ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 h-10 px-3"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                  {memoizedUser.user_metadata?.avatar_url ? (
                    <Image
                      src={memoizedUser.user_metadata.avatar_url}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    getInitials(memoizedUser.user_metadata?.full_name)
                  )}
                </div>
                
                {/* User Info */}
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-gray-900">{getDisplayName()}</div>
                  <div className="text-xs text-gray-500">{memoizedUser.email}</div>
                </div>
                
                {/* Dropdown Arrow */}
                <svg 
                  className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900">{getDisplayName()}</div>
                    <div className="text-sm text-gray-500">{memoizedUser.email}</div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false)
                        // Add profile view logic here
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      View Profile
                    </button>
                    
                    <button
                      onClick={() => {
                        setIsProfileOpen(false)
                        // Add account settings logic here
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Account Settings
                    </button>
                    
                    <Separator className="my-1" />
                    
                    <button
                      onClick={handleSignOut}
                      disabled={loading}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Signing out...' : 'Sign Out'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button variant="ghost" size="sm">
              Loading...
            </Button>
          )}
        </div>
      </div>
      
      {/* Click outside to close dropdown */}
      {isProfileOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </header>
  )
}
