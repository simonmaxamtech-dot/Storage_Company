'use client'

import dynamic from 'next/dynamic'

// The 3D engine is the heaviest part of the page. Loading it as its own chunk lets the text and menu
// appear and respond first; the scene joins in a moment later.
const Scene = dynamic(() => import('./Scene'), { ssr: false })

export default function SceneLazy() {
  return <Scene />
}
