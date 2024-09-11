import { Headphones } from 'lucide-react'
import { FC } from 'react'

interface ListeningCountProps {
  
}

const ListeningCount: FC<ListeningCountProps> = ({}) => {
  return <div className='flex gap-x-1 items-center'>
    <span><Headphones className='w-4 h-4 text-muted-foreground' /> </span>
    <span className='text-sm font-mono'>3</span>
  </div>
}

export default ListeningCount