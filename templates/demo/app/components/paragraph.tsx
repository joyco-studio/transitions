import cn from '@/lib/utils/cn'

export const Paragraph = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <p
      className={cn(
        'text-center font-mono text-primary text-opacity-50 text-pretty whitespace-pre-wrap text-xs leading-relaxed font-medium uppercase mt-2 max-w-prose',
        className
      )}
    >
      {children}
    </p>
  )
}
