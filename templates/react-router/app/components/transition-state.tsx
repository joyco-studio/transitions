import { useTransitionState } from '../../../../dist'

export const TransitionState = () => {
  const { state, isEntering, isExiting, isIdle } = useTransitionState()
  return (
    <div className="fixed top-0 left-0 flex flex-col gap-2 text-white p-4">
      <p>State: {state} </p>
      <p>Is Entering: {isEntering ? 'true' : 'false'} </p>
      <p>Is Exiting: {isExiting ? 'true' : 'false'} </p>
      <p>Is Idle: {isIdle ? 'true' : 'false'} </p>
    </div>
  )
}
