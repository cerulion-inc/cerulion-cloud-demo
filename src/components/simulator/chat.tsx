"use client"
import * as React from "react"
import { Send, Bot, User, RefreshCw } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useBedrockChat, ChatMessage } from "@/hooks/use-bedrock-chat"

// Welcome message for new conversations
const welcomeMessage: ChatMessage = {
  id: 1,
  type: "agent",
  content: "Hello! I'm your AWS Bedrock AI assistant. How can I help you today?",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [inputValue, setInputValue] = React.useState("")
  
  // Initialize Bedrock chat with your agent ID
  // Replace 'your-agent-id' with your actual Bedrock agent ID
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    clearMessages, 
    messagesEndRef 
  } = useBedrockChat({ 
    agentId: process.env.NEXT_PUBLIC_BEDROCK_AGENT_ID || 'your-agent-id',
    initialMessages: [welcomeMessage]
  })

  const handleSendMessage = () => {
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue)
      setInputValue("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleClearChat = () => {
    clearMessages()
  }

  return (
    <Sidebar
      collapsible="none"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader className="border items-center">
        <div className="flex items-center justify-between py-3 px-4">
          <span className="font-semibold">ISAAC Assistant</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearChat}
            className="h-8 w-8 p-0"
            title="Clear chat"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="border-l border-b">
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
                  {message.type === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : message.isLoading ? (
                    <Spinner size="sm" className="text-gray-600" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
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
              placeholder={isLoading ? "Agent is thinking..." : "Type your message..."}
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage}
              size="sm"
              className="px-3"
              disabled={isLoading || !inputValue.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
