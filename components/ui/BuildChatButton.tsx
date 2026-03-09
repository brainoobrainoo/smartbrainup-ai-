'use client'

// components/ui/BuildChatButton.tsx

interface BuildChatButtonProps {
  isBuildMode: boolean
  isDayMode: boolean
  onClick: () => void
}

export default function BuildChatButton({ isBuildMode, isDayMode, onClick }: BuildChatButtonProps) {
  const strokeColor = isDayMode ? '#1a1a1a' : '#ffffff'
  const rgbaBase = isDayMode ? '0,0,0' : '255,255,255'

  // BUILD SVG paths — same hand-drawn line style as START
  const BuildSVG = () => (
    <svg
      width="44"
      height="11"
      viewBox="0 0 44 11"
      fill="none"
      stroke={strokeColor}
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block' }}
    >
      {/* B */}
      <line x1="1" y1="1" x2="1" y2="10" />
      <path d="M 1,1 L 3.5,1 C 5.5,1 6,2 6,3 C 6,4 5.5,5 3.5,5 L 1,5" />
      <path d="M 1,5 L 4,5 C 6,5 6.5,6 6.5,7.5 C 6.5,9 6,10 4,10 L 1,10" />
      {/* U */}
      <path d="M 10,1 L 10,7.5 C 10,9.5 11,10.5 13,10.5 C 15,10.5 16,9.5 16,7.5 L 16,1" />
      {/* I */}
      <line x1="20" y1="1" x2="20" y2="10" />
      {/* L */}
      <line x1="24" y1="1" x2="24" y2="10" />
      <line x1="24" y1="10" x2="30" y2="10" />
      {/* D */}
      <line x1="34" y1="1" x2="34" y2="10" />
      <path d="M 34,1 L 37,1 C 41,1 43,3 43,5.5 C 43,8 41,10 37,10 L 34,10" />
    </svg>
  )

  // CHAT SVG paths
  const ChatSVG = () => (
    <svg
      width="38"
      height="11"
      viewBox="0 0 38 11"
      fill="none"
      stroke={strokeColor}
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block' }}
    >
      {/* C */}
      <path d="M 8,2.5 C 7,1 5,0.8 3,1.5 C 1,2.5 0.5,4 0.5,5.5 C 0.5,7 1,8.5 3,9.5 C 5,10.5 7,10 8,8.5" />
      {/* H */}
      <line x1="11" y1="1" x2="11" y2="10" />
      <line x1="11" y1="5.5" x2="17" y2="5.5" />
      <line x1="17" y1="1" x2="17" y2="10" />
      {/* A */}
      <line x1="21" y1="10" x2="24.5" y2="1" />
      <line x1="24.5" y1="1" x2="28" y2="10" />
      <line x1="22.2" y1="8" x2="26.8" y2="8" />
      {/* T */}
      <line x1="31" y1="1" x2="37" y2="1" />
      <line x1="34" y1="1" x2="34" y2="10" />
    </svg>
  )

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '58px',
        height: '58px',
        borderRadius: '50%',
        backgroundColor: 'transparent',
        border: `0.5px solid rgba(${rgbaBase},0.5)`,
        cursor: 'pointer',
        opacity: 0.7,
        transition: 'opacity 0.2s ease',
        padding: 0,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7' }}
      aria-label={isBuildMode ? 'Back to chat' : 'Build'}
    >
      {isBuildMode ? <ChatSVG /> : <BuildSVG />}
    </button>
  )
}
