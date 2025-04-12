"use client"

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  onClick,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-primary text-white hover:bg-primary/90"
      case "secondary":
        return "bg-gray-200 text-gray-800 hover:bg-gray-300"
      case "success":
        return "bg-green-500 text-white hover:bg-green-600"
      case "danger":
        return "bg-red-500 text-white hover:bg-red-600"
      case "outline":
        return "bg-transparent border border-primary text-primary hover:bg-primary/10"
      case "ghost":
        return "bg-transparent text-gray-700 hover:bg-gray-100"
      default:
        return "bg-primary text-white hover:bg-primary/90"
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1.5 text-sm"
      case "md":
        return "px-4 py-2"
      case "lg":
        return "px-6 py-3 text-lg"
      default:
        return "px-4 py-2"
    }
  }

  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"

  const buttonClasses = `${baseClasses} ${getVariantClasses()} ${getSizeClasses()} ${disabledClasses} ${className}`

  return (
    <button type={type} className={buttonClasses} disabled={disabled} onClick={onClick} {...props}>
      {children}
    </button>
  )
}

export default Button
