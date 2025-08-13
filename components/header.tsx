"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, X } from "lucide-react"
import { CategoryModal } from "@/components/category-modal"

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsMobileMenuOpen(false)
    }
  }

  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/popular", label: "Popular" },
    { href: "/currently-airing", label: "Currently Airing" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">D</span>
            </div>
            <span className="font-bold text-xl">DrakorID</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Search + Category */}
          <div className="hidden md:flex items-center space-x-2">
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search dramas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4 w-64"
                />
              </div>
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            <CategoryModal />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-4">
            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors hover:text-primary py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="py-2">
                <CategoryModal />
              </div>
            </nav>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Input
                  type="search"
                  placeholder="Search dramas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4"
                />
              </div>
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </header>
  )
}
