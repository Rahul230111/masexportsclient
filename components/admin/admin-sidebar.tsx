"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, ShoppingCart, LogOut, ChevronLeft,FrameIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminSidebarProps {
  open: boolean
  onToggle: () => void
}

export function AdminSidebar({ open, onToggle }: AdminSidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  const menuItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    {href:"/admin/hero",label:"hero",icon: FrameIcon }
  ]

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        open ? "w-64" : "w-20",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        {open && <h1 className="font-bold text-lg text-sidebar-foreground">Admin</h1>}
        <button onClick={onToggle} className="p-1 hover:bg-sidebar-accent rounded-lg transition-colors">
          <ChevronLeft className={cn("w-5 h-5 text-sidebar-foreground transition-transform", !open && "rotate-180")} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)

          return (
            <Link key={item.href} href={item.href}>
              <button
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {open && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          onClick={logout}
          variant="ghost"
          className={cn(
            "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
            !open && "justify-center",
          )}
        >
          <LogOut className="w-5 h-5" />
          {open && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </aside>
  )
}
