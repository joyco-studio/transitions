import { Navigation } from './navigation'

export const Page = ({ name, children }: { name: string; children?: React.ReactNode }) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <span className="text-4xl font-semibold">/{name.toLowerCase()}</span>
      {children}
    </div>
  )
}
