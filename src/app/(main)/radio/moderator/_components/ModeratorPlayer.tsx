import { Ban, ChevronLast, Play, Repeat1, Volume2 } from 'lucide-react'
import Image from 'next/image'
import { FC } from 'react'

interface ModeratorPlayerProps {
  
}

const ModeratorPlayer: FC<ModeratorPlayerProps> = ({}) => {
  return <div className='flex flex-col w-full gap-y-4 '>
    <div className='flex gap-x-3'>

  <Image 
      src='/record.jpg'
      alt='record'
      width={50}
      height={50}
      className='object-contain'
      />

  <div className='flex flex-col text-xs gap-y-1'>
      <div className='flex items-center gap-x-3'>
      <span className='font-sans text-xl font-semibold '>Bheege Honth Tere</span>
      <Volume2  className='text-muted-foreground'/>
      </div>
      <span className='text-muted-foreground text-base font-sans'>Imran Hashmi</span>
  </div>
    </div>

    <div className='flex justify-between cursor-pointer font-sans items-center font-light px-20'>
    <span className=' text-xs '>
    <Play className='' />
    </span>
    <span className=' text-xs '>
    <ChevronLast className='' />
    </span>
    <span className=' text-xs '>
    <Ban className='' />
    </span>
    <span className=' text-xs '>
    <Repeat1  className='' />
    </span>
    
  </div>

   
</div>
}

export default ModeratorPlayer