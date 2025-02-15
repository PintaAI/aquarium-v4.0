'use client'

import { useState, useEffect } from 'react'
import { subscribeUser, unsubscribeUser, sendNotification } from '@/app/actions/notification-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCurrentUser } from '@/hooks/use-current-user'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function PushNotificationManager() {
  const user = useCurrentUser()
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [message, setMessage] = useState('')
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

  async function subscribeToPush() {
    try {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      })
      setSubscription(sub)
      // Serialize the subscription object
      const json = sub.toJSON()
      if (!json.keys?.p256dh || !json.keys?.auth) {
        throw new Error('Invalid subscription keys')
      }
      const serializedSub = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: json.keys.p256dh,
          auth: json.keys.auth
        }
      }
      const result = await subscribeUser(serializedSub)
      if (!result.success) {
        throw new Error(result.error || 'Failed to save subscription')
      }
    } catch (err: unknown) {
      console.error('Failed to subscribe:', err)
      const error = err as Error
      setError(error.message || 'Failed to subscribe to notifications')
      setSubscription(null)
    }
  }

  async function unsubscribeFromPush() {
    try {
      await subscription?.unsubscribe()
      setSubscription(null)
      const result = await unsubscribeUser()
      if (!result.success) {
        throw new Error(result.error || 'Failed to remove subscription')
      }
    } catch (err: unknown) {
      console.error('Failed to unsubscribe:', err)
      const error = err as Error
      setError(error.message || 'Failed to unsubscribe from notifications')
    }
  }

  async function sendTestNotification() {
    try {
      setError(null)
      const result = await sendNotification(message)
      if (!result.success) {
        throw new Error(result.error || 'Failed to send notification')
      }
      setMessage('')
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
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {subscription ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">You are subscribed to push notifications.</p>
          <Button onClick={unsubscribeFromPush} variant="outline">Unsubscribe</Button>
          
          {/* Show send notification UI for all users for now */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="text-md font-medium">Send Notification</h4>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter notification message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button onClick={sendTestNotification}>Send</Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">You are not subscribed to push notifications.</p>
          <Button onClick={subscribeToPush}>Subscribe</Button>
        </div>
      )}
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
          and then &quot;Add to Home Screen&quot;
          <span role="img" aria-label="plus icon"> ➕ </span>.
        </p>
      ) : (
        <Button>Add to Home Screen</Button>
      )}
    </div>
  )
}
