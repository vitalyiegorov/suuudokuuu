---
description: Comprehensive read-only analysis of Suuudokuuu features, packages, or the monorepo
---

Read-only analysis of the Suuudokuuu monorepo. If asked to implement changes, respond: "This is an analysis-only operation. Please use a different command to implement changes."

## Request

$ARGUMENTS

## Execution

### 1. Spawn Analyze Agents

Use the Task tool with `subagent_type="analyze"`.

Agent count:

- Specific question about one class, component, route, or utility: 1 agent
- Feature, package, or cross-cutting question: multiple agents by area
- Full monorepo analysis: one agent per major area

For multiple agents, distribute by focus area:

| Area | Scope |
| --- | --- |
| App | Expo Router routes, screens, components, Redux, themes, i18n |
| Generator | Sudoku class, DLX solver, difficulty config, puzzle interfaces |
| Encoder | Binary formats, solution steps, URL-safe game-state serialization |
| Tests | Jest coverage, Maestro flows, selectors, deep-link fixtures |

Rephrase the request naturally for each agent's scope.

### 2. Synthesize Results

Combine agent findings into one report with concrete file references. The analyze agent handles report structure and Suuudokuuu standards.
