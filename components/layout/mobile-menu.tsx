"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, Settings, User, Home, Zap, Code, CreditCard, Mail } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { createBrowserComponentClient } from "@/utils/supabase/browser-client"
import { Separator } from "@/components/ui/separator"

const publicLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/features", label: "Features", icon: Zap },
  { href: "/api", label: "API", icon: Code },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
  { href: "/contact", label: "Contact", icon: Mail },
]

const authenticatedLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/api-keys", label: "API Keys", icon: Code },
]

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const supabase = createBrowserComponentClient()
  
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoading(false)
    }
    
    checkUser()
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null)
      }
    )
    
    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/" className="font-bold text-xl flex items-center" onClick={() => setIsOpen(false)}>
              <span className="text-primary">Crea</span>Vibe
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="flex-1 p-4">
            {!loading && (
              <ul className="space-y-3">
                <AnimatePresence>
                  {(user ? authenticatedLinks : publicLinks).map((link, index) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className={`flex items-center py-2 px-3 text-lg rounded-md transition-colors hover:bg-muted ${
                          pathname === link.href ? "font-medium text-primary" : "text-foreground"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.icon && <link.icon className="mr-3 h-5 w-5" />}
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
            
            {loading && (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 bg-muted animate-pulse rounded-md"></div>
                ))}
              </div>
            )}
          </nav>
          <div className="p-4 border-t space-y-3">
            {!user && !loading && (
              <>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
            
            {user && (
              <Button variant="outline" className="w-full" onClick={async () => {
                await supabase.auth.signOut()
                setIsOpen(false)
                window.location.href = "/"
              }}>
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
