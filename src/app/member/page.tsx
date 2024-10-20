'use client'

import { Loader2 } from "lucide-react"
import { signOut } from "next-auth/react"
import { useAuth } from "@/hooks/useAuth"

export default function MemberHome() {
    const { session, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="flex items-center space-x-2">
                    <Loader2 size="1.5em" className="animate-spin text-gray-500" />
                    <span className="text-gray-500">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="flex items-center space-x-2">
                <div className="mb-4">
                    <h1 className="text-2xl font-semibold">Welcome, {session?.user.username}</h1>
                    <p className="text-sm">
                        {session?.user.role}
                    </p>
                </div>
                <button
                    onClick={() => signOut()}
                    className="text-gray-500 hover:text-gray-700"
                >
                    Sign Out
                </button>
            </div>
        </div>
    )
}
