const Footer = () => {
    return (
      <footer className="bg-white shadow-inner py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600">
                &copy; {new Date().getFullYear()} Smart Hospital Management. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-gray-600 hover:text-primary">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-primary">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-primary">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    )
  }
  
  export default Footer
  