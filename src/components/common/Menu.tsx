import { useImperativeHandle, forwardRef, useMemo, useRef, useState, type Ref } from 'react'
import { View, Animated, TouchableOpacity } from 'react-native'
import { useWindowSize } from '@/utils/hooks'

import Modal, { type ModalType } from './Modal'

import { createStyle } from '@/utils/tools'
import { useTheme } from '@/store/theme/hook'
import Text from './Text'
import { scaleSizeH, scaleSizeW } from '@/utils/pixelRatio'
import { Icon } from './Icon'

const menuItemHeight = scaleSizeH(52)
const menuItemWidth = scaleSizeW(140)

export interface Position {
  w: number
  h: number
  x: number
  y: number
  menuWidth?: number
  menuHeight?: number
}
export interface MenuSize {
  width?: number
  height?: number
}
export type Menus = Readonly<Array<{ action: string; label?: string; disabled?: boolean; icon?: string }>>

const styles = createStyle({
  mask: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0,
    backgroundColor: 'black',
  },
  menu: {
    position: 'absolute',
    borderRadius: 16,
    backgroundColor: 'white',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    flex: 1,
  },
  separator: {
    height: 0.5,
    marginHorizontal: 12,
    opacity: 0.15,
  },
  divider: {
    height: 8,
  },
})

interface Props<M extends Menus = Menus> {
  menus: Readonly<M>
  onPress?: (menu: M[number]) => void
  buttonPosition: Position
  menuSize: MenuSize
  onHide: () => void
  width?: number
  height?: number
  fontSize?: number
  center?: boolean
  activeId?: M[number]['action'] | null
}

const Menu = ({
  buttonPosition,
  menuSize,
  menus,
  width,
  height,
  onPress = () => {},
  onHide,
  activeId,
  fontSize = 15,
  center = false,
}: Props) => {
  const theme = useTheme()
  const windowSize = useWindowSize()

  const menuItemStyle = useMemo(() => {
    return {
      width: width ?? menuSize.width ?? menuItemWidth,
      height: height ?? menuSize.height ?? menuItemHeight,
    }
  }, [menuSize, width, height])

  const menuStyle = useMemo(() => {
    const validMenus = menus.filter(m => m.action !== 'divider')
    let menuHeight = validMenus.length * menuItemStyle.height + menus.filter(m => m.action === 'divider').length * 8
    const topHeight = buttonPosition.y - 20
    const bottomHeight = windowSize.height - buttonPosition.y - buttonPosition.h - 20
    if (menuHeight > topHeight && menuHeight > bottomHeight)
      menuHeight = Math.max(topHeight, bottomHeight)

    const menuWidth = menuItemStyle.width
    const bottomSpace = windowSize.height - buttonPosition.y - buttonPosition.h - 20
    const rightSpace = windowSize.width - buttonPosition.x - menuWidth
    const showInBottom = bottomSpace >= menuHeight
    const showInRight = rightSpace >= 0
    const frameStyle: {
      height: number
      width: number
      top: number
      left?: number
      right?: number
    } = {
      height: menuHeight,
      top: showInBottom ? buttonPosition.y + buttonPosition.h + 8 : buttonPosition.y - menuHeight - 8,
      width: menuWidth,
    }
    if (showInRight) {
      frameStyle.left = buttonPosition.x
    } else {
      frameStyle.right = windowSize.width - buttonPosition.x - buttonPosition.w
    }
    return frameStyle
  }, [menus, menuItemStyle, buttonPosition, windowSize])

  const menuPress = (menu: Menus[number]) => {
    onPress(menu)
    onHide()
  }

  return (
    <View
      style={{
        ...styles.menu,
        ...menuStyle,
        backgroundColor: theme['c-content-background'],
      }}
      onStartShouldSetResponder={() => true}
    >
      <Animated.ScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false}>
        {menus.map((menu, index) => {
          if (menu.action === 'divider') {
            return <View key={`divider-${index}`} style={styles.divider} />
          }

          return (
            <View key={menu.action}>
              {menu.disabled ? (
                <View
                  style={{
                    ...styles.menuItem,
                    width: menuItemStyle.width,
                    height: menuItemStyle.height,
                    opacity: 0.4,
                  }}
                >
                  {menu.icon && <Icon name={menu.icon} size={20} color={theme['c-font']} />}
                  <Text
                    style={{ ...styles.menuItemText, textAlign: center ? 'center' : 'left' }}
                    size={fontSize}
                    numberOfLines={1}
                  >
                    {menu.label}
                  </Text>
                </View>
              ) : menu.action == activeId ? (
                <TouchableOpacity
                  style={{
                    ...styles.menuItem,
                    width: menuItemStyle.width,
                    height: menuItemStyle.height,
                  }}
                  activeOpacity={0.6}
                  onPress={() => menuPress(menu)}
                >
                  {menu.icon && <Icon name={menu.icon} size={20} color={theme['c-primary-font-active']} />}
                  <Text
                    style={{ ...styles.menuItemText, textAlign: center ? 'center' : 'left', fontWeight: '600' }}
                    color={theme['c-primary-font-active']}
                    size={fontSize}
                    numberOfLines={1}
                  >
                    {menu.label}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    ...styles.menuItem,
                    width: menuItemStyle.width,
                    height: menuItemStyle.height,
                  }}
                  activeOpacity={0.6}
                  onPress={() => {
                    menuPress(menu)
                  }}
                >
                  {menu.icon && <Icon name={menu.icon} size={20} color={theme['c-font']} />}
                  <Text
                    style={{ ...styles.menuItemText, textAlign: center ? 'center' : 'left' }}
                    size={fontSize}
                    numberOfLines={1}
                  >
                    {menu.label}
                  </Text>
                </TouchableOpacity>
              )}
              {index < menus.length - 1 && menus[index + 1]?.action !== 'divider' && (
                <View style={{ ...styles.separator, backgroundColor: theme['c-font'] }} />
              )}
            </View>
          )
        })}
      </Animated.ScrollView>
    </View>
  )
}

export interface MenuProps<M extends Menus = Menus> {
  menus: M
  onPress: (menu: M[number]) => void
  onHide?: () => void
  width?: number
  height?: number
  fontSize?: number
  center?: boolean
  activeId?: M[number]['action'] | null
}

export interface MenuType {
  show: (position: Position, menuSize?: MenuSize) => void
  hide: () => void
}

const Component = <M extends Menus>(
  { menus, width, height, activeId, onHide, onPress, fontSize, center }: MenuProps<M>,
  ref: Ref<MenuType>
) => {
  const modalRef = useRef<ModalType>(null)
  const [position, setPosition] = useState<Position>({ w: 0, h: 0, x: 0, y: 0 })
  const [menuSize, setMenuSize] = useState<MenuSize>({})
  const hide = () => {
    modalRef.current?.setVisible(false)
  }
  useImperativeHandle(ref, () => ({
    show(newPosition, menuSize) {
      setPosition(newPosition)
      if (menuSize) setMenuSize(menuSize)
      modalRef.current?.setVisible(true)
    },
    hide() {
      hide()
    },
  }))

  return (
    <Modal onHide={onHide} ref={modalRef}>
      <Menu
        menus={menus}
        width={width}
        height={height}
        activeId={activeId}
        buttonPosition={position}
        menuSize={menuSize}
        onPress={onPress}
        onHide={hide}
        fontSize={fontSize}
        center={center}
      />
    </Modal>
  )
}

export default forwardRef(Component) as <M extends Menus>(
  p: MenuProps<M> & { ref?: Ref<MenuType> }
) => JSX.Element | null
