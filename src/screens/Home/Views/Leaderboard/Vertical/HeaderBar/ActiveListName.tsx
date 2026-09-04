import { forwardRef, useImperativeHandle, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { useTheme } from '@/store/theme/hook'
import { createStyle } from '@/utils/tools'
import Text from '@/components/common/Text'
import { Icon } from '@/components/common/Icon'

export interface ActiveListNameProps {
  onShowBound: () => void
}
export interface ActiveListNameType {
  setBound: (id: string, name: string) => void
}

export default forwardRef<ActiveListNameType, ActiveListNameProps>(({ onShowBound }, ref) => {
  const theme = useTheme()
  let [currentListName, setCurrentListName] = useState('')

  useImperativeHandle(
    ref,
    () => ({
      setBound(id, name) {
        setCurrentListName(name)
      },
    }),
    []
  )

  return (
    <TouchableOpacity onPress={onShowBound} style={styles.currentList} activeOpacity={0.7}>
      <Text numberOfLines={1} style={styles.currentListText} color={theme['c-font']} size={17}>
        {currentListName}
      </Text>
      <Icon name="chevron-right" size={16} color={theme['c-font-label']} />
    </TouchableOpacity>
  )
})

const styles = createStyle({
  currentList: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  currentListText: {
    flex: 1,
    fontWeight: '600',
    letterSpacing: 0.2,
    paddingRight: 8,
  },
})
