import type { AgentSessionLatestTurn } from '../agent-session-wire'
import type { StructuredAgentHostClock } from './live-read/structured-agent-session-reducer'

/** Client-clock time the provider last read the prompt cache: a settled turn's end, else the open turn's newest response or start. */
export function agentSessionPromptCacheUsedAt(
  latestTurn: AgentSessionLatestTurn | null | undefined,
  hostClock: StructuredAgentHostClock | null | undefined
): number | null {
  if (!latestTurn) {
    return null
  }
  const { turn } = latestTurn
  const used = turn.contextUsage?.used
  const hostAt =
    turn.completedAt ??
    (used?.kind === 'estimate' ? used.capturedAt : undefined) ??
    turn.startedAt ??
    latestTurn.observedAt
  if (!hostClock) {
    return hostAt
  }
  // A remote host's clock can drift; whole seconds keep per-frame latency jitter from re-rendering the composer.
  return hostAt + Math.round((hostClock.receivedAt - hostClock.hostNow) / 1000) * 1000
}
