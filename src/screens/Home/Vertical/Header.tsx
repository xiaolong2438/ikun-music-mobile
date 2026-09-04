import { View, TouchableOpacity } from 'react-native'
// import Button from '@/components/common/Button'
// import { navigations } from '@/navigation'
import { BorderWidths } from '@/theme'
import { useTheme } from '@/store/theme/hook'
import { useNavActiveId, useStatusbarHeight } from '@/store/common/hook'
import { useI18n } from '@/lang'
import { createStyle } from '@/utils/tools'
import { Icon } from '@/components/common/Icon'
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

// const LeftTitle = () => {
//   const id = useNavActiveId()
//   const t = useI18n()

//   return <Text style={styles.leftTitle} size={18}>{t(id)}</Text>
// }
const LeftHeader = () => {
  const theme = useTheme()
  const id = useNavActiveId()
  const t = useI18n()
  const statusBarHeight = useStatusbarHeight()

  const openMenu = () => {
    global.app_event.changeMenuVisible(true)
  }

  return (
    <View
      style={{
        ...styles.container,
        height: scaleSizeH(HEADER_HEIGHT) + statusBarHeight,
        paddingTop: statusBarHeight,
        borderBottomColor: theme['c-border-background'],
      }}
    >
      <View style={styles.left}>
        <TouchableOpacity
          style={{ ...styles.btn, backgroundColor: theme['c-primary-alpha-900'] }}
          onPress={openMenu}
        >
          <Icon color={theme['c-font']} name="menu" size={18} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.titleBtn} onPress={openMenu}>
          <Text style={styles.leftTitle} size={20}>
            {id == 'nav_search' ? '首页' : t(id)}
          </Text>
        </TouchableOpacity>
      </View>
      {id == 'nav_search' ? null : (headerComponents[id] ?? null)}

      {/* <TouchableOpacity style={styles.btn} onPress={openSetting}>
        <Icon style={{ ...styles.btnText, color: theme['c-font'] }} name="setting" size={styles.btnText.fontSize} />
      </TouchableOpacity> */}
    </View>
  )
}

// const RightTitle = () => {
//   const id = useNavActiveId()
//   const t = useI18n()

//   return <Text style={styles.rightTitle} size={18}>{t(id)}</Text>
// }
const RightHeader = () => {
  const theme = useTheme()
  const t = useI18n()
  const id = useNavActiveId()
  const statusBarHeight = useStatusbarHeight()

  const openMenu = () => {
    global.app_event.changeMenuVisible(true)
  }
  return (
    <View
      style={{
        ...styles.container,
        height: scaleSizeH(HEADER_HEIGHT) + statusBarHeight,
        paddingTop: statusBarHeight,
        borderBottomColor: theme['c-border-background'],
      }}
    >
      <View style={styles.left}>
        <TouchableOpacity style={styles.titleBtn} onPress={openMenu}>
          <Text style={styles.rightTitle} size={20}>
            {id == 'nav_search' ? '首页' : t(id)}
          </Text>
        </TouchableOpacity>
      </View>
      {id == 'nav_search' ? null : (headerComponents[id] ?? null)}
      <TouchableOpacity
        style={{ ...styles.btn, backgroundColor: theme['c-primary-alpha-900'] }}
        onPress={openMenu}
      >
        <Icon color={theme['c-font']} name="menu" size={18} />
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.btn} onPress={openSetting}>
        <Icon style={{ ...styles.btnText, color: theme['c-font'] }} name="setting" size={styles.btnText.fontSize} />
      </TouchableOpacity> */}
    </View>
  )
}

const Header = () => {
  const drawerLayoutPosition = useSettingValue('common.drawerLayoutPosition')

  return (
    <>
      <StatusBar />
      {drawerLayoutPosition == 'left' ? <LeftHeader /> : <RightHeader />}
    </>
  )
}

const styles = createStyle({
  container: {
    // width: '100%',
    paddingRight: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.1)',
    zIndex: 10,
    borderBottomWidth: BorderWidths.normal,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 12,
    alignItems: 'center',
    height: '100%',
  },
  btn: {
    width: 40,
    height: 40,
    // backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  titleBtn: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.1)',
    height: '100%',
    justifyContent: 'center',
  },
  leftTitle: {
    paddingLeft: 14,
    paddingRight: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  rightTitle: {
    paddingLeft: 2,
    paddingRight: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
})

export default Header
