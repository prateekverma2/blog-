"use client";

import { useEffect, useState } from 'react'

const ReadingProgress: React.FC = () => {
  const [progress, setProgress] = useState(0)

  const updateProgress = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    const windowHeight = scrollHeight - clientHeight
    setProgress((scrollTop / windowHeight) * 100)
  }

  useEffect(() => {
    window.addEventListener('scroll', updateProgress)
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div className="fixed bottom-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800">
      <div 
        className="h-full bg-accent.green transition-all duration-200"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export default ReadingProgress
