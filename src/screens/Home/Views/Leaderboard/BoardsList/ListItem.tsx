import { useCallback, useRef } from 'react'
import { View } from 'react-native'
import Text from '@/components/common/Text'
import { useTheme } from '@/store/theme/hook'
import Button, { type BtnType } from '@/components/common/Button'
import { createStyle } from '@/utils/tools'
import { type BoardItem } from '@/store/leaderboard/state'
import { Icon } from '@/components/common/Icon'

export interface ListItemProps {
  item: BoardItem
  index: number
  longPressIndex: number
  activeId: string
  onShowMenu: (
    id: string,
    name: string,
    index: number,
    position: { x: number; y: number; w: number; h: number }
  ) => void
  onBoundChange: (item: BoardItem) => void
}

export default ({
  item,
  activeId,
  index,
  longPressIndex,
  onBoundChange,
  onShowMenu,
}: ListItemProps) => {
  const theme = useTheme()
  const buttonRef = useRef<BtnType>(null)

  const setPosition = useCallback(() => {
    if (buttonRef.current?.measure) {
      buttonRef.current.measure((fx, fy, width, height, px, py) => {
        onShowMenu(item.id, item.name, index, {
          x: Math.ceil(px),
          y: Math.ceil(py),
          w: Math.ceil(width),
          h: Math.ceil(height),
        })
      })
    }
  }, [index, item, onShowMenu])

  const active = activeId == item.id

  return (
    <Button
      ref={buttonRef}
      style={{
        ...styles.button,
        backgroundColor:
          index == longPressIndex
            ? theme['c-button-background-active']
            : active
              ? theme['c-primary-alpha-100']
              : theme['c-button-background'],
        borderColor: active ? theme['c-primary'] : theme['c-200'],
      }}
      key={item.id}
      onLongPress={setPosition}
      onPress={() => {
        onBoundChange(item)
      }}
    >
      <View
        style={{
          ...styles.activeIndicator,
          backgroundColor: active ? theme['c-primary'] : 'transparent',
        }}
      />

      <View style={styles.listItemContent}>
        <View
          style={{
            ...styles.coverWrapper,
            backgroundColor: active ? theme['c-primary'] : theme['c-200'],
          }}
        >
          <Text
            style={styles.coverText}
            size={20}
            color={active ? theme['c-primary-font-active'] : theme['c-500']}
          >
            {index + 1}
          </Text>
        </View>

        <View style={styles.listContent}>
          <Text
            style={styles.listName}
            size={15}
            textBreakStrategy="simple"
            color={active ? theme['c-primary-font-active'] : theme['c-font']}
            numberOfLines={1}
          >
            {item.name}
          </Text>

          {item.desc ? (
            <Text style={styles.listDesc} size={12} color={theme['c-500']} numberOfLines={2}>
              {item.desc}
            </Text>
          ) : null}
        </View>

        <View style={styles.listRight}>
          {item.playCount ? (
            <Text style={styles.listCount} size={13} color={theme['c-400']}>
              {`${item.playCount}万`}
            </Text>
          ) : null}
          {item.isHot && (
            <View style={{ ...styles.hotTag, backgroundColor: theme['c-primary'] + '25' }}>
              <Text size={11} color={theme['c-primary']}>
                热门
              </Text>
            </View>
          )}
          {active ? <Icon name="chevron-right" size={16} color={theme['c-primary']} /> : null}
        </View>
      </View>
    </Button>
  )
}

const styles = createStyle({
  button: {
    minHeight: 88,
    marginHorizontal: 12,
    marginVertical: 5,
    paddingVertical: 12,
    paddingRight: 14,
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  activeIndicator: {
    width: 4,
    borderRadius: 4,
    marginRight: 10,
  },
  listItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  coverWrapper: {
    width: 56,
    height: 56,
    marginRight: 14,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverText: {
    fontWeight: '700',
    fontSize: 22,
  },
  listContent: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  listName: {
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  listDesc: {
    opacity: 0.6,
    letterSpacing: 0.1,
  },
  listRight: {
    minWidth: 44,
    marginLeft: 8,
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
  },
  listCount: {
    fontWeight: '500',
    opacity: 0.7,
  },
  hotTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
})
