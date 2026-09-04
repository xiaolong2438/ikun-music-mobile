import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { View } from 'react-native'
import { type Source, type InitState } from '@/store/hotSearch/state'
import Button from '@/components/common/Button'
import { getList } from '@/core/hotSearch'
import Text from '@/components/common/Text'
import { createStyle } from '@/utils/tools'
import { useTheme } from '@/store/theme/hook'
import { useI18n } from '@/lang'

interface ListProps {
  onSearch: (keyword: string) => void
}
export interface HotSearchType {
  show: (source: Source) => void
}

export type List = NonNullable<InitState['sourceList'][keyof InitState['sourceList']]>

const ListItem = ({
  keyword,
  onSearch,
}: {
  keyword: string
  onSearch: (keyword: string) => void
}) => {
  const theme = useTheme()
  return (
    <Button
      style={{
        ...styles.button,
        backgroundColor: theme['c-button-background'],
      }}
      onPress={() => {
        onSearch(keyword)
      }}
    >
      <Text color={theme['c-font']} size={13}>
        {keyword}
      </Text>
    </Button>
  )
}

export default forwardRef<HotSearchType, ListProps>((props, ref) => {
  // const [listType, setListType] = useState<SearchState['searchType']>('music')
  // const listRef = useRef<MusicListType>(null)
  const [list, setList] = useState<List>([])
  const t = useI18n()
  const theme = useTheme()

  const isUnmountedRef = useRef(false)
  useEffect(() => {
    isUnmountedRef.current = false
    return () => {
      isUnmountedRef.current = true
    }
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      show(source) {
        void getList(source).then((list) => {
          if (isUnmountedRef.current) return
          setList(list)
        })
      },
    }),
    []
  )

  return list.length ? (
    <View>
      <Text style={styles.title} size={13} color={theme['c-font-label']}>
        {t('search_hot_search')}
      </Text>
      <View style={styles.list}>
        {list.map((keyword) => (
          <ListItem keyword={keyword} key={keyword} onSearch={props.onSearch} />
        ))}
      </View>
    </View>
  ) : null
})

const styles = createStyle({
  title: {
    paddingTop: 24,
    paddingBottom: 4,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    textAlign: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
    marginTop: 10,
  },
})
