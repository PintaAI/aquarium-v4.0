'use client'

import { useState, useEffect } from 'react'
import { makeUserAdmin } from '@/app/actions/admin-actions'
import { getDatabaseStats, type DatabaseStats } from '@/app/actions/database-stats'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useCurrentUser } from '@/hooks/use-current-user'
import { PushNotificationManager } from '@/components/pwa/notification-manager'
import { UserTable } from '@/components/user-table'

export default function AdminPage() {
  const user = useCurrentUser()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [stats, setStats] = useState<DatabaseStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const result = await getDatabaseStats()
        if (result.success) {
          setStats(result.stats)
        } else {
          setError(result.error || 'Failed to fetch database stats')
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
        setError('Failed to load database statistics')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

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
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Admin Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">User Management</h2>
          <form onSubmit={handleMakeAdmin} className="space-y-4 mb-4">
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
        </Card>

        {isLoading ? (
          <Card className="p-4">
            <p>Loading database statistics...</p>
          </Card>
        ) : stats ? (
          <>
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Database Overview</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">Users</p>
                  <p className="text-2xl font-bold">{stats.counts.users}</p>
                </div>
                <div className="p-3 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">Courses</p>
                  <p className="text-2xl font-bold">{stats.counts.courses}</p>
                </div>
                <div className="p-3 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">Modules</p>
                  <p className="text-2xl font-bold">{stats.counts.modules}</p>
                </div>
                <div className="p-3 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">Articles</p>
                  <p className="text-2xl font-bold">{stats.counts.articles}</p>
                </div>
                <div className="p-3 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">Testimonials</p>
                  <p className="text-2xl font-bold">{stats.counts.testimonials}</p>
                </div>
                <div className="p-3 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">Vocabulary</p>
                  <p className="text-2xl font-bold">{stats.counts.vocabularyItems}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">User Distribution</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">By Role</h3>
                  <div className="space-y-2">
                    {stats.distribution.usersByRole.map((stat) => (
                      <div key={stat.role} className="flex items-center justify-between p-2 bg-primary/5 rounded">
                        <span className="font-medium">{stat.role}</span>
                        <span className="px-2 py-1 bg-background rounded text-sm">
                          {stat._count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">By Plan</h3>
                  <div className="space-y-2">
                    {stats.distribution.usersByPlan.map((stat) => (
                      <div key={stat.plan} className="flex items-center justify-between p-2 bg-primary/5 rounded">
                        <span className="font-medium">{stat.plan}</span>
                        <span className="px-2 py-1 bg-background rounded text-sm">
                          {stat._count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Course Distribution</h2>
              <div>
                <h3 className="font-medium mb-3">By Level</h3>
                <div className="space-y-2">
                  {stats.distribution.coursesByLevel.map((stat) => (
                    <div key={stat.level} className="flex items-center justify-between p-2 bg-primary/5 rounded">
                      <span className="font-medium">{stat.level}</span>
                      <span className="px-2 py-1 bg-background rounded text-sm">
                        {stat._count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </>
        ) : null}
      </div>
      <PushNotificationManager />
      <UserTable />
    </div>
  )
}
