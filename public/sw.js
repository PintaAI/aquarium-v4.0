self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.resolve() // Nothing to cache for now
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.resolve() // Nothing to clean up for now
  )
})

self.addEventListener('push', function (event) {
  if (!event.data) {
    console.log('Push event but no data')
    return
  }

  let data;
  try {
    data = event.data.json()
  } catch (err) {
    console.error('Failed to parse push data:', err)
    return
  }

  if (!data.title || !data.body) {
    console.error('Missing required notification data')
    return
  }

  const options = {
    body: data.body,
    icon: data.icon || '/images/logoo.png',
    badge: '/images/logoo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2',
      path: data.path || '/',
    },
    renotify: false, // Prevent duplicate notifications
    tag: 'push-notification', // Group similar notifications
    requireInteraction: true, // Keep notification visible until user interacts with it
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
      .catch(err => {
        console.error('Error showing notification:', err)
        // Re-throw to ensure the push event fails if notification fails
        throw err
      })
  )
})

self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received.')
  event.notification.close()
  
  const path = event.notification.data?.path || '/'
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(windowClients => {
        // Check if there is already a window/tab open with the target URL
        for (let client of windowClients) {
          const url = new URL(client.url)
          if (url.pathname === path && 'focus' in client) {
            return client.focus()
          }
        }
        // If no window/tab is open, open a new one
        return clients.openWindow(path)
      })
  )
})
