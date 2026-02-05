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

  useEffect(() => {
    if (user?.id) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    try {
      const userConversations = await chatApi.getUserConversations(user!.id);
      setConversations(userConversations);

      if (userConversations.length > 0) {
        const mostRecent = userConversations[0];
        setCurrentConversationId(mostRecent.id);
        await loadConversationMessages(mostRecent.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadConversationMessages = async (conversationId: string) => {
    try {
      setIsLoading(true);
      const conversationMessages = await chatApi.getConversationMessages(user!.id, conversationId);
      setMessages(conversationMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      const userMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        conversation_id: currentConversationId || '',
        role: 'user',
        content: message,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, userMessage]);

      const response = await chatApi.sendMessage(user.id, {
        message,
        conversation_id: currentConversationId || undefined,
      });

      if (response.conversation_id && !currentConversationId) {
        setCurrentConversationId(response.conversation_id);
        const updatedConversations = await chatApi.getUserConversations(user.id);
        setConversations(updatedConversations);
      }

      const assistantMessage: ChatMessage = {
        id: `response-${Date.now()}`,
        conversation_id: response.conversation_id,
        role: 'assistant',
        content: response.response,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = async (conversationId: string) => {
    setCurrentConversationId(conversationId);
    await loadConversationMessages(conversationId);
  };

  const handleCreateNewConversation = () => {
    setCurrentConversationId(null);
    setMessages([]);
  };

  if (!user) return null;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div
          className="
            fixed bottom-24 right-6 z-50
            w-[95vw] sm:w-[90vw] md:w-[720px] lg:w-[900px]
            max-w-[95vw]
            h-[70vh] min-h-[420px]
            bg-background border border-border
            rounded-xl shadow-2xl
            flex flex-col
          "
        >
          <div className="flex flex-1 overflow-hidden">

            {/* Sidebar (fixed width) */}
            <div className="hidden md:block w-64 border-r border-border">
              <ConversationList
                conversations={conversations}
                currentConversationId={currentConversationId}
                onSelectConversation={handleSelectConversation}
                onCreateNewConversation={handleCreateNewConversation}
              />
            </div>

            {/* Chat Area */}
            <div className="flex flex-col flex-1">

              {/* Messages */}
              <div className="flex-1 overflow-y-auto">
                <ChatPanel
                  messages={messages.map(msg => ({
                    id: msg.id,
                    role: msg.role,
                    content: msg.content,
                    timestamp: new Date(msg.created_at),
                  }))}
                  isLoading={isLoading}
                />
              </div>

              {/* Input */}
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