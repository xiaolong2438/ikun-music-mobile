import Text from '@/components/common/Text'
import { useI18n } from '@/lang'
import { useSettingValue } from '@/store/setting/hook'
import { useTheme } from '@/store/theme/hook'
import { createStyle } from '@/utils/tools'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Icon } from '@/components/common/Icon'
import { BorderWidths } from '@/theme'
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
          <View
            style={{
              ...styles.welcomeCard,
              backgroundColor: theme['c-primary-alpha-900'],
              borderColor: theme['c-border-background'],
            }}
          >
            <View style={{ ...styles.welcomeIcon, backgroundColor: theme['c-primary-alpha-800'] }}>
              <Icon name="search-2" color={theme['c-primary']} size={20} />
            </View>
            <View style={styles.welcomeText}>
              <Text style={styles.welcomeTitle} size={17}>
                {t('search__welcome')}
              </Text>
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
        <View style={{ ...styles.blankIcon, backgroundColor: theme['c-primary-alpha-900'] }}>
          <Icon name="search-2" color={theme['c-primary']} size={26} />
        </View>
        <Text style={styles.blankTitle} size={18} color={theme['c-font']}>
          {t('search__welcome')}
        </Text>
        <Text size={13} color={theme['c-font-label']}>
          搜索歌曲、歌手和歌单
        </Text>
      </View>
    )
  ) : null
})

const styles = createStyle({
  content: {
    paddingTop: 16,
    paddingBottom: 20,
    paddingLeft: 16,
    paddingRight: 16,
  },
  welcome: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  welcomeCard: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    borderWidth: BorderWidths.normal,
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  blankIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  blankTitle: {
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
})
