'use client'
import { subscribeUser, unsubscribeUser } from '@/app/actions/notification-actions'
import { Button } from '@/components/ui/button'

interface SubscribeButtonProps {
  subscription: PushSubscription | null
  setSubscription: (subscription: PushSubscription | null) => void
  setError: (error: string | null) => void
}

async function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  if (typeof window === 'undefined') {
    return new Uint8Array(0); // Return an empty Uint8Array for server-side
  }

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function SubscribeButton({ subscription, setSubscription, setError }: SubscribeButtonProps) {
  async function subscribeToPush() {
    try {
      const registration = await navigator.serviceWorker.ready
      const applicationServerKey = await urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey,
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

  return (
    <>
      {subscription ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">You are subscribed to push notifications.</p>
          <Button onClick={unsubscribeFromPush} variant="outline">Unsubscribe</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">You are not subscribed to push notifications.</p>
          <Button onClick={subscribeToPush}>Subscribe</Button>
        </div>
      )}
    </>
  )
}
