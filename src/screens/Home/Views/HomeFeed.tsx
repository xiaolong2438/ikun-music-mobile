import { memo, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import Text from '@/components/common/Text'
import Image from '@/components/common/Image'
import { Icon } from '@/components/common/Icon'
import { useTheme } from '@/store/theme/hook'
import songlistState, { type ListInfoItem, type Source } from '@/store/songlist/state'
import { getList, getSortList, getTags } from '@/core/songlist'
import { navigations } from '@/navigation'
import commonState from '@/store/common/state'
import { setNavActiveId } from '@/core/common'
import { createStyle } from '@/utils/tools'

const QUICK_ACTIONS = [
  { id: 'nav_search', icon: 'search-2', label: '搜索音乐' },
  { id: 'nav_songlist', icon: 'album', label: '歌单' },
  { id: 'nav_top', icon: 'leaderboard', label: '排行榜' },
  { id: 'nav_love', icon: 'love', label: '我的音乐' },
] as const

const HomeFeed = () => {
  const theme = useTheme()
  const [lists, setLists] = useState<ListInfoItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const source = songlistState.sources[0] as Source | undefined
      if (!source) {
        setLoading(false)
        return
      }
      try {
        const sorts = getSortList(source)
        const sortId = sorts?.[0]?.id ?? 'recommend'
        const tags = await getTags(source)
        const tagId = tags.hotTag?.[0]?.id ?? tags.tags?.[0]?.list?.[0]?.id ?? ''
        const result = await getList(source, tagId, sortId, 1)
        if (!cancelled) setLists(result.list ?? [])
      } catch {
        if (!cancelled) setLists([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const featured = useMemo(() => lists.slice(0, 6), [lists])
  const sections = useMemo(
    () => [
      { title: '为你推荐的歌单', items: lists.slice(0, 6) },
      { title: '热门精选', items: lists.slice(2, 8) },
      { title: '新歌速递', items: lists.slice(4, 10) },
    ],
    [lists]
  )

  const openList = (item: ListInfoItem) => {
    if (!commonState.componentIds.home) return
    navigations.pushSonglistDetailScreen(commonState.componentIds.home, item)
  }

  return (
    <ScrollView
      style={{ ...styles.container, backgroundColor: theme['c-content-background'] }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      <View style={styles.topRow}>
        <View>
          <Text style={styles.greeting} color={theme['c-500']} size={12}>
            为你准备的音乐
          </Text>
          <Text style={styles.title} color={theme['c-font']} size={26}>
            首页
          </Text>
        </View>
        <TouchableOpacity
          style={{ ...styles.avatar, backgroundColor: theme['c-primary-background'] }}
          onPress={() => setNavActiveId('nav_setting')}
        >
          <Icon name="setting" color={theme['c-primary']} size={20} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{ ...styles.searchBar, backgroundColor: theme['c-primary-background'] }}
        activeOpacity={0.8}
        onPress={() => setNavActiveId('nav_search')}
      >
        <Icon name="search-2" color={theme['c-450']} size={18} />
        <Text style={styles.searchText} color={theme['c-450']}>
          搜索你喜欢的音乐
        </Text>
        <Icon name="search-2" color={theme['c-450']} size={16} />
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={theme['c-primary']} />
        </View>
      ) : featured.length ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardRow}
        >
          {featured.map((item, index) => (
            <TouchableOpacity
              key={`${item.source}-${item.id}-${index}`}
              style={{
                ...styles.featureCard,
                backgroundColor: index % 2 ? theme['c-primary-dark-300'] : theme['c-primary'],
              }}
              activeOpacity={0.9}
              onPress={() => openList(item)}
            >
              <Image url={item.img} style={styles.featureImage} resizeMode="cover" />
              <View style={styles.featureShade} />
              <View style={styles.featureInfo}>
                <Text color="#fff" size={18} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text color="rgba(255,255,255,0.75)" size={11} numberOfLines={1}>
                  {item.desc || '精选歌单'}
                </Text>
                <View style={styles.playBadge}>
                  <Icon name="play" color={theme['c-primary']} size={12} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={{ ...styles.emptyCard, backgroundColor: theme['c-primary-background'] }}>
          <Icon name="album" color={theme['c-primary']} size={24} />
          <Text color={theme['c-500']} style={styles.emptyText}>
            暂无推荐内容，请先配置音乐源
          </Text>
        </View>
      )}

      <View style={styles.quickRow}>
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={{ ...styles.quickAction, backgroundColor: theme['c-primary-background'] }}
            onPress={() => setNavActiveId(action.id)}
          >
            <Icon name={action.icon} color={theme['c-primary']} size={18} />
            <Text style={styles.quickLabel} color={theme['c-font']} size={11}>
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {sections.map((section) => (
        <View key={section.title} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text color={theme['c-font']} size={18} style={styles.sectionTitle}>
              {section.title}
            </Text>
            <TouchableOpacity onPress={() => setNavActiveId('nav_songlist')}>
              <Text color={theme['c-500']} size={12}>
                更多 ›
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.gridRow}
          >
            {section.items.map((item) => (
              <TouchableOpacity
                key={`${section.title}-${item.source}-${item.id}`}
                style={styles.listCard}
                onPress={() => openList(item)}
              >
                <View style={styles.coverWrap}>
                  <Image url={item.img} style={styles.cover} resizeMode="cover" />
                  <View style={styles.coverPlay}>
                    <Icon name="play" color="#fff" size={11} />
                  </View>
                </View>
                <Text color={theme['c-font']} size={12} numberOfLines={2} style={styles.cardTitle}>
                  {item.name}
                </Text>
                <Text color={theme['c-500']} size={10} numberOfLines={1}>
                  {item.play_count || item.author || '精选推荐'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ))}

      <View style={{ ...styles.rankPanel, backgroundColor: theme['c-primary-background'] }}>
        <View style={styles.sectionHeader}>
          <Text color={theme['c-font']} size={18}>
            排行榜
          </Text>
          <TouchableOpacity onPress={() => setNavActiveId('nav_top')}>
            <Text color={theme['c-500']} size={12}>
              查看全部 ›
            </Text>
          </TouchableOpacity>
        </View>
        {[0, 1, 2].map((rank) => (
          <View key={rank} style={styles.rankRow}>
            <Text color={theme['c-primary']} size={16} style={styles.rankNumber}>
              {rank + 1}
            </Text>
            <View style={{ ...styles.rankDot, backgroundColor: theme['c-primary-alpha-600'] }} />
            <Text color={theme['c-font']} size={13} numberOfLines={1} style={styles.rankText}>
              {lists[rank]?.name || '热门歌曲排行榜'}
            </Text>
            <Icon name="chevron-right" color={theme['c-500']} size={14} />
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = createStyle({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 28 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  greeting: { marginBottom: 2 },
  title: { fontWeight: '700' },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchText: { flex: 1, marginLeft: 8 },
  cardRow: { gap: 12, paddingBottom: 4 },
  featureCard: { width: 238, height: 158, borderRadius: 18, overflow: 'hidden' },
  featureImage: { ...StyleSheet.absoluteFillObject },
  featureShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  featureInfo: { flex: 1, justifyContent: 'flex-end', padding: 15 },
  playBadge: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: { height: 158, justifyContent: 'center', alignItems: 'center' },
  emptyCard: { height: 158, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  emptyText: { marginTop: 8 },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  quickAction: {
    width: '23%',
    minHeight: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: { marginTop: 5 },
  section: { marginTop: 25 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: { fontWeight: '700' },
  gridRow: { gap: 12 },
  listCard: { width: 120 },
  coverWrap: {
    width: 120,
    height: 120,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  cover: { width: '100%', height: '100%' },
  coverPlay: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { marginTop: 7, lineHeight: 17 },
  rankPanel: { marginTop: 25, borderRadius: 18, padding: 14 },
  rankRow: { flexDirection: 'row', alignItems: 'center', minHeight: 42 },
  rankNumber: { width: 22, fontWeight: '700' },
  rankDot: { width: 28, height: 28, borderRadius: 8, marginRight: 10 },
  rankText: { flex: 1 },
})

export default memo(HomeFeed)
