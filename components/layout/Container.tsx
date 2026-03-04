// components/layout/Container.tsx

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export default function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`max-w-[880px] mx-auto px-10 md:px-12 ${className}`}>
      {children}
    </div>
  )
}
