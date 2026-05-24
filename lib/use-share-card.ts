import { useCallback, RefObject } from 'react'

export interface ShareOptions {
  fileName?: string
  shareTitle?: string
  shareText?: string
}

export function useShareCard(cardRef: RefObject<HTMLDivElement | null>, options: ShareOptions = {}) {
  const { fileName = 'synchrosoul-share', shareTitle = 'SynchroSoul', shareText = '' } = options

  const captureAndShare = useCallback(async () => {
    if (!cardRef.current) return

    try {
      // Dynamically import html2canvas to keep bundle lean
      const html2canvas = (await import('html2canvas')).default

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#08061c',
        scale: 2,
        useCORS: true,
        logging: false,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
      })

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png', 1.0)
      })

      if (!blob) return

      const file = new File([blob], `${fileName}.png`, { type: 'image/png' })

      // Try Web Share API first
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          files: [file],
        })
        return
      }

      // Fallback: download the image
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${fileName}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      // User cancelled share or error occurred
      console.warn('Share failed:', err)
    }
  }, [cardRef, fileName, shareTitle, shareText])

  return { captureAndShare }
}
