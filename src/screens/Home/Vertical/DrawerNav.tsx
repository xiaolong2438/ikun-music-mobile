import { memo } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { useI18n } from '@/lang'
import { useNavActiveId, useStatusbarHeight } from '@/store/common/hook'
import { useTheme } from '@/store/theme/hook'
import { Icon } from '@/components/common/Icon'
import { confirmDialog, createStyle, exitApp as backHome } from '@/utils/tools'
import { NAV_MENUS } from '@/config/constant'
import type { InitState } from '@/store/common/state'
// import { navigations } from '@/navigation'
// import commonState from '@/store/common/state'
import { exitApp, setNavActiveId } from '@/core/common'
import Text from '@/components/common/Text'
import { useSettingValue } from '@/store/setting/hook'
import { BorderWidths } from '@/theme'

const styles = createStyle({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // padding: 10,
  },
  header: {
    paddingTop: 36,
    paddingBottom: 32,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  menus: {
    flex: 1,
  },
  list: {
    paddingTop: 4,
    paddingBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginVertical: 2,
    paddingVertical: 14,
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  iconContent: {
    width: 24,
    alignItems: 'center',
  },
  text: {
    flex: 1,
    paddingLeft: 16,
    letterSpacing: 0.2,
  },
  activeText: {
    flex: 1,
    paddingLeft: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },
  footer: {
    paddingTop: 8,
    paddingBottom: 12,
    borderTopWidth: BorderWidths.normal,
  },
})

const Header = () => {
  const theme = useTheme()
  const statusBarHeight = useStatusbarHeight()
  return (
    <View style={{ paddingTop: statusBarHeight }}>
      <View style={styles.header}>
        <Icon name="logo" color={theme['c-primary']} size={26} />
        <Text style={styles.headerText} size={20} color={theme['c-font']}>
          IKUN Music
        </Text>
      </View>
    </View>
  )
}

type IdType = InitState['navActiveId'] | 'nav_exit' | 'back_home'

const MenuItem = ({
  id,
  icon,
  onPress,
}: {
  id: IdType
  icon: string
  onPress: (id: IdType) => void
}) => {
  const t = useI18n()
  const activeId = useNavActiveId()
  const theme = useTheme()

  return activeId == id ? (
    <View style={{ ...styles.menuItem, backgroundColor: theme['c-primary-alpha-900'] }}>
      <View style={styles.iconContent}>
        <Icon name={icon} size={20} color={theme['c-primary']} />
      </View>
      <Text style={styles.activeText} color={theme['c-primary-font-active']}>
        {t(id)}
      </Text>
      <View style={{ ...styles.activeDot, backgroundColor: theme['c-primary'] }} />
    </View>
  ) : (
    <TouchableOpacity
      style={styles.menuItem}
      activeOpacity={0.7}
      onPress={() => {
        onPress(id)
      }}
    >
      <View style={styles.iconContent}>
        <Icon name={icon} size={20} color={theme['c-font-label']} />
      </View>
      <Text style={styles.text} color={theme['c-font']}>
        {t(id)}
      </Text>
    </TouchableOpacity>
  )
}

export default memo(() => {
  const theme = useTheme()
  // console.log('render drawer nav')
  const showBackBtn = useSettingValue('common.showBackBtn')
  const showExitBtn = useSettingValue('common.showExitBtn')

  const handlePress = (id: IdType) => {
    switch (id) {
      case 'nav_exit':
        void confirmDialog({
          message: global.i18n.t('exit_app_tip'),
          confirmButtonText: global.i18n.t('list_remove_tip_button'),
        }).then((isExit) => {
          if (!isExit) return
          exitApp('Exit Btn')
        })
        return
      case 'back_home':
        backHome()
        return
    }

    global.app_event.changeMenuVisible(false)
    setNavActiveId(id)
  }

  return (
    <View style={{ ...styles.container, backgroundColor: theme['c-content-background'] }}>
      <Header />
      <ScrollView style={styles.menus}>
        <View style={styles.list}>
          {NAV_MENUS.map((menu) => (
            <MenuItem key={menu.id} id={menu.id} icon={menu.icon} onPress={handlePress} />
          ))}
        </View>
      </ScrollView>

      {showBackBtn || showExitBtn ? (
        <View style={{ ...styles.footer, borderTopColor: theme['c-border-background'] }}>
          {showBackBtn ? <MenuItem id="back_home" icon="home" onPress={handlePress} /> : null}
          {showExitBtn ? <MenuItem id="nav_exit" icon="exit2" onPress={handlePress} /> : null}
        </View>
      ) : null}
    </View>
  )
})
