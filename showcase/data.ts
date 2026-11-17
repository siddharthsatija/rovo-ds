import type { AISource, SuggestedPrompt, ThinkingStep } from '../src';

export const prompts: SuggestedPrompt[] = [
  { id: 'p1', label: 'Summarize what changed this week', description: 'Across pages and issues you follow.' },
  { id: 'p2', label: 'What are the blockers for Atlas?', description: 'Pulls open risks from Jira and Confluence.' },
  { id: 'p3', label: 'Draft a status update for my team', description: 'Uses your recent work and team goals.' },
  { id: 'p4', label: 'Find who owns the billing API', description: 'Searches teams, repos and on-call.' },
];

export const demoSteps: ThinkingStep[] = [
  { id: 's1', label: 'Understood your question', status: 'done' },
  { id: 's2', label: 'Searched Jira', status: 'done', detail: '12 issues in ATLAS' },
  { id: 's3', label: 'Searched Confluence', status: 'done', detail: '4 pages in the Atlas space' },
  { id: 's4', label: 'Wrote the answer', status: 'done' },
];

export const demoSources: AISource[] = [
  { id: 'a', title: 'Atlas launch plan', product: 'Confluence', icon: 'page' },
  { id: 'b', title: 'ATLAS-412 SSO migration', product: 'Jira', icon: 'link' },
  { id: 'c', title: 'Billing API rate limits', product: 'Confluence', icon: 'page' },
];
