"use client"
import FeatureGate from './FeatureGate'
import ArtistMusicPlayer from './ArtistMusicPlayer'

export default function SleepSounds() {
  return (
    <FeatureGate feature="sleep_sounds">
      <ArtistMusicPlayer title="Sacred Sleep Music" />
    </FeatureGate>
  )
}
