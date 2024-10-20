import Link from 'next/link'

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Unauthorized Access</h1>
      <p className="mb-4">You do not have permission to access this page.</p>
      <Link href="/" className="text-blue-500 hover:text-blue-700">
        Return to Home
      </Link>
    </div>
  )
}