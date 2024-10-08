import React from 'react'
import Artists from './Artists'
import Link from 'next/link'
import { Search, SlidersHorizontal } from 'lucide-react'

function page() {
  return (
    <main className="flex flex-col w-full">
    {/* <div className="w-full  min-w-0 space-y-5"> */}
      <div className=" flex gap-x-3  w-full items-center  px-7 pt-5">
       
          <Link href='/search'  className='w-full'>
          <div className='w-full flex gap-x-3 bg-muted px-3 py-1 rounded-xl items-center'>
            
          <Search className='text-muted-foreground w-5 h-5 text-xs font-light'/>
          Search Artists
          </div>
          </Link>

          <SlidersHorizontal />

      </div>
      <Artists />
    {/* </div> */}
    {/* <TrendsSidebar /> */}
  </main>
  )
}

export default page