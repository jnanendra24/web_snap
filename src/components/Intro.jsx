import React from 'react'

export default function Intro() {
  return (
    <div
        className='grid grid-cols-3 gap-0 items-center m-5 p-5 border-2 bg-gray-100 rounded-2xl shadow-lg'
    >
      <h1
        className='text-4xl font-serif font-bold w-16 text-wrap'
      >
        Capture and Save Webpage Snapshots
      </h1>
      <img className='row-span-2 col-span-2 rounded' src="demo2.jpg" alt="demo" />
      <h3
        className='text-2xl'
      >Efficient and Simple</h3>
    </div>
  )
}
