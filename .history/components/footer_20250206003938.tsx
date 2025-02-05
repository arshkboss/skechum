import Link from "next/link"
import { Github, Twitter } from "lucide-react"
import ThemeToggle from "./ui/theme-toggle"
export function Footer() {
  return (
    <footer className="border-t w-full">
      <div className="px-4 md:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h4 className="font-semibold">Links</h4>
            <ul className="space-y-2 text-sm">
              {["Gallery", "Generate", "Pricing", "FAQ"].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/${item.toLowerCase()}`}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Company</h4>
            <ul className="space-y-2 text-sm">
              {["About", "Blog", "Careers", "Contact"].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/${item.toLowerCase()}`}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              {["Privacy Policy", "Terms of Service", "Copyright"].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/${item.toLowerCase().replace(" ", "-")}`}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Social</h4>
            <div className="flex space-x-4">
              <Link 
                href="https://twitter.com" 
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link 
                href="https://github.com" 
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        
      </div>
      <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground max-w-full mx-auto pb-8 flex justify-between items-center">
          <div className="flex items-center gap-4 flex-col">

          <p>© {new Date().getFullYear()} Skechum. All rights reserved. Built with ❤️ by <Link href="https://fluidpixls.com" className="text-foreground">FluidPixls</Link></p>
          
          </div>
          

          
          
          
        <ThemeToggle />
      
      </div>
    </footer>



  )
} 