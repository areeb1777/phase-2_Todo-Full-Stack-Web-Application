# Data Model: AI-Powered Todo Chatbot

## Overview
This document describes the data models required for the AI-powered todo chatbot, including conversation and message entities that will be stored in the PostgreSQL database.

## Entity: Conversation

### Fields
- **id**: Integer (Primary Key, Auto-increment)
  - Unique identifier for each conversation
  - Required for database indexing and retrieval
- **user_id**: Integer (Foreign Key)
  - Links conversation to the user who owns it
  - References the existing user model from Phase II
  - Required for multi-user support and data isolation
- **created_at**: DateTime (Timestamp)
  - Records when the conversation was initiated
  - Used for sorting and chronological ordering
- **updated_at**: DateTime (Timestamp)
  - Records last activity in the conversation
  - Enables conversation cleanup and management

### Relationships
- One-to-Many: Conversation → Messages (one conversation contains many messages)
- Many-to-One: Conversation ← User (many conversations belong to one user)

### Validation Rules
- user_id must reference an existing user
- created_at must be in the past or present
- updated_at must be >= created_at

## Entity: Message

### Fields
- **id**: Integer (Primary Key, Auto-increment)
  - Unique identifier for each message
  - Required for database indexing and retrieval
- **conversation_id**: Integer (Foreign Key)
  - Links message to its parent conversation
  - References the conversation entity
  - Required for organizing messages within conversations
- **role**: String (Enum: "user" | "assistant")
  - Indicates whether the message is from user or AI assistant
  - Used for UI display differentiation
  - Required field
- **content**: Text (Variable length)
  - The actual message content
  - Supports both English and Roman Urdu text
  - Required field
- **created_at**: DateTime (Timestamp)
  - Records when the message was created
  - Used for chronological ordering within conversations

### Relationships
- Many-to-One: Message → Conversation (many messages belong to one conversation)
- One-to-Many: Message → ToolCalls (one message may trigger multiple tool calls)

### Validation Rules
- conversation_id must reference an existing conversation
- role must be either "user" or "assistant"
- content must not be empty
- created_at must be in the past or present

## State Transitions

### Conversation Lifecycle
1. **Created**: When user initiates first chat session
2. **Active**: When messages are exchanged in the conversation
3. **Inactive**: When conversation has no activity for extended period (for cleanup purposes)

### Message Lifecycle
1. **Received**: User message received by system
2. **Processed**: AI agent analyzes and generates response
3. **Stored**: Both user and assistant messages stored in database
4. **Displayed**: Messages retrieved and shown in UI

## Indexes

### Required Indexes
- **conversation_id_idx**: Index on conversation_id in messages table for fast retrieval of messages within a conversation
- **user_id_idx**: Index on user_id in conversations table for fast retrieval of user's conversations
- **created_at_idx**: Index on created_at in both tables for chronological queries

## Constraints

### Referential Integrity
- Foreign key constraint on conversation.user_id referencing users.id
- Foreign key constraint on message.conversation_id referencing conversations.id
- Cascade delete: When conversation is deleted, all associated messages are removed

### Data Consistency
- Role field constrained to only accept "user" or "assistant" values
- Content field cannot be null or empty
- Timestamps automatically managed by the system