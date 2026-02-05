import React from 'react';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content, timestamp }) => {
  const isUser = role === 'user';

  // Format timestamp
  const formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-primary' : 'bg-secondary'
        }`}>
          <span className={`${isUser ? 'text-primary-foreground' : 'text-secondary-foreground'} text-xs font-bold`}>
            {isUser ? 'U' : 'AI'}
          </span>
        </div>

        {/* Message bubble */}
        <div className={`rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-secondary text-secondary-foreground rounded-bl-none'
        }`}>
          <p className="whitespace-pre-wrap">{content}</p>
          <div className={`text-xs mt-1 ${isUser ? 'text-primary-foreground/70' : 'text-secondary-foreground/70'} text-right`}>
            {formattedTime}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;