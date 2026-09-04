import { View, TouchableOpacity } from 'react-native'
import { navigations } from '@/navigation'
import { usePlayerMusicInfo } from '@/store/player/hook'
import { useSettingValue } from '@/store/setting/hook'
import { useTheme } from '@/store/theme/hook'
import commonState from '@/store/common/state'
import playerState from '@/store/player/state'
import Text from '@/components/common/Text'
import { LIST_IDS } from '@/config/constant'
import { createStyle } from '@/utils/tools'

export default ({ isHome }: { isHome: boolean }) => {
  const musicInfo = usePlayerMusicInfo()
  const downloadFileName = useSettingValue('download.fileName')
  const theme = useTheme()

  const handlePress = () => {
    if (!musicInfo.id) return
    navigations.pushPlayDetailScreen(commonState.componentIds.home!)
  }

  const handleLongPress = () => {
    const listId = playerState.playMusicInfo.listId
    if (!listId || listId == LIST_IDS.DOWNLOAD) return
    global.app_event.jumpListPosition()
  }

  const title = musicInfo.id
    ? musicInfo.singer
      ? downloadFileName.replace('歌手', musicInfo.singer).replace('歌名', musicInfo.name)
      : musicInfo.name
    : ''

  const singer = musicInfo.id ? musicInfo.singer : ''

  return (
    <TouchableOpacity
      style={styles.container}
      onLongPress={handleLongPress}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title} color={theme['c-font']} numberOfLines={1} size={15}>
          {musicInfo.name || ''}
        </Text>
        {singer ? (
          <Text style={styles.artist} color={theme['c-font-label']} numberOfLines={1} size={13}>
            {singer}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  )
}

const styles = createStyle({
  container: {
    width: '100%',
    paddingHorizontal: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    fontWeight: '500',
    marginBottom: 2,
  },
  artist: {
    opacity: 0.7,
  },
})
