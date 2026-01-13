'use client'

export default function ScanLine() {
  return (
    <>
      <style jsx>{`
        @keyframes scanFall {
          0% {
            top: 0;
            opacity: 0;
          }
          33% {
            opacity: 0;
          }
          38% {
            opacity: 0.15;
          }
          43% {
            opacity: 0.4;
          }
          48% {
            opacity: 0.7;
          }
          53% {
            opacity: 1;
          }
          70% {
            opacity: 0.4;
          }
          85% {
            opacity: 0.1;
          }
          95%, 100% {
            top: 100%;
            opacity: 0;
          }
        }

        .scan-line {
          position: absolute;
          left: 0;
          width: 100%;
          height: 1px;
          background: #ffffff;
          animation: scanFall 6s cubic-bezier(0.55, 0, 1, 0.45) infinite;
        }
      `}</style>

      <div 
        className="absolute top-0 left-0 w-full pointer-events-none z-[1] overflow-hidden"
        style={{ height: '800px' }}
      >
        <div className="scan-line" />
      </div>
    </>
  )
}
