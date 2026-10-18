"use client"
import ArtistMusicPlayer from './ArtistMusicPlayer'

interface MusicPlayerProps {
  // Kept for existing call sites; artist songs aren't grouped by category yet
  defaultCategory?: string
  compact?: boolean
  title?: string
}

export default function MusicPlayer({ compact = false, title = 'Sacred Sounds' }: MusicPlayerProps) {
  return <ArtistMusicPlayer title={title} compact={compact} showHeader={!compact} />
}
