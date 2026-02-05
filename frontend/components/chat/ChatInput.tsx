import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-border p-4 bg-card">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            placeholder="Type your task request (e.g., 'add buy groceries', 'show pending tasks', 'complete task 3')..."
            className="w-full border border-input rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:bg-muted disabled:cursor-not-allowed text-foreground bg-background"
          />
        </div>
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className={`px-5 py-3 rounded-lg font-medium whitespace-nowrap ${
            inputValue.trim() && !isLoading
              ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          } transition-colors duration-200 flex items-center gap-2`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            'Send'
          )}
        </button>
      </div>
      <div className="mt-2 text-xs text-muted-foreground text-center">
        Tip: You can speak in English or Roman Urdu (e.g., "add kal meeting yaad dilana")
      </div>
    </form>
  );
};

export default ChatInput;