import { View } from 'react-native'
import PlayerBar from '@/components/player/PlayerBar'
import StatusBar from '@/components/common/StatusBar'
import Header from './Header'
import Main from './Main'
import BottomTabBar from '../BottomTabBar'
import { createStyle } from '@/utils/tools'

const styles = createStyle({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
  },
})

export default () => {
  return (
    <>
      <StatusBar />
      <View style={styles.container}>
        <View style={styles.content}>
          <Header />
          <Main />
          <BottomTabBar />
          <PlayerBar isHome />
        </View>
      </View>
    </>
  )
}
