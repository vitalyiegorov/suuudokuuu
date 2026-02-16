---
description: Comprehensive analysis of Budgie features, modules, or the entire monorepo
---

Read-only analysis of the Budgie monorepo. If asked to implement changes, respond: "This is an analysis-only operation. Please use a different command to implement changes."

## Request

$ARGUMENTS

## Execution

### 1. Spawn Analyze Agents

Use the Task tool with `subagent_type="analyze"`.

**Agent count:**
- User specifies a number → spawn that many
- Specific question ("what does TransactionService do", "where is X defined") → 1 agent
- Feature, module, or broad request → multiple agents by area

**For multiple agents**, distribute by focus area:

| Area | Scope |
|------|-------|
| App | screens, components, UI patterns |
| Data | services, repositories |
| Contracts | schemas, tables, entities |
| Tests | tests, cross-cutting concerns |

Rephrase the request naturally for each agent's scope.

### 2. Synthesize Results

Combine agent findings into a single report. The analyze agent handles format and Budgie standards.
