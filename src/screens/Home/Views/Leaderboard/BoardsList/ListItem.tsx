import { useCallback, useRef } from 'react'
import { View } from 'react-native'
import Text from '@/components/common/Text'
import { useTheme } from '@/store/theme/hook'
import Button, { type BtnType } from '@/components/common/Button'
import { createStyle } from '@/utils/tools'
import { type BoardItem } from '@/store/leaderboard/state'
import { BorderWidths } from '@/theme'

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
              ? theme['c-primary-alpha-900']
              : theme['c-button-background'],
        borderColor: theme['c-border-background'],
      }}
      key={item.id}
      onLongPress={setPosition}
      onPress={() => {
        onBoundChange(item)
      }}
    >
      {active ? (
        <View style={{ ...styles.activeIndicator, backgroundColor: theme['c-primary'] }} />
      ) : null}

      <View style={styles.indexContent}>
        <Text
          style={styles.indexText}
          size={17}
          color={active ? theme['c-primary'] : theme['c-500']}
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
          <Text style={styles.listDesc} size={12} color={theme['c-font-label']} numberOfLines={1}>
            {item.desc}
          </Text>
        ) : null}
      </View>

      <View style={styles.listRight}>
        {item.isHot ? (
          <View style={{ ...styles.hotTag, backgroundColor: theme['c-primary-alpha-800'] }}>
            <Text size={10} color={theme['c-primary']}>
              热门
            </Text>
          </View>
        ) : null}
        {item.playCount ? (
          <Text style={styles.listCount} size={12} color={theme['c-font-label']}>
            {`${item.playCount}万`}
          </Text>
        ) : null}
      </View>
    </Button>
  )
}

const styles = createStyle({
  button: {
    minHeight: 72,
    marginHorizontal: 14,
    marginBottom: 8,
    paddingVertical: 14,
    paddingLeft: 18,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: BorderWidths.normal,
    overflow: 'hidden',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  indexContent: {
    width: 26,
    alignItems: 'flex-start',
  },
  indexText: {
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  listContent: {
    flex: 1,
    minWidth: 0,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  listName: {
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  listDesc: {
    marginTop: 5,
    letterSpacing: 0.1,
  },
  listRight: {
    marginLeft: 10,
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
  },
  listCount: {
    letterSpacing: 0.2,
  },
  hotTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
})
