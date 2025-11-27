import '../styles/globals.css'
import { ReactNode } from 'react'
import FloatingHeader from '../components/FloatingHeader'
import ReadingProgress from '../components/ReadingProgress'
import FloatingPixels from '@/components/FloatingPixels'
import { Toaster } from 'react-hot-toast'


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className='bg-black text-white'>
        <FloatingHeader/>
        <Toaster position='top-center'/>
        {children}
        <ReadingProgress />
        <FloatingPixels/>
      </body>
    </html>
  )
}
  