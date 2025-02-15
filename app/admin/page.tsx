'use client'

import { useState } from 'react'
import { makeUserAdmin } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCurrentUser } from '@/hooks/use-current-user'

export default function AdminPage() {
  const user = useCurrentUser()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleMakeAdmin(e: React.FormEvent) {
    e.preventDefault()
    try {
      setError('')
      setMessage('')
      
      const result = await makeUserAdmin(email)
      if (result.success) {
        setMessage(`Successfully made ${email} an admin`)
        setEmail('')
      } else {
        setError(result.error || 'Failed to update user')
      }
    } catch (err: unknown) {
      const error = err as Error
      setError(error.message || 'An error occurred')
    }
  }

  if (!user) {
    return <div className="p-4">Please log in to access this page.</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Admin Management</h1>
      
      <form onSubmit={handleMakeAdmin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            User Email
          </label>
          <div className="flex gap-2">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user email"
              required
            />
            <Button type="submit">Make Admin</Button>
          </div>
        </div>
      </form>

      {message && (
        <p className="text-sm text-green-600">{message}</p>
      )}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
