// components/layout/Container.tsx

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export default function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`max-w-[1200px] mx-auto px-14 md:px-12 ${className}`}>
      {children}
    </div>
  )
}
