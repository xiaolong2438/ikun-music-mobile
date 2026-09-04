import { existsFile } from '@/utils/fs'
import { getListMusics, userLists } from '@/utils/listManage'
import { LIST_IDS } from '@/config/constant'
import { scanAudioFiles, readMetadata } from '@/utils/localMediaMetadata'
import RNFetchBlob from 'rn-fetch-blob'

const intervalTolerance = 5
const normalizeText = (value: string) =>
  value
    .normalize('NFKC')
    .toLocaleLowerCase()
    .replace(/[\s\-_.·・'"`~!@#$%^&*()\[\]{}<>/\\|，,。！？!?：:;；]/g, '')

const getIntervalSeconds = (interval: string | null) => {
  if (!interval) return null
  const values = interval.split(':').map(Number)
  if (values.some((value) => !Number.isFinite(value))) return null
  return values.reduce((total, value) => total * 60 + value, 0)
}

const formatInterval = (seconds: number | null) => {
  if (seconds == null || !Number.isFinite(seconds)) return null
  const minutes = Math.trunc(seconds / 60)
  const remainder = Math.trunc(seconds % 60)
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
}

const isSameMusic = (onlineMusic: LX.Music.MusicInfoOnline, localMusic: LX.Music.MusicInfoLocal) => {
  if (!onlineMusic.name || !localMusic.name) return false
  if (normalizeText(onlineMusic.name) != normalizeText(localMusic.name)) return false

  const onlineSinger = normalizeText(onlineMusic.singer)
  const localSinger = normalizeText(localMusic.singer)
  if (onlineSinger && localSinger && onlineSinger != localSinger) return false
  if (onlineSinger && !localSinger) return false

  const onlineInterval = getIntervalSeconds(onlineMusic.interval)
  const localInterval = getIntervalSeconds(localMusic.interval)
  return (
    onlineInterval == null ||
    localInterval == null ||
    Math.abs(onlineInterval - localInterval) <= intervalTolerance
  )
}

const findAvailableLocalPath = async (
  onlineMusic: LX.Music.MusicInfoOnline,
  localMusics: LX.Music.MusicInfoLocal[]
) => {
  for (const localMusic of localMusics) {
    if (!isSameMusic(onlineMusic, localMusic)) continue
    const path = localMusic.meta.filePath
    if (await existsFile(path).catch(() => false)) return path
  }
  return null
}

const getImportedLocalMusics = async (): Promise<LX.Music.MusicInfoLocal[]> => {
  const listIds = new Set<string>([
    LIST_IDS.DEFAULT,
    LIST_IDS.LOVE,
    ...userLists.map((list) => list.id),
  ])
  const lists = await Promise.all(Array.from(listIds, (id) => getListMusics(id)))
  const paths = new Set<string>()
  const result: LX.Music.MusicInfoLocal[] = []
  for (const list of lists) {
    for (const music of list) {
      if (music.source != 'local' || paths.has(music.meta.filePath)) continue
      paths.add(music.meta.filePath)
      result.push(music)
    }
  }
  return result
}

const getDownloadedLocalMusics = async (): Promise<LX.Music.MusicInfoLocal[]> => {
  const dir = `${RNFetchBlob.fs.dirs.MusicDir}/IKUN Music`
  const files = await scanAudioFiles(dir).catch(() => [])
  return Promise.all(
    files.map(async (file) => {
      const metadata = await readMetadata(file.path).catch(() => null)
      if (metadata) {
        return {
          id: file.path,
          name: metadata.name,
          singer: metadata.singer,
          source: 'local' as const,
          interval: formatInterval(Number(metadata.interval)),
          meta: {
            albumName: metadata.albumName,
            filePath: file.path,
            songId: file.path,
            picUrl: '',
            ext: metadata.ext,
          },
        } satisfies LX.Music.MusicInfoLocal
      }

      const name = file.name
        .replace(/\.[^.]+$/, '')
        .replace(/\s+-\s+(?:128k|192k|320k|flac|wav|ape|hires|atmos|atmos_plus|master)$/i, '')
      const [title, ...singerParts] = name.split(/\s+-\s+/)
      return {
        id: file.path,
        name: title,
        singer: singerParts.join(' - '),
        source: 'local' as const,
        interval: null,
        meta: {
          albumName: '',
          filePath: file.path,
          songId: file.path,
          picUrl: '',
          ext: file.name.split('.').pop() ?? '',
        },
      } satisfies LX.Music.MusicInfoLocal
    })
  )
}

/** Finds an imported or app-downloaded local file for an online song. */
export const getPreferredLocalMusicPath = async (musicInfo: LX.Music.MusicInfoOnline) => {
  const importedPath = await findAvailableLocalPath(musicInfo, await getImportedLocalMusics())
  if (importedPath) return importedPath
  return findAvailableLocalPath(musicInfo, await getDownloadedLocalMusics())
}
