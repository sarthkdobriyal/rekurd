import { Volume, Volume1, Volume2 } from 'lucide-react'
import Image from 'next/image'
import { FC } from 'react'

interface PlayerProps {
  
}

const Player: FC<PlayerProps> = ({}) => {
  return <div className='flex flex-col w-full gap-y-4 '>
    <Image 
        src='/record.jpg'
        alt='record'
        width={300}
        height={200}
        className='object-contain'
    />

    <div className='flex flex-col gap-y-1'>
        <div className='flex items-center gap-x-3'>
        <span className='font-sans text-xl font-semibold '>Bheege Honth Tere</span>
        <Volume2  className='text-muted-foreground'/>
        </div>
        <span className='text-muted-foreground text-base font-sans'>Imran Hashmi</span>
    </div>

    {/* <audio src="" className='hidden'></audio> */}

    <div className='flex gap-x-2 font-sans items-center font-light'>
      <span className=' text-xs '>Up next: </span>
      <span className=' text-base'>Pyaasa Dil Mera - Imran hashmi</span>
      
    </div>

    
    
  </div>
}

export default Player