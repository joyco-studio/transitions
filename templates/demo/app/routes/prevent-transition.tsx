import { Paragraph } from '@/components/paragraph'
import { useNavigate } from 'react-router'

export default function PreventTransition() {
  const navigate = useNavigate()

  return (
    <div className="flex selection:bg-primary selection:text-accent flex-col items-center h-screen bg-accent">
      <div className="flex-1 flex flex-col justify-center items-center px-4">
        <h1 data-animate data-split className="font-sans text-6xl font-bold mb-7">
          PREVENT TRANSITION PAGE
        </h1>
        <Paragraph>
          <span data-animate="paragraph" className="font-bold">
            You can prevent transitions too!
          </span>{' '}
          <button data-animate="paragraph" className="underline" onClick={() => navigate(-1)}>
            GO BACK SMOOTHLY
          </button>
        </Paragraph>
      </div>
    </div>
  )
}
