import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

interface CustomButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  to?: string
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  target?: '_blank' | '_self' | '_parent' | '_top'
  rel?: string
  ariaLabel?: string
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  to,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  target,
  rel,
  ariaLabel,
}) => {
  const { colors } = useTheme()

  // Size configurations
  const sizeClasses = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-5 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  // Variant configurations
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          color: '#000000',
          hoverBackgroundColor: colors.primaryDark,
        }
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          color: '#ffffff',
          hoverBackgroundColor: colors.secondaryDark,
        }
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: colors.secondary,
          border: `2px solid ${colors.secondary}`,
          hoverBackgroundColor: colors.secondary,
          hoverColor: '#ffffff',
        }
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: colors.secondary,
          hoverBackgroundColor: colors.primaryLight + '20',
          hoverColor: colors.secondaryDark,
        }
      default:
        return {
          backgroundColor: colors.primary,
          color: '#000000',
          hoverBackgroundColor: colors.primaryDark,
        }
    }
  }

  const variantStyles = getVariantStyles()

  // Base button classes
  const baseClasses = `
    ${sizeClasses[size]}
    rounded-lg font-semibold transition-all duration-300 
    inline-flex items-center justify-center
    cursor-pointer
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
    ${className}
  `.trim()

  // Motion wrapper component
  const MotionWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <motion.div
      whileTap={!disabled ? { 
        transform: "translate3d(0px, 0px, 0px) scale(0.95)" 
      } : {}}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  )

  // Event handlers
  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (!disabled) {
      const target = e.currentTarget as HTMLElement
      target.style.backgroundColor = variantStyles.hoverBackgroundColor
      if (variantStyles.hoverColor) {
        target.style.color = variantStyles.hoverColor
      }
    }
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (!disabled) {
      const target = e.currentTarget as HTMLElement
      target.style.backgroundColor = variantStyles.backgroundColor
      target.style.color = variantStyles.color
    }
  }

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick()
    }
  }

  // Common props
  const commonProps = {
    className: baseClasses,
    style: {
      backgroundColor: variantStyles.backgroundColor,
      color: variantStyles.color,
      border: variantStyles.border || 'none',
    },
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    'aria-label': ariaLabel,
  }

  // Render as Link (React Router)
  if (to && !disabled) {
    return (
      <MotionWrapper>
        <Link
          to={to}
          {...commonProps}
        >
          {children}
        </Link>
      </MotionWrapper>
    )
  }

  // Render as external link
  if (href && !disabled) {
    return (
      <MotionWrapper>
        <a
          href={href}
          target={target}
          rel={rel}
          {...commonProps}
        >
          {children}
        </a>
      </MotionWrapper>
    )
  }

  // Render as button
  return (
    <MotionWrapper>
      <button
        type={type}
        onClick={handleClick}
        disabled={disabled}
        {...commonProps}
      >
        {children}
      </button>
    </MotionWrapper>
  )
}

export default CustomButton