import { forwardRef, useImperativeHandle, useRef } from 'react'
import { View } from 'react-native'

import { createStyle } from '@/utils/tools'
import SourceSelector, { type SourceSelectorType } from './SourceSelector'
import { useTheme } from '@/store/theme/hook'
import ActiveListName, { type ActiveListNameType } from './ActiveListName'
import { BorderWidths } from '@/theme'

export interface HeaderBarProps {
  onShowBound: () => void
  onSourceChange: (source: LX.OnlineSource) => void
}

export interface HeaderBarType {
  setBound: (source: LX.OnlineSource, id: string, name: string) => void
}

export default forwardRef<HeaderBarType, HeaderBarProps>(({ onShowBound, onSourceChange }, ref) => {
  const activeListNameRef = useRef<ActiveListNameType>(null)
  const sourceSelectorRef = useRef<SourceSelectorType>(null)
  const theme = useTheme()

  useImperativeHandle(
    ref,
    () => ({
      setBound(source, id, name) {
        sourceSelectorRef.current?.setSource(source)
        activeListNameRef.current?.setBound(id, name)
      },
    }),
    []
  )

  return (
    <View
      style={{
        ...styles.currentList,
        backgroundColor: theme['c-content-background'],
        borderBottomColor: theme['c-border-background'],
      }}
    >
      <SourceSelector ref={sourceSelectorRef} onSourceChange={onSourceChange} />
      <ActiveListName ref={activeListNameRef} onShowBound={onShowBound} />
    </View>
  )
})

const styles = createStyle({
  currentList: {
    flexDirection: 'row',
    height: 56,
    zIndex: 2,
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: BorderWidths.normal,
  },
})
