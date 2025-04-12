const Card = ({ children, className = "", ...props }) => {
    return (
      <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`} {...props}>
        {children}
      </div>
    )
  }
  
  const CardHeader = ({ children, className = "", ...props }) => {
    return (
      <div className={`px-6 py-4 border-b border-gray-200 ${className}`} {...props}>
        {children}
      </div>
    )
  }
  
  const CardTitle = ({ children, className = "", ...props }) => {
    return (
      <h3 className={`text-lg font-semibold text-gray-900 ${className}`} {...props}>
        {children}
      </h3>
    )
  }
  
  const CardContent = ({ children, className = "", ...props }) => {
    return (
      <div className={`px-6 py-4 ${className}`} {...props}>
        {children}
      </div>
    )
  }
  
  const CardFooter = ({ children, className = "", ...props }) => {
    return (
      <div className={`px-6 py-4 bg-gray-50 border-t border-gray-200 ${className}`} {...props}>
        {children}
      </div>
    )
  }
  
  Card.Header = CardHeader
  Card.Title = CardTitle
  Card.Content = CardContent
  Card.Footer = CardFooter
  
  export { Card, CardHeader, CardTitle, CardContent, CardFooter }
  