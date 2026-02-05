# Research: AI-Powered Todo Chatbot

## Overview
This research document addresses the technical decisions and investigations required for implementing the AI-powered todo chatbot feature, focusing on OpenRouter integration, MCP tools architecture, and conversation management.

## Decision: OpenRouter API Integration
**Rationale**: OpenRouter provides an OpenAI-compatible API that supports function/tool calling capabilities required for the MCP tools integration. It offers multiple AI models including Mistral, Llama, Gemini, and Claude models, providing flexibility in model selection without vendor lock-in.

**Alternatives considered**:
- OpenAI API directly: Would create vendor lock-in and higher costs
- Self-hosted models: Higher infrastructure complexity and maintenance
- Other AI providers: Limited function calling support or higher costs

## Decision: MCP Tools Architecture
**Rationale**: The Model Context Protocol (MCP) tools architecture provides a clean separation between the AI agent and the business logic. The agent handles intent detection and tool selection while the tools wrap existing task services, preventing business logic duplication.

**Alternatives considered**:
- Direct API calls from agent: Would mix AI logic with business logic
- Embedding business logic in agent: Would violate the "no duplication" requirement
- Separate microservices: Over-engineering for this use case

## Decision: Conversation State Management
**Rationale**: Storing conversation history in the database with conversation and message models allows for persistent, stateless server architecture while maintaining context across user sessions. This approach aligns with the requirement for conversation persistence.

**Alternatives considered**:
- In-memory storage: Would lose context on server restarts
- Client-side storage: Would not work across devices or sessions
- External cache (Redis): Adds infrastructure complexity for limited benefit

## Decision: Multi-Language Support (English + Roman Urdu)
**Rationale**: The AI model and system prompts are configured to understand both English and Roman Urdu, allowing users to switch between languages naturally. This requires careful prompt engineering to ensure consistent understanding.

**Alternatives considered**:
- Separate language models: Higher costs and complexity
- Translation layer: Would add latency and potential translation errors
- Single language support: Would not meet feature requirements

## Decision: Stateless Backend Architecture
**Rationale**: Maintaining a stateless backend improves scalability and reliability while using the database to store conversation context. This aligns with the requirement for a stateless server that remains functional regardless of server restarts.

**Alternatives considered**:
- Session-based state: Would complicate scaling and introduce failure points
- Shared memory: Would create tight coupling between server instances

## Decision: Frontend Integration Approach
**Rationale**: The chat UI will be integrated into the existing Next.js application using React components that follow the same patterns as existing UI elements. This maintains consistency with the existing codebase while adding the new functionality.

**Alternatives considered**:
- Separate SPA: Would complicate authentication and navigation
- iframe integration: Would create styling and communication challenges