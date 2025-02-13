import gsap from 'gsap'

import { useGSAP } from '@gsap/react'
import { isClient } from '@/utils/constants'

if (isClient) {
  gsap.registerPlugin(useGSAP)
}

export { gsap }

export const promisifyGsap = (tl: GSAPTimeline) => {
  return new Promise<void>((resolve) => {
    tl.then(() => resolve())
  })
}
