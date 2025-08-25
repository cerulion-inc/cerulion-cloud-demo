"use client"
import * as React from "react"
import { Plus, Send, Bot, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

// Sample chat data
const sampleMessages = [
  {
    id: 1,
    type: "agent",
    content: "Hello! I'm your AI assistant. How can I help you today?",
    timestamp: "10:30 AM"
  },
  {
    id: 2,
    type: "user",
    content: "Can you help me understand cloud computing?",
    timestamp: "10:31 AM"
  },
  {
    id: 3,
    type: "agent",
    content: "Of course! Cloud computing is the delivery of computing services over the internet. It includes servers, storage, databases, networking, software, analytics, and intelligence.",
    timestamp: "10:31 AM"
  },
  {
    id: 4,
    type: "user",
    content: "What are the main benefits?",
    timestamp: "10:32 AM"
  },
  {
    id: 5,
    type: "agent",
    content: "The main benefits include cost savings, scalability, flexibility, disaster recovery, and automatic software updates. Would you like me to elaborate on any of these?",
    timestamp: "10:32 AM"
  }
]

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [messages, setMessages] = React.useState(sampleMessages)
  const [inputValue, setInputValue] = React.useState("")
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: "user" as const,
        content: inputValue,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages([...messages, newMessage])
      setInputValue("")
      
      // Simulate agent response
      setTimeout(() => {
        const agentResponse = {
          id: messages.length + 2,
          type: "agent" as const,
          content: "I understand your question. Let me provide you with a detailed response...",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setMessages(prev => [...prev, agentResponse])
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Sidebar
      collapsible="none"
      className="sticky top-0 hidden h-svh border-l lg:flex"
      {...props}
    >
      <SidebarHeader className="border-sidebar-border border-b flex items-center px-4 h-12">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">Isaac Assistant</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-black text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`rounded-lg px-3 py-2 ${
                  message.type === 'user'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              size="sm"
              className="px-3"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
