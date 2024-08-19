import React from 'react'
import Artists from './Artists'

function page() {
  return (
    <main className="flex w-full min-w-0 gap-5">
    <div className="w-full min-w-0 space-y-5">
      <div className="rounded-2xl bg-card p-5 shadow-sm">
        <h1 className="text-center text-2xl font-bold">Discover Artists </h1>
      </div>
      <Artists />
    </div>
    {/* <TrendsSidebar /> */}
  </main>
  )
}

export default page