import { useState, useCallback, useRef, useEffect } from 'react';

export interface ChatMessage {
  id: number;
  type: 'user' | 'agent';
  content: string;
  timestamp: string;
  isLoading?: boolean;
}

interface UseBedrockChatProps {
  agentId: string;
  initialMessages?: ChatMessage[];
}

export function useBedrockChat({ agentId, initialMessages = [] }: UseBedrockChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(`session-${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);

    // Add loading message for agent
    const loadingMessage: ChatMessage = {
      id: Date.now() + 1,
      type: 'agent',
      content: 'Thinking...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isLoading: true,
    };

    setMessages(prev => [...prev, loadingMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/bedrock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content.trim(),
          agentId,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Update session ID if provided
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      // Replace loading message with actual response
      const agentMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'agent',
        content: data.response || 'No response received',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => prev.map(msg => 
        msg.isLoading ? agentMessage : msg
      ));

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Replace loading message with error message
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'agent',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => prev.map(msg => 
        msg.isLoading ? errorMessage : msg
      ));
    } finally {
      setIsLoading(false);
    }
  }, [agentId, sessionId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setSessionId(`session-${Date.now()}`);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    messagesEndRef,
  };
}
