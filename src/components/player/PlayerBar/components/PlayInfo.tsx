import { View, Animated, StyleSheet } from 'react-native'
import { useEffect, useRef } from 'react'
import { useTheme } from '@/store/theme/hook'
import { useProgress } from '@/store/player/hook'

export default ({ isHome }: { isHome: boolean }) => {
  const theme = useTheme()
  const { progress } = useProgress()
  const animatedWidth = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [progress, animatedWidth])

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  })

  return (
    <View style={styles.container}>
      <View style={[styles.track, { backgroundColor: theme['c-primary-alpha-800'] }]}>
        <Animated.View
          style={[
            styles.progress,
            {
              backgroundColor: theme['c-primary'],
              width: widthInterpolated,
            },
          ]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 2,
    marginTop: 10,
    justifyContent: 'center',
  },
  track: {
    width: '100%',
    height: 2,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 999,
  },
})
