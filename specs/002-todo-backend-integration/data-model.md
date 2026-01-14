# Data Model: Todo App Backend Integration

## Overview
This document defines the data structures, relationships, and validation rules for the Todo application backend.

## Entity Definitions

### Todo Entity
**Description**: Represents a user's task or to-do item

**Fields**:
- `id`: UUID (Primary Key)
  - Type: UUID (string format)
  - Required: Yes
  - Unique: Yes
  - Description: Globally unique identifier for the todo item
  - Format: RFC 4122 compliant UUID

- `title`: String
  - Type: String
  - Required: Yes
  - Min Length: 1 character
  - Max Length: 255 characters
  - Description: The main title or description of the todo item

- `description`: String (Optional)
  - Type: String
  - Required: No
  - Max Length: 1000 characters
  - Default: null
  - Description: Additional details about the todo item

- `completed`: Boolean
  - Type: Boolean
  - Required: Yes
  - Default: False
  - Description: Status indicating if the todo is completed

- `created_at`: DateTime
  - Type: ISO 8601 timestamp
  - Required: Yes
  - Default: Current timestamp
  - Description: Time when the todo was created
  - Format: YYYY-MM-DDTHH:MM:SS.sssZ

**Validation Rules**:
- Title must not be empty
- Title length must be between 1 and 255 characters
- Description length must not exceed 1000 characters if provided
- Completed status must be a boolean value
- Created timestamp must be a valid ISO 8601 format

**State Transitions**:
- Creation: `completed` defaults to `false`
- Update: `completed` can be toggled between `true` and `false`
- Deletion: Item is removed from the system

## Database Schema

### PostgreSQL Table Definition
```sql
CREATE TABLE todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_todos_created_at ON todos(created_at DESC);
```

**Notes**:
- Uses UUID for primary key to ensure global uniqueness
- `gen_random_uuid()` function generates random UUIDs
- Index on `created_at` for efficient sorting
- `TIMESTAMP WITH TIME ZONE` for proper timezone handling

## Relationships
- Currently no relationships (standalone entity)
- Future consideration: relationship to user when authentication is added

## Business Rules
1. A todo must have a title
2. New todos are created with `completed` status as `false`
3. Todos are sorted by `created_at` in descending order (newest first)
4. A todo can be marked as completed or uncompleted multiple times

## Constraints
1. **Data Integrity**: Title cannot be null or empty
2. **Immutability**: Created timestamp cannot be modified after creation
3. **Uniqueness**: Each todo must have a unique UUID identifier
4. **Validation**: Completed status must be a boolean value only

## Performance Considerations
1. Index on `created_at` for efficient sorting queries
2. UUID primary key for distributed systems compatibility
3. Appropriate field sizing to prevent overflow issues
4. Efficient data types for optimal storage

## Extension Points
1. **Future Fields**: Could add `priority`, `due_date`, `category`
2. **Relationships**: Could add foreign key to `users` table for multi-user support
3. **Metadata**: Could add `updated_at` for tracking modification time
4. **Soft Delete**: Could add `deleted_at` field for soft deletion