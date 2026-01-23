'use client'

import ZoomCredits from '@/components/ui/ZoomCredits'

export default function HeroCredits() {
  return (
    <ZoomCredits blockDuration={7.5}>
      {/* 1 */}
      <p className="font-medium leading-[1.4] text-black" style={{ fontSize: '8vw' }}>
        AI answers drift over time.<br />
        We keep reasoning aligned.
      </p>

      {/* 2 */}
      <p className="font-medium leading-[1.4] text-black" style={{ fontSize: '8vw' }}>
        Same input produces different outputs.<br />
        We enforce a stable logic path.
      </p>

      {/* 3 */}
      <p className="font-medium leading-[1.4] text-black" style={{ fontSize: '8vw' }}>
        Prompting turns work into trial and error.<br />
        We remove prompts from the interaction.
      </p>

      {/* 4 */}
      <p className="font-medium leading-[1.4] text-black" style={{ fontSize: '8vw' }}>
        Context resets at every step.<br />
        We build and preserve it.
      </p>

      {/* 5 */}
      <p className="font-medium leading-[1.4] text-black" style={{ fontSize: '8vw' }}>
        AI reacts instead of reasoning.<br />
        We guide the interaction.
      </p>

      {/* 6 */}
      <p className="font-medium leading-[1.4] text-black" style={{ fontSize: '8vw' }}>
        Logic shifts as complexity increases.<br />
        We constrain the reasoning.
      </p>

      {/* 7 */}
      <p className="font-medium leading-[1.4] text-black" style={{ fontSize: '8vw' }}>
        Results feel unpredictable.<br />
        We make behavior deterministic.
      </p>

      {/* 8 */}
      <p className="font-medium leading-[1.4] text-black" style={{ fontSize: '8vw' }}>
        Users guess what to ask next.<br />
        We control the questions.
      </p>

      {/* 9 */}
      <p className="font-medium leading-[1.4] text-black" style={{ fontSize: '8vw' }}>
        Platforms change and workflows break.<br />
        Our method stays the same.
      </p>

      {/* 10 */}
      <p className="font-medium leading-[1.4] text-black" style={{ fontSize: '8vw' }}>
        Power without control isn't usable.<br />
        We make results repeatable.
      </p>

    </ZoomCredits>
  )
}
