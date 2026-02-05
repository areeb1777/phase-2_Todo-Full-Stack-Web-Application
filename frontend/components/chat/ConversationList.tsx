import React from 'react';
import { Conversation } from '../../lib/types';

interface ConversationListProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onCreateNewConversation: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onCreateNewConversation
}) => {
  return (
    <div className="flex flex-col h-full bg-muted border-r border-border w-64">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground mb-3">Conversations</h3>
        <button
          onClick={onCreateNewConversation}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
        >
          <span>+ New Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-muted-foreground text-sm flex items-center justify-center h-full">
            No conversations yet
          </div>
        ) : (
          <ul>
            {conversations.map((conversation) => (
              <li key={conversation.id} className="border-b border-border last:border-b-0">
                <button
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`w-full text-left p-3 text-sm transition-colors duration-200 ${
                    currentConversationId === conversation.id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-accent text-foreground'
                  }`}
                >
                  <div className="font-medium truncate mb-1">
                    Chat {new Date(conversation.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {new Date(conversation.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConversationList;