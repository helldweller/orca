import { createGlobalSettingsFixture } from '../../../../../shared/settings/global-settings-test-fixture'
import { defineFixture } from '../../../component-fixtures/component-fixture'
import { NativeChatComposerActions } from '../composer/controls/NativeChatComposerActions'

const noop = (): void => {}

function composerRow(idleMs: number): React.JSX.Element {
  return (
    <div className="flex h-24 items-end bg-background p-4">
      <NativeChatComposerActions
        attachDisabled={false}
        dictationDisabled={false}
        sendDisabled
        isWorking={false}
        isDictating={false}
        isDictationHoldMode={false}
        onAttach={noop}
        onDictationToggle={noop}
        onDictationHoldStart={noop}
        onDictationHoldEnd={noop}
        onSend={noop}
        sessionOptionsSurface={null}
        sessionOptionsSnapshot={[]}
        promptCacheUsedAt={Date.now() - idleMs}
        agent="claude"
      />
    </div>
  )
}

async function hoverCacheClock(frame: HTMLElement): Promise<void> {
  frame
    .querySelector('[data-native-chat-prompt-cache]')
    ?.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerType: 'mouse' }))
  await new Promise((resolve) => setTimeout(resolve, 800))
}

const store = { settings: createGlobalSettingsFixture({ promptCacheTimerEnabled: true }) }

export const warm = defineFixture({
  width: 420,
  store,
  render: () => composerRow(78_000),
  interact: hoverCacheClock
})

export const expired = defineFixture({
  width: 420,
  store,
  render: () => composerRow((17 * 60 + 37) * 60_000),
  interact: hoverCacheClock
})
