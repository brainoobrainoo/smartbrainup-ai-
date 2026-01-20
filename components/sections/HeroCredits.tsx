'use client'

import ScrollingCredits from '@/components/ui/ScrollingCredits'

export default function HeroCredits() {
  return (
    <ScrollingCredits 
      duration={54}
      className="h-[155px] md:h-[245px] p-8 md:p-12"
    >
      <div className="text-center">
        
        {/* Initial spacer to center title on start */}
        <div className="h-[40px] md:h-[80px]" />

        {/* Title - same size, heavier weight */}
        <h3 className="text-[18px] md:text-[22px] font-semibold leading-[1.4] tracking-[-0.01em] mb-12">
          Generative AI is powerful<br />
          until it isn't.
        </h3>

        {/* Chapter 1 */}
        <div className="space-y-1 text-[18px] md:text-[22px] font-light leading-[1.4] opacity-70">
          <p>You use AI every day</p>
          <p className="pt-4">Sometimes it feels brilliant</p>
          <p>sometimes it doesn't</p>
          <p className="pt-4">You try again</p>
          <p>you change the prompt</p>
          <p>you explain more</p>
          <p className="pt-4">And the answer still shifts</p>
          <p className="pt-4">You're told:</p>
          <p>"you just need better prompts"</p>
          <p className="pt-4">That's not the real problem.</p>
        </div>

        {/* Separator */}
        <div className="my-8 flex justify-center">
          <div className="w-12 h-[1px] bg-[#1a1a1a] opacity-20" />
        </div>

        {/* Chapter 2 */}
        <div className="space-y-1 text-[18px] md:text-[22px] font-light leading-[1.4] opacity-70">
          <p>The AI you're using is statistical</p>
          <p>it reacts to what you type</p>
          <p>it predicts the next answer</p>
          <p className="pt-4">So every time you change something</p>
          <p>it changes too</p>
          <p className="pt-4">No one tells you this</p>
          <p>you're left guessing what to ask</p>
        </div>

        {/* Separator */}
        <div className="my-8 flex justify-center">
          <div className="w-12 h-[1px] bg-[#1a1a1a] opacity-20" />
        </div>

        {/* Chapter 3 */}
        <div className="space-y-1 text-[18px] md:text-[22px] font-light leading-[1.4] opacity-70">
          <p>We built a different way to work with AI</p>
          <p className="pt-4">A promptless method</p>
          <p className="pt-4">You don't need to know what to ask</p>
          <p>you don't need to craft prompts</p>
          <p>you don't need to adapt to the AI</p>
          <p className="pt-4 opacity-100 font-medium">The AI adapts to you</p>
        </div>

      </div>
    </ScrollingCredits>
  )
}
