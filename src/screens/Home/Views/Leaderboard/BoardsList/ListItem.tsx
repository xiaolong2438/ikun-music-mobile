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
  onShowMenu: (id: string, name: string, index: number, position: { x: number; y: number; w: number; h: number }) => void
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
        backgroundColor: index == longPressIndex ? theme['c-button-background-active'] : undefined,
      }}
      key={item.id}
      onLongPress={setPosition}
      onPress={() => {
        onBoundChange(item)
      }}
    >
      {active ? (
        <Icon
          style={styles.listActiveIcon}
          name="chevron-right"
          size={12}
          color={theme['c-primary-font']}
        />
      ) : null}

      <View style={styles.listItemContent}>
        <View style={{ ...styles.coverWrapper, backgroundColor: theme['c-200'] }}>
          <Text style={styles.coverText} size={20} color={theme['c-500']}>
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
            <Text style={styles.listDesc} size={12} color={theme['c-500']}>
              {item.desc}
            </Text>
          ) : null}
        </View>

        <View style={styles.listRight}>
          <Text style={styles.listCount} size={13} color={theme['c-400']}>
            {item.playCount ? `${item.playCount}万` : ''}
          </Text>
          {item.isHot && (
            <View style={{ ...styles.hotTag, backgroundColor: theme['c-primary'] + '25' }}>
              <Text size={11} color={theme['c-primary']}>热门</Text>
            </View>
          )}
        </View>
      </View>
    </Button>
  )
}

const styles = createStyle({
  button: {
    paddingLeft: 12,
    paddingRight: 16,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 4,
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
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
  },
  listCount: {
    fontWeight: '500',
    opacity: 0.7,
  },
  hotTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  listActiveIcon: {
    marginLeft: 4,
    marginRight: 4,
    textAlign: 'center',
  },
})
