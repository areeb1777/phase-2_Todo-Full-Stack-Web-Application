import React from 'react';
import MessageBubble from './MessageBubble';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, isLoading }) => {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border bg-card rounded-t-lg">
        <h2 className="text-xl font-semibold text-foreground">AI Task Assistant</h2>
        <p className="text-sm text-muted-foreground">Manage your tasks with natural language</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Start a conversation to manage your tasks...</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
            />
          ))
        )}

        {isLoading && (
          <div className="flex items-center space-x-3 p-3">
            <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold text-xs">AI</span>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-foreground rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPanel;