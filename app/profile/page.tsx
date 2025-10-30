"use client"

import { useAuth } from "@/context/auth-context"
import { useEffect, useState } from "react"

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const [localUser, setLocalUser] = useState(user)

  useEffect(() => {
    if (user) setLocalUser(user)
  }, [user])

  if (isLoading || !localUser) {
    return <div className="text-center mt-10 text-lg">Loading user details...</div>
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-semibold mb-4">My Profile</h1>

      <div className="space-y-3">
        <p><span className="font-medium">Name:</span> {localUser.name}</p>
        <p><span className="font-medium">Email:</span> {localUser.email}</p>
        <p><span className="font-medium">Role:</span> {localUser.role}</p>
        <p><span className="font-medium">User ID:</span> {localUser._id}</p>
      </div>
    </div>
  )
}
