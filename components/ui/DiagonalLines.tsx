'use client'

export default function DiagonalLines() {
  return (
    <>
      <style jsx>{`
        @keyframes rotateMesh {
          0% {
            transform: translate(-50%, -50%) rotate(45deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(225deg);
          }
        }

        .rotating-mesh {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 400%;
          height: 400%;
          background: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 9px,
            rgba(255, 255, 255, 0.5) 9px,
            rgba(255, 255, 255, 0.5) 10px
          );
          transform-origin: center center;
          animation: rotateMesh 60s linear infinite;
          pointer-events: none;
        }
      `}</style>

      <div className="rotating-mesh" />
    </>
  )
}
