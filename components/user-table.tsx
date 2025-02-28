'use client'

import { useState, useEffect } from 'react'


interface User {
  id: string
  name: string | null
  email: string | null
  role: string
  plan: string
}

export function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUsers() {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch('/api/users')
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(errorText || response.statusText)
        }
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error('Failed to fetch users:', error)
        setError(error instanceof Error ? error.message : 'Failed to load users')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Users</h3>
      
      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center p-4">Loading users...</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-primary/5">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Plan</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-2">{user.name || '-'}</td>
                <td className="px-4 py-2">{user.email || '-'}</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 bg-primary/10 rounded-full text-sm">
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    user.plan === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-gray-100'
                  }`}>
                    {user.plan}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  )
}
