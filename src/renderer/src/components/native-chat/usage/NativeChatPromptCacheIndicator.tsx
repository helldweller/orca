import { Timer } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useIntlLocale, useTranslate } from '@/i18n/use-translate'
import { cn } from '@/lib/class-names'
import {
  formatPromptCacheCountdown,
  usePromptCacheCountdownNow
} from '@/components/sidebar/workspace-card/activity/prompt-cache-countdown-clock'
import { formatLocalizedDuration } from '@/components/status-bar/usage/usage-reset-caption'

/** Composer clock for Claude's prompt cache: muted while warm, a warning once idle past the TTL. */
export function NativeChatPromptCacheIndicator({
  usedAt,
  ttlMs
}: {
  usedAt: number
  ttlMs: number
}): React.JSX.Element {
  const t = useTranslate()
  const intlLocale = useIntlLocale()
  const idleMs = Math.max(0, usePromptCacheCountdownNow(true) - usedAt)
  const remainingMs = ttlMs - idleMs
  const expired = remainingMs <= 0
  const label = expired
    ? t(
        'components.native-chat.promptCache.expired',
        'Prompt cache likely expired (idle {{idle}}).',
        { idle: formatLocalizedDuration(idleMs, intlLocale) }
      )
    : t('components.native-chat.promptCache.expiresIn', 'Prompt cache expires in {{time}}', {
        time: formatPromptCacheCountdown(remainingMs)
      })
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          role="img"
          aria-label={label}
          data-native-chat-prompt-cache={expired ? 'expired' : 'warm'}
          className={cn(
            'flex size-7 items-center justify-center pointer-coarse:size-11',
            expired ? 'text-chat-warning' : 'text-muted-foreground'
          )}
        >
          <Timer className="size-4" />
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={4}>
        {label}
      </TooltipContent>
    </Tooltip>
  )
}
