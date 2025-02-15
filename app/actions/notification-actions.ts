'use server'

import webpush from 'web-push'
import { currentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

webpush.setVapidDetails(
  'mailto:admin@pejuangkorea.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

type SerializedPushSubscription = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

export async function subscribeUser(sub: SerializedPushSubscription) {
  const user = await currentUser()
  if (!user?.id) {
    throw new Error('Authentication required')
  }

  const { endpoint, keys } = sub
  const { p256dh, auth } = keys

  try {
    await prisma.pushSubscription.upsert({
      where: {
        userId: user.id,
      },
      create: {
        endpoint,
        p256dh,
        auth,
        userId: user.id,
      },
      update: {
        endpoint,
        p256dh,
        auth,
      },
    })
    return { success: true }
  } catch (error) {
    console.error('Error saving subscription:', error)
    return { success: false, error: 'Failed to save subscription' }
  }
}

export async function unsubscribeUser() {
  const user = await currentUser()
  if (!user?.id) {
    throw new Error('Authentication required')
  }

  try {
    await prisma.pushSubscription.delete({
      where: {
        userId: user.id,
      },
    })
    return { success: true }
  } catch (error) {
    console.error('Error removing subscription:', error)
    return { success: false, error: 'Failed to remove subscription' }
  }
}

export async function sendNotification(message: string, userId?: string) {
  try {
    let subscriptions;

    if (userId) {
      // Get subscription for specific user
      subscriptions = await prisma.pushSubscription.findMany({
        where: {
          userId: userId,
        },
        select: {
          endpoint: true,
          p256dh: true,
          auth: true,
        },
      });
    } else {
      // Get all subscriptions
      subscriptions = await prisma.pushSubscription.findMany({
        select: {
          endpoint: true,
          p256dh: true,
          auth: true,
        },
      });
    }

    // Send notification to subscribed users
    const results = await Promise.all(
      subscriptions.map((sub) =>
        webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          JSON.stringify({
            title: 'Pemberitahuan',
            body: message,
            icon: '/manifest-icon-192.maskable.png',
          })
        )
      )
    );

    return { success: true, sent: results.length };
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { success: false, error: 'Failed to send notification' };
  }
}
