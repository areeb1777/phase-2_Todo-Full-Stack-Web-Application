'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { chatApi, ChatMessage, Conversation } from '@/lib/api';
import ChatPanel from './chat/ChatPanel';
import ChatInput from './chat/ChatInput';
import ConversationList from './chat/ConversationList';
import { MessageCircle, X } from 'lucide-react';

const ChatBot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load conversations when user is available
  useEffect(() => {
    if (user?.id) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    try {
      const userConversations = await chatApi.getUserConversations(user!.id);
      setConversations(userConversations);

      // Load the most recent conversation if available
      if (userConversations.length > 0) {
        const mostRecent = userConversations[0];
        setCurrentConversationId(mostRecent.id);
        await loadConversationMessages(mostRecent.id);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadConversationMessages = async (conversationId: string) => {
    try {
      setIsLoading(true);
      const conversationMessages = await chatApi.getConversationMessages(user!.id, conversationId);
      setMessages(conversationMessages);
    } catch (error) {
      console.error('Failed to load conversation messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      // Add user message optimistically
      const userMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        conversation_id: currentConversationId || '',
        role: 'user',
        content: message,
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, userMessage]);

      // Send to API
      const response = await chatApi.sendMessage(user.id, {
        message,
        conversation_id: currentConversationId || undefined
      });

      // Update conversation ID if new conversation was created
      if (response.conversation_id && !currentConversationId) {
        setCurrentConversationId(response.conversation_id);

        // Reload conversations to include the new one
        const updatedConversations = await chatApi.getUserConversations(user.id);
        setConversations(updatedConversations);
      }

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: `response-${Date.now()}`,
        conversation_id: response.conversation_id,
        role: 'assistant',
        content: response.response,
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);

      // Remove the optimistic user message if sending failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = async (conversationId: string) => {
    setCurrentConversationId(conversationId);
    await loadConversationMessages(conversationId);
  };

  const handleCreateNewConversation = async () => {
    setCurrentConversationId(null);
    setMessages([]);
  };

  if (!user) return null;

  return (
    <>
      {/* Chatbot toggle button - Fixed position in bottom right corner */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
        <span className="sr-only">{isOpen ? "Close chat" : "Open chat"}</span>
      </button>

      {/* Chatbot panel - Appears when opened */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-full max-w-lg h-[60vh] min-h-[400px] max-h-[600px] bg-background border border-border rounded-xl shadow-2xl flex flex-col">
          <div className="flex flex-1 overflow-hidden">
            {/* Conversation list sidebar */}
            <div className="w-1/3 max-w-xs border-r border-border hidden md:block">
              <ConversationList
                conversations={conversations}
                currentConversationId={currentConversationId}
                onSelectConversation={handleSelectConversation}
                onCreateNewConversation={handleCreateNewConversation}
              />
            </div>

            {/* Main chat area - Full width on mobile, 2/3 on desktop */}
            <div className="flex flex-col flex-1 md:w-2/3">
              {/* Chat panel */}
              <div className="flex-1 overflow-y-auto">
                <ChatPanel
                  messages={messages.map(msg => ({
                    id: msg.id,
                    role: msg.role,
                    content: msg.content,
                    timestamp: new Date(msg.created_at)
                  }))}
                  isLoading={isLoading}
                />
              </div>

              {/* Chat input */}
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;