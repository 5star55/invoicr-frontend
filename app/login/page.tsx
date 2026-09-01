'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-blue-500 mb-2'>Invoicr</h1>
          <p className='text-gray-400'>Master your financials.</p>
        </div>

        {/* Login Form */}
        <div className='border border-slate-700 rounded-lg p-8 bg-oklch(20.8% 0.042 265.755)'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Email Field */}
            <div>
              <label className='block text-xs font-semibold text-gray-300 mb-2 tracking-wide'>
                EMAIL ADDRESS
              </label>
              <div className='relative'>
                <span className='absolute left-3 top-3 text-gray-500'>✉</span>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='freelancer@example.com'
                  className='w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500'
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className='flex justify-between items-center mb-2'>
                <label className='block text-xs font-semibold text-gray-300 tracking-wide'>
                  PASSWORD
                </label>
                <Link href='#' className='text-xs text-gray-400 hover:text-gray-300'>
                  Forgot password?
                </Link>
              </div>
              <div className='relative'>
                <span className='absolute left-3 top-3 text-gray-500'>🔒</span>
                <input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='••••••••'
                  className='w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500'
                  required
                />
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='remember'
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className='w-4 h-4 rounded border-slate-600 bg-slate-700 cursor-pointer'
              />
              <label htmlFor='remember' className='ml-2 text-sm text-gray-400 cursor-pointer'>
                Remember me for 30 days
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type='submit'
              className='w-full bg-blue-500 text-uppercase hover:bg-blue-600 text-white font-semibold py-3 rounded transition-colors'
            >
              Sign In
            </button>
          </form>

          {/* Sign Up Link */}
          <div className='text-center mt-6'>
            <p className='text-gray-400 text-sm'>
              Don't have an account?{' '}
              <Link href='/signup' className='text-white font-semibold hover:text-blue-400'>
                SIGN UP
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='mt-12 text-gray-500 text-xs text-center'>
        <p>© 2024 Invoicr. All rights reserved.</p>
      </div>
    </div>
  )
}
