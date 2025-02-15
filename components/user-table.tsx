'use client'

import { useState, useEffect } from 'react'


interface User {
  id: string
  name: string | null
  email: string | null
}

export function UserTable() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/users')
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error('Failed to fetch users:', error)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div>
      <h3 className="text-lg font-semibold">Users</h3>
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.id}</td>
              <td className="border px-4 py-2">{user.name || '-'}</td>
              <td className="border px-4 py-2">{user.email || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
