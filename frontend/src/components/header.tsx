import Link from 'next/link'
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          E-Sign
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="text-muted-foreground hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <Link href="/documents" className="text-muted-foreground hover:text-primary">
                Documents
              </Link>
            </li>
            <li>
              <Link href="/users" className="text-muted-foreground hover:text-primary">
                Users
              </Link>
            </li>
          </ul>
        </nav>
        <Button variant="outline">Sign In</Button>
      </div>
    </header>
  )
}
