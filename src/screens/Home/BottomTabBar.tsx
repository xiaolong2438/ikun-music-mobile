import { useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Icon } from '@/components/common/Icon'
import Text from '@/components/common/Text'
import { useNavActiveId } from '@/store/common/hook'
import { setNavActiveId } from '@/core/common'
import { useTheme } from '@/store/theme/hook'
import { createStyle } from '@/utils/tools'

const TABS = [
  { id: 'nav_home', icon: 'home', label: '首页' },
  { id: 'nav_search', icon: 'search-2', label: '搜索' },
  { id: 'nav_songlist', icon: 'album', label: '歌单' },
  { id: 'nav_top', icon: 'leaderboard', label: '排行' },
  { id: 'nav_love', icon: 'love', label: '我的' },
] as const

export default () => {
  const activeId = useNavActiveId()
  const theme = useTheme()
  const backgroundColor = useMemo(() => theme['c-content-background'], [theme])

  return (
    <View
      style={{ ...styles.container, backgroundColor, borderTopColor: theme['c-border-background'] }}
    >
      {TABS.map((tab) => {
        const active = activeId == tab.id
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            activeOpacity={0.7}
            onPress={() => setNavActiveId(tab.id)}
          >
            <View
              style={{
                ...styles.iconWrap,
                backgroundColor: active ? theme['c-primary-background'] : 'transparent',
              }}
            >
              <Icon
                name={tab.icon}
                color={active ? theme['c-primary'] : theme['c-450']}
                size={18}
              />
            </View>
            <Text color={active ? theme['c-primary'] : theme['c-450']} size={10}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = createStyle({
  container: {
    flexDirection: 'row',
    height: 62,
    borderTopWidth: 1,
    paddingHorizontal: 8,
    paddingTop: 5,
    paddingBottom: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  iconWrap: {
    width: 34,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
