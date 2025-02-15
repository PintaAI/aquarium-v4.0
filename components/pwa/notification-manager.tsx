'use client'

import { useState, useEffect } from 'react'
import { sendNotification } from '@/app/actions/notification-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCurrentUser } from '@/hooks/use-current-user'
import { SubscribeButton } from '@/components/pwa/subscribe-button'


export function PushNotificationManager() {
  const user = useCurrentUser()
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [message, setMessage] = useState('')
  const [userId, setUserId] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      })
      const sub = await registration.pushManager.getSubscription()
      setSubscription(sub)
    } catch (err) {
      console.error('Failed to register service worker:', err)
      setError('Failed to initialize push notifications')
    }
  }

  async function sendTestNotification() {
    try {
      setError(null)
      const result = await sendNotification(message, userId)
      if (!result.success) {
        throw new Error(result.error || 'Failed to send notification')
      }
      setMessage('')
      setUserId('')
    } catch (err: unknown) {
      console.error('Failed to send notification:', err)
      const error = err as Error
      setError(error.message || 'Failed to send notification')
    }
  }

  if (!user) {
    return <p className="text-muted-foreground">Please log in to manage notifications.</p>
  }

  if (!isSupported) {
    return <p className="text-muted-foreground">Push notifications are not supported in this browser.</p>
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Push Notifications</h3>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <SubscribeButton
        subscription={subscription}
        setSubscription={setSubscription}
        setError={setError}
      />

      {/* Show send notification UI for all users for now */}
      <div className="space-y-4 pt-4 border-t">
        <h4 className="text-md font-medium">Send Notification</h4>
        <div className="grid gap-2 items-center">
          <Label htmlFor="message">Message</Label>
          <Input
            id="message"
            type="text"
            placeholder="Enter notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="grid gap-2 items-center">
          <Label htmlFor="userId">User ID (optional)</Label>
          <Input
            id="userId"
            type="text"
            placeholder="Enter user ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <Button onClick={sendTestNotification}>Send</Button>
      </div>
    </div>
  )
}

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window)
    )

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
  }, [])

  if (isStandalone) {
    return null // Don't show install button if already installed
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Install App</h3>
      {isIOS ? (
        <p className="text-sm text-muted-foreground">
          To install this app on your iOS device, tap the share button
          <span role="img" aria-label="share icon"> ⎋ </span>
          and then Add to Home Screen
          <span role="img" aria-label="plus icon"> ➕ </span>.
        </p>
      ) : (
        <Button>Add to Home Screen</Button>
      )}
    </div>
  )
}
