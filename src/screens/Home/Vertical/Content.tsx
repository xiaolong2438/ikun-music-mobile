import { View } from 'react-native'
import Header from './Header'
import Main from './Main'
import BottomTabBar from '../BottomTabBar'
import { createStyle } from '@/utils/tools'

const Content = () => {
  return (
    <View style={styles.container}>
      <Header />
      <Main />
      <BottomTabBar />
    </View>
  )
}

const styles = createStyle({
  container: {
    flex: 1,
  },
})

export default Content
