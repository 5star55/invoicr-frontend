import React from 'react'

export default function Signup() {
  return (
    <div className='flex flex-col min-h-screen bg-black'>
      <div className='flex-1 flex flex-col items-center justify-center py-2'>
        <div className='w-full max-w-md'>
          <h1 className='text-4xl font-bold text-blue-500 mb-2 text-center'>INVOICR</h1>
          <p className='text-gray-400 text-center mb-8'>Create your account to get started.</p>
          <div className='border border-slate-700 p-8 bg-oklch(20.8% 0.042 265.755) rounded-lg'>
            {/* Signup form will go here */}
          </div>
        </div>
      </div>
    </div>
  )
}
