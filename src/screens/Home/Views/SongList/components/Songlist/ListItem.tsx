import { memo } from 'react'
import { View, Platform, TouchableOpacity } from 'react-native'
import { createStyle } from '@/utils/tools'
import { type ListInfoItem } from '@/store/songlist/state'
import Text from '@/components/common/Text'
import { scaleSizeW } from '@/utils/pixelRatio'
import { NAV_SHEAR_NATIVE_IDS } from '@/config/constant'
import { useTheme } from '@/store/theme/hook'
import Image from '@/components/common/Image'

const gap = scaleSizeW(15)
export default memo(
  ({
    item,
    index,
    width,
    showSource,
    onPress,
  }: {
    item: ListInfoItem
    index: number
    showSource: boolean
    width: number
    onPress: (item: ListInfoItem, index: number) => void
  }) => {
    const theme = useTheme()
    const itemWidth = width
    const handlePress = () => {
      onPress(item, index)
    }
    return item.source ? (
      <View style={{ ...styles.listItem, width: itemWidth }}>
        <View style={{ ...styles.listItemImg, backgroundColor: theme['c-content-background'] }}>
          <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
            <Image
              url={item.img}
              nativeID={`${NAV_SHEAR_NATIVE_IDS.songlistDetail_pic}_from_${item.id}`}
              style={{ width: itemWidth, height: itemWidth, borderRadius: 12 }}
            />
            {showSource ? (
              <View style={styles.sourceLabelContainer}>
                <Text style={styles.sourceLabel} size={10} color="#fff">
                  {item.source}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
          <Text style={styles.listItemTitle} numberOfLines={2} size={14}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    ) : (
      <View style={{ ...styles.listItem, width: itemWidth }} />
    )
  }
)

const styles = createStyle({
  listItem: {
    marginVertical: 10,
  },
  listItemImg: {
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sourceLabelContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  sourceLabel: {
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  listItemTitle: {
    lineHeight: 20,
    fontWeight: '500',
  },
})
