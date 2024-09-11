import { FC } from 'react'

interface RadioChatMessageProps {
  
}

const RadioChatMessage: FC<RadioChatMessageProps> = ({}) => {
  return <div className="flex flex-col">
  <div className="flex items-center gap-x-2">
    <span className="font-sans text-sm font-semibold">DJ</span>
    <span className="font-sans text-xs text-muted-foreground">
      12:00 PM
    </span>
  </div>
  <span className="font-sans text-sm text-muted-foreground">
    Hello everyone! Welcome to the show
  </span>
</div>
}

export default RadioChatMessage