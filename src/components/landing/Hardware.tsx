import type { ReactNode, Ref } from 'react'
import { motion, type HTMLMotionProps } from 'motion/react'

interface HardwareProps {
  children: ReactNode
  screenRef?: Ref<HTMLDivElement>
  // Always passed (even when not animating) so Motion attaches the ref at
  // initial mount — it does not wire up a ref added on a later render to an
  // already-mounted motion component (section 7.3).
  assemblyRef?: Ref<HTMLDivElement>
  // Passed through to the assembly wrapper so callers can drive the zoom
  // transition (animate, transition, onAnimationComplete — section 7.3).
  assemblyProps?: HTMLMotionProps<'div'>
}

// Decorative space-gray computer illustration (section 7.1). Every part except
// the screen itself is presentational, so it is hidden from assistive tech.
// All dimensions are relative (%, aspect-ratio) so the whole assembly scales
// together as the viewport shrinks on tablets (section 3, gap #13).
export function Hardware({ children, screenRef, assemblyRef, assemblyProps }: HardwareProps) {
  const { style: assemblyStyle, ...restAssemblyProps } = assemblyProps ?? {}

  return (
    <div className="flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_#2a2d34_0%,_#0b0c10_70%)] p-6">
      <motion.div
        {...restAssemblyProps}
        ref={assemblyRef}
        className="flex flex-col items-center"
        style={{ width: 'min(1100px, 92vw)', ...assemblyStyle }}
      >
        <div className="w-full rounded-[3%] border border-white/10 bg-gradient-to-b from-[#3c3f46] to-[#1c1d21] p-[1.4%] shadow-[0_40px_90px_rgb(0_0_0_/_55%)]">
          <div
            ref={screenRef}
            className="relative aspect-[16/10] w-full min-h-[400px] overflow-hidden rounded-[2%] bg-black"
          >
            {children}
          </div>
        </div>

        <div aria-hidden="true" className="flex w-full flex-col items-center">
          <div className="aspect-[16/1] w-[62%] rounded-b-[10%] bg-gradient-to-b from-[#2c2e33] to-[#18191c] shadow-inner" />
          <div
            className="mt-[1%] aspect-square w-[10%] bg-gradient-to-b from-[#26282c] to-[#18191c]"
            style={{ clipPath: 'polygon(28% 0, 72% 0, 100% 100%, 0 100%)' }}
          />
          <div className="aspect-[24/1] w-[26%] rounded-full bg-gradient-to-b from-[#2c2e33] to-[#141518] shadow-[0_10px_24px_rgb(0_0_0_/_45%)]" />
        </div>

        <div aria-hidden="true" className="relative mt-[6%] flex w-full items-end justify-center gap-[3%]">
          <div className="absolute -bottom-2 h-[30%] w-[70%] rounded-[50%] bg-black/40 blur-xl" />
          <div className="relative aspect-[20/1] w-[52%] rounded-xl bg-gradient-to-b from-[#3c3f46] to-[#232428] shadow-lg" />
          <div className="relative aspect-[8/5] w-[9%] rounded-full bg-gradient-to-b from-[#3c3f46] to-[#232428] shadow-lg" />
        </div>
      </motion.div>
    </div>
  )
}
