import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { StatusBar } from 'expo-status-bar';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type VideoItem = { id: string; name: string; uri: string };

const STORAGE_KEY = 'vifoca.videos';
const DEMO_PIN = '2468';

function Player({ item, onBack }: { item: VideoItem; onBack: () => void }) {
  const player = useVideoPlayer(item.uri, (instance) => {
    instance.loop = true;
    instance.play();
  });
  const [locked, setLocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlayback = () => {
    if (isPlaying) player.pause();
    else player.play();
    setIsPlaying((playing) => !playing);
  };

  const lock = () => {
    setLocked(true);
    setUnlocking(false);
    setPinInput('');
  };

  const unlock = () => {
    if (pinInput !== DEMO_PIN) {
      setPinInput('');
      Alert.alert('Not quite', 'Ask the human for the unlock PIN.');
      return;
    }
    setLocked(false);
    setUnlocking(false);
    setPinInput('');
  };

  return (
    <View style={styles.playerScreen}>
      <StatusBar hidden />
      {!locked && (
        <SafeAreaView style={styles.playerTopBar}>
          <Pressable onPress={onBack} hitSlop={12} accessibilityRole="button">
            <Text style={styles.back}>‹ Library</Text>
          </Pressable>
          <Text numberOfLines={1} style={styles.playerName}>{item.name}</Text>
          <Pressable onPress={lock} style={styles.lockButton} accessibilityRole="button">
            <Text style={styles.lockButtonText}>Lock</Text>
          </Pressable>
        </SafeAreaView>
      )}
      <VideoView player={player} style={styles.video} nativeControls={false} contentFit="contain" />
      {!locked && (
        <SafeAreaView style={styles.controls}>
          <Pressable onPress={togglePlayback} style={styles.playButton} accessibilityRole="button">
            <Text style={styles.playButtonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
          </Pressable>
          <Text style={styles.tip}>Lock the screen before handing it to your cat.</Text>
        </SafeAreaView>
      )}
      {locked && (
        <View style={styles.lockedOverlay} pointerEvents="box-none">
          <Pressable
            style={styles.hiddenUnlockZone}
            onLongPress={() => setUnlocking(true)}
            delayLongPress={3500}
            accessibilityLabel="Owner unlock area"
            accessibilityHint="Long press for three and a half seconds to show the owner PIN entry"
          />
          <View style={styles.lockMessage} pointerEvents="none">
            <Text style={styles.lockedTitle}>Playing for your cat</Text>
            <Text style={styles.lockedHint}>Owner unlock is hidden in the top-left corner</Text>
          </View>
          {unlocking && (
            <View style={styles.pinPanel}>
              <Text style={styles.pinTitle}>Owner unlock</Text>
              <TextInput
                autoFocus
                value={pinInput}
                onChangeText={setPinInput}
                onSubmitEditing={unlock}
                placeholder="PIN"
                placeholderTextColor="#89919f"
                keyboardType="number-pad"
                secureTextEntry
                maxLength={8}
                style={styles.pinInput}
              />
              <Pressable style={styles.primaryButton} onPress={unlock} accessibilityRole="button">
                <Text style={styles.primaryButtonText}>Unlock</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export default function App() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [selected, setSelected] = useState<VideoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    const loadLibrary = async () => {
      try {
        const value = await AsyncStorage.getItem(STORAGE_KEY);
        if (value) setVideos(JSON.parse(value) as VideoItem[]);
      } catch {
        Alert.alert('Library unavailable', 'Your saved videos could not be loaded.');
      } finally {
        setLoading(false);
      }
    };
    void loadLibrary();
  }, []);

  const saveLibrary = async (next: VideoItem[]) => {
    setVideos(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      Alert.alert('Could not save library', 'The change is available for now, but may not persist after closing the app.');
    }
  };

  const addVideos = async () => {
    if (importing) return;
    setImporting(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*', multiple: true, copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const stamp = Date.now();
      const added = result.assets.map((asset, index) => ({
        id: `${stamp}-${index}-${Math.random().toString(36).slice(2, 8)}`,
        name: asset.name || 'Untitled video',
        uri: asset.uri,
      }));
      await saveLibrary([...videos, ...added]);
    } catch {
      Alert.alert('Could not import video', 'Please try selecting the video again.');
    } finally {
      setImporting(false);
    }
  };

  const removeVideo = (item: VideoItem) => {
    Alert.alert('Remove video?', item.name, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => void saveLibrary(videos.filter((video) => video.id !== item.id)) },
    ]);
  };

  if (selected) return <Player item={selected} onBack={() => setSelected(null)} />;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.libraryContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View><Text style={styles.eyebrow}>VIFOCA</Text><Text style={styles.title}>Cat TV</Text></View>
          <Text style={styles.paw}>🐾</Text>
        </View>
        <Text style={styles.subtitle}>A calm little cinema for curious cats.</Text>
        <Pressable style={[styles.addButton, importing && styles.buttonDisabled]} onPress={() => void addVideos()} disabled={importing} accessibilityRole="button">
          <Text style={styles.addButtonText}>{importing ? 'Importing…' : '＋ Add videos'}</Text>
        </Pressable>
        <Text style={styles.sectionTitle}>Your library</Text>
        {loading ? <Text style={styles.loadingText}>Loading your videos…</Text> : videos.length === 0 ? (
          <View style={styles.empty}><Text style={styles.emptyPaw}>🐈</Text><Text style={styles.emptyTitle}>No videos yet</Text><Text style={styles.emptyText}>Add birds, fish, or anything your cat loves to watch.</Text></View>
        ) : videos.map((item) => (
          <Pressable key={item.id} style={styles.videoRow} onPress={() => setSelected(item)} onLongPress={() => removeVideo(item)} delayLongPress={500} accessibilityRole="button" accessibilityHint="Tap to play. Long press to remove.">
            <View style={styles.thumbnail}><Text style={styles.thumbnailText}>▶</Text></View>
            <View style={styles.rowText}><Text numberOfLines={1} style={styles.videoTitle}>{item.name}</Text><Text style={styles.videoMeta}>Tap to play · hold to remove</Text></View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
        <View style={styles.footer}><Text style={styles.footerText}>Lock keeps the video playing. Demo PIN: 2468</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101318' }, libraryContent: { paddingHorizontal: 22, paddingBottom: 12, flexGrow: 1 },
  header: { marginTop: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, eyebrow: { color: '#81d4b5', fontWeight: '800', letterSpacing: 2, fontSize: 12 }, title: { color: '#fff', fontSize: 38, fontWeight: '800', marginTop: 4 }, paw: { fontSize: 38 }, subtitle: { color: '#aab1bd', fontSize: 16, marginTop: 8, marginBottom: 22 },
  addButton: { backgroundColor: '#81d4b5', borderRadius: 16, padding: 17, alignItems: 'center' }, buttonDisabled: { opacity: 0.55 }, addButtonText: { color: '#10201c', fontWeight: '800', fontSize: 16 }, sectionTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 30, marginBottom: 12 }, loadingText: { color: '#9ca5b3', textAlign: 'center', padding: 30 },
  empty: { backgroundColor: '#191e27', borderRadius: 20, padding: 30, alignItems: 'center' }, emptyPaw: { fontSize: 38 }, emptyTitle: { color: '#fff', fontWeight: '700', fontSize: 18, marginTop: 10 }, emptyText: { color: '#9ca5b3', textAlign: 'center', lineHeight: 21, marginTop: 7 },
  videoRow: { backgroundColor: '#191e27', borderRadius: 16, padding: 10, flexDirection: 'row', alignItems: 'center', marginBottom: 10 }, thumbnail: { width: 58, height: 58, borderRadius: 12, backgroundColor: '#2b3841', alignItems: 'center', justifyContent: 'center' }, thumbnailText: { color: '#81d4b5', fontSize: 20 }, rowText: { flex: 1, marginLeft: 12 }, videoTitle: { color: '#fff', fontSize: 15, fontWeight: '700' }, videoMeta: { color: '#8f99a8', fontSize: 12, marginTop: 5 }, chevron: { color: '#788393', fontSize: 28, marginHorizontal: 8 }, footer: { marginTop: 'auto', paddingVertical: 20, alignItems: 'center' }, footerText: { color: '#687281', fontSize: 12 },
  playerScreen: { flex: 1, backgroundColor: '#000' }, playerTopBar: { backgroundColor: '#101318', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, gap: 12 }, back: { color: '#81d4b5', fontSize: 16 }, playerName: { color: '#fff', flex: 1, fontWeight: '700' }, lockButton: { borderColor: '#81d4b5', borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }, lockButtonText: { color: '#81d4b5', fontWeight: '800' }, video: { flex: 1 }, controls: { backgroundColor: '#101318', minHeight: 84, paddingHorizontal: 16, paddingTop: 12, flexDirection: 'row', alignItems: 'center', gap: 16 }, playButton: { backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 18, paddingVertical: 10 }, playButtonText: { color: '#101318', fontWeight: '800' }, tip: { color: '#89919f', flex: 1, fontSize: 12 },
  lockedOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.08)', alignItems: 'center', justifyContent: 'center' }, hiddenUnlockZone: { position: 'absolute', top: 0, left: 0, width: 110, height: 110 }, lockMessage: { alignItems: 'center', opacity: 0.35 }, lockedTitle: { color: '#d1d6dd', fontSize: 15 }, lockedHint: { color: '#c2c8d0', fontSize: 11, marginTop: 8 }, pinPanel: { position: 'absolute', bottom: 50, backgroundColor: '#191e27', borderRadius: 18, padding: 20, width: 260 }, pinTitle: { color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 12 }, pinInput: { backgroundColor: '#101318', color: '#fff', borderRadius: 10, padding: 12, marginBottom: 10 }, primaryButton: { backgroundColor: '#81d4b5', borderRadius: 10, padding: 12, alignItems: 'center' }, primaryButtonText: { color: '#10201c', fontWeight: '800' },
});
