import Text from '@/components/common/Text'
import { useI18n } from '@/lang'
import { useSettingValue } from '@/store/setting/hook'
import { useTheme } from '@/store/theme/hook'
import { createStyle } from '@/utils/tools'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Icon } from '@/components/common/Icon'
import HistorySearch, { type HistorySearchType } from './HistorySearch'
import HotSearch, { type HotSearchType } from './HotSearch'

interface BlankViewProps {
  onSearch: (keyword: string) => void
}
type Source = LX.OnlineSource | 'all'

export interface BlankViewType {
  show: (source: Source) => void
}

export default forwardRef<BlankViewType, BlankViewProps>(({ onSearch }, ref) => {
  // const [listType, setListType] = useState<SearchState['searchType']>('music')
  const [visible, setVisible] = useState(false)
  const hotSearchRef = useRef<HotSearchType>(null)
  const historySearchRef = useRef<HistorySearchType>(null)
  const isShowHotSearch = useSettingValue('search.isShowHotSearch')
  const isShowHistorySearch = useSettingValue('search.isShowHistorySearch')
  const t = useI18n()
  const theme = useTheme()

  const handleShow = (source: Source) => {
    hotSearchRef.current?.show(source)
    historySearchRef.current?.show()
  }

  useImperativeHandle(
    ref,
    () => ({
      show(source) {
        if (visible) handleShow(source)
        else {
          setVisible(true)
          requestAnimationFrame(() => {
            handleShow(source)
          })
        }
      },
    }),
    [visible]
  )

  return visible ? (
    isShowHotSearch || isShowHistorySearch ? (
      <ScrollView>
        <View style={styles.content}>
          <View style={{ ...styles.welcomeCard, backgroundColor: theme['c-primary-alpha-900'] }}>
            <View style={{ ...styles.welcomeIcon, backgroundColor: theme['c-primary-alpha-200'] }}>
              <Icon name="search-2" color={theme['c-primary-font-active']} size={22} />
            </View>
            <View style={styles.welcomeText}>
              <Text size={18}>{t('search__welcome')}</Text>
              <Text size={12} color={theme['c-font-label']}>
                搜索歌曲、歌手和歌单
              </Text>
            </View>
          </View>
          {isShowHotSearch ? <HotSearch ref={hotSearchRef} onSearch={onSearch} /> : null}
          {isShowHistorySearch ? (
            <HistorySearch ref={historySearchRef} onSearch={onSearch} />
          ) : null}
        </View>
      </ScrollView>
    ) : (
      <View style={styles.welcome}>
        <View style={{ ...styles.welcomeCard, backgroundColor: theme['c-primary-alpha-900'] }}>
          <View style={{ ...styles.welcomeIcon, backgroundColor: theme['c-primary-alpha-200'] }}>
            <Icon name="search-2" color={theme['c-primary-font-active']} size={28} />
          </View>
          <View style={styles.welcomeText}>
            <Text size={22} color={theme['c-font-label']}>
              {t('search__welcome')}
            </Text>
            <Text size={13} color={theme['c-font-label']}>
              搜索歌曲、歌手和歌单
            </Text>
          </View>
        </View>
      </View>
    )
  ) : null
})

const styles = createStyle({
  content: {
    // paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
  welcome: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  welcomeCard: {
    width: '100%',
    padding: 18,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  welcomeText: {
    flex: 1,
  },
})
