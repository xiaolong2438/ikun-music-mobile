import { View } from 'react-native'
import { BorderWidths } from '@/theme'
import { useTheme } from '@/store/theme/hook'
import { useNavActiveId, useStatusbarHeight } from '@/store/common/hook'
import { useI18n } from '@/lang'
import { createStyle } from '@/utils/tools'
import Text from '@/components/common/Text'
import StatusBar from '@/components/common/StatusBar'
import { useSettingValue } from '@/store/setting/hook'
import { scaleSizeH } from '@/utils/pixelRatio'
import { HEADER_HEIGHT } from '@/config/constant'
import { type InitState as CommonState } from '@/store/common/state'
import SearchTypeSelector from '@/screens/Home/Views/Search/SearchTypeSelector'

const headerComponents: Partial<Record<CommonState['navActiveId'], React.ReactNode>> = {
  nav_search: <SearchTypeSelector />,
}

const Header = () => {
  const theme = useTheme()
  const id = useNavActiveId()
  const t = useI18n()
  const statusBarHeight = useStatusbarHeight()
  const drawerLayoutPosition = useSettingValue('common.drawerLayoutPosition')

  if (id == 'nav_home') {
    return <StatusBar />
  }

  return (
    <>
      <StatusBar />
      <View
        style={{
          ...styles.container,
          height: scaleSizeH(HEADER_HEIGHT) + statusBarHeight,
          paddingTop: statusBarHeight,
          borderBottomColor: theme['c-border-background'],
        }}
      >
        <View style={styles.titleWrap}>
          <Text
            style={drawerLayoutPosition == 'left' ? styles.leftTitle : styles.rightTitle}
            size={20}
          >
            {t(id)}
          </Text>
        </View>
        {headerComponents[id] ?? null}
      </View>
    </>
  )
}

const styles = createStyle({
  container: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderBottomWidth: BorderWidths.normal,
  },
  titleWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  leftTitle: {
    textAlign: 'left',
    fontWeight: '700',
  },
  rightTitle: {
    textAlign: 'right',
    fontWeight: '700',
  },
})

export default Header
