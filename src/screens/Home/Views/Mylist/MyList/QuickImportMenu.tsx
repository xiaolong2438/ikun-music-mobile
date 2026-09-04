import { useRef, useImperativeHandle, forwardRef, useState } from 'react'
import { useI18n } from '@/lang'
import Menu, { type Menus, type MenuType, type Position } from '@/components/common/Menu'
import { scaleSizeW } from '@/utils/pixelRatio'
import listState from '@/store/list/state'

export interface SelectInfo {
  listInfo: LX.List.MyListInfo
  index: number
}
const initSelectInfo = {}

const menuItemWidth = scaleSizeW(130)

export interface QuickImportMenuProps {
  onImportFile: (listInfo: LX.List.MyListInfo, index: number) => void
  onSelectLocalFile: (listInfo: LX.List.MyListInfo, index: number) => void
}
export interface QuickImportMenuType {
  show: (selectInfo: SelectInfo, position: Position) => void
}

export type { Position }

export default forwardRef<QuickImportMenuType, QuickImportMenuProps>(
  ({ onImportFile, onSelectLocalFile }, ref) => {
    const t = useI18n()
    const menuRef = useRef<MenuType>(null)
    const selectInfoRef = useRef<SelectInfo>(initSelectInfo as SelectInfo)
    const [menus, setMenus] = useState<Menus>([])
    const [visible, setVisible] = useState(false)

    useImperativeHandle(ref, () => ({
      show(selectInfo, position) {
        selectInfoRef.current = selectInfo
        handleSetMenu(selectInfo.listInfo)
        if (visible) menuRef.current?.show(position)
        else {
          setVisible(true)
          requestAnimationFrame(() => {
            menuRef.current?.show(position)
          })
        }
      },
    }))

    const handleSetMenu = (listInfo: LX.List.MyListInfo) => {
      const local_file = !listState.fetchingListStatus[listInfo.id]

      setMenus([
        {
          action: 'local_file',
          disabled: !local_file,
          label: t('list_select_local_file'),
          icon: 'add_folder',
        },
        {
          action: 'import',
          label: t('list_import'),
          icon: 'add-music',
        },
      ])
    }

    const handleMenuPress = ({ action }: (typeof menus)[number]) => {
      const selectInfo = selectInfoRef.current
      switch (action) {
        case 'import':
          onImportFile(selectInfo.listInfo, selectInfo.index)
          break
        case 'local_file':
          onSelectLocalFile(selectInfo.listInfo, selectInfo.index)
          break
        default:
          break
      }
    }

    return visible ? (
      <Menu ref={menuRef} menus={menus} onPress={handleMenuPress} width={menuItemWidth} />
    ) : null
  }
)
