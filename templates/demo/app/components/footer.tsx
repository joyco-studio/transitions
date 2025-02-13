import type { loader } from '@/root'
import { usePreservedLoaderData } from '@joycostudio/transitions'
import { Link } from 'react-router'

export default function Footer() {
  const { rebelLog } = usePreservedLoaderData<typeof loader>()

  return (
    <div className="flex flex-col items-center justify-center fixed bottom-4 right-4 opacity-30">
      <Link
        target="_blank"
        to="https://joyco.studio"
        className="font-mono whitespace-pre text-[8px] leading-[1.25] tracking-wide font-medium uppercase mt-2 text-right"
      >
        {rebelLog}
      </Link>
    </div>
  )
}
