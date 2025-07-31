import React from 'react'
import { Loader } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: number
  className?: string
  text?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 48, 
  className = '',
  text = 'Loading...'
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-20 ${className}`}>
      <Loader size={size} className="text-primary-500 animate-spin mb-4" />
      <p className="text-neutral-600">{text}</p>
    </div>
  )
}

export default LoadingSpinner