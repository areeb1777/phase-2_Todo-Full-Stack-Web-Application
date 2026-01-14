# Data Model: Authentication and Multi-User Support

## Entities

### User
**Purpose**: Represents an authenticated user account

**Fields**:
- `id`: UUID (Primary Key) - Unique identifier for the user
- `email`: String (255, unique, indexed) - User's email address for login
- `password_hash`: String (255) - Bcrypt hash of the user's password
- `created_at`: DateTime (timezone-aware) - Timestamp of account creation

**Relationships**:
- `todos`: One-to-Many relationship with Todo entity (cascade delete)

**Validation Rules**:
- Email must be valid email format
- Email must be unique across all users
- Email length maximum 255 characters
- Password must be at least 1 character (before hashing)

### Todo
**Purpose**: Represents a task/todo item owned by a specific user

**Fields**:
- `id`: UUID (Primary Key) - Unique identifier for the todo
- `title`: String (255) - Title of the task (required)
- `description`: String (1000, optional) - Detailed description of the task
- `completed`: Boolean - Whether the task is completed (default: false)
- `created_at`: DateTime (timezone-aware) - Timestamp of creation
- `user_id`: UUID (Foreign Key) - Reference to the owning user

**Relationships**:
- `user`: Many-to-One relationship with User entity (required)

**Validation Rules**:
- Title must be 1-255 characters
- Description must be 0-1000 characters if provided
- user_id must reference an existing user
- All operations must be authorized for the owning user

## State Transitions

### User Authentication State
```
UNAUTHENTICATED → AUTHENTICATING → AUTHENTICATED → LOGGED_OUT
                                    ↓
                              SESSION_EXPIRED
```

### Todo Completion State
```
ACTIVE → COMPLETED
   ↑         ↓
COMPLETING ←→ UNCOMPLETING
```

## API Endpoints Data Flow

### Authentication Endpoints
```
POST /auth/register
Request: { email: string, password: string }
Response: UserResponse { id, email, created_at }

POST /auth/login
Request: { username: string, password: string }
Response: { access_token: string, token_type: string, user: UserResponse }

GET /auth/me
Request: Authorization: Bearer {token}
Response: UserResponse { id, email, created_at }
```

### Todo Endpoints (with authentication)
```
GET /todos
Request: Authorization: Bearer {token}
Response: TodoResponse[]

POST /todos
Request: Authorization: Bearer {token}, { title: string, description?: string }
Response: TodoResponse

PUT /todos/{id}
Request: Authorization: Bearer {token}, { title?: string, description?: string, completed?: boolean }
Response: TodoResponse

DELETE /todos/{id}
Request: Authorization: Bearer {token}
Response: 204 No Content
```

## Database Relationships

```
User (1) ←→ (Many) Todo
user.id ←→ todo.user_id
```

**Constraint**: Referential integrity enforced with foreign key relationship
**Behavior**: Cascade delete - when user is deleted, all their todos are deleted

## JWT Token Payload Structure

```
{
  "sub": "user_id_uuid",
  "email": "user@example.com",
  "iat": timestamp,
  "exp": expiration_timestamp
}
```

## Security Constraints

1. **Ownership Enforcement**: Todo queries must filter by authenticated user's ID
2. **Authorization**: All todo operations require valid JWT token
3. **Password Security**: Passwords stored only as bcrypt hashes
4. **Session Management**: JWT tokens with configurable expiration