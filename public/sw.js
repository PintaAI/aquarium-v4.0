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

  try {
    const data = event.data.json()
    const options = {
      body: data.body || 'No message content',
      icon: data.icon || '/manifest-icon-192.maskable.png',
      badge: '/manifest-icon-192.maskable.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
      },
    }
    
    if (!data.title) {
      throw new Error('Notification title is required')
    }

    event.waitUntil(
      self.registration.showNotification(data.title, options)
        .catch(err => console.error('Error showing notification:', err))
    )
  } catch (err) {
    console.error('Error processing push event:', err)
  }
})

self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received.')
  event.notification.close()
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(windowClients => {
        // Check if there is already a window/tab open with the target URL
        for (let client of windowClients) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus()
          }
        }
        // If no window/tab is open, open a new one
        return clients.openWindow('/')
      })
  )
})
