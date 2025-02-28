'use server'

import webpush from 'web-push'
import { currentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from '@prisma/client'

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

interface NotificationPayload {
  title?: string;
  body: string;
  icon?: string;
  path?: string;
}

type PushSubscriptionWithEndpoint = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

export async function sendNotification(
  payload: NotificationPayload,
  options?: {
    userId?: string;
    roleFilter?: UserRole[];
  }
) {
  try {
    // Check if current user is admin
    const currentUserData = await currentUser();
    if (!currentUserData?.id || currentUserData.role !== 'ADMIN') {
      throw new Error('Unauthorized: Only admins can send notifications');
    }

    let subscriptions: PushSubscriptionWithEndpoint[] = [];
    const { userId } = options || {};

    if (userId) {
      // Get subscription for specific user
      const subscription = await prisma.pushSubscription.findUnique({
        where: {
          userId: userId,
        },
        select: {
          endpoint: true,
          p256dh: true,
          auth: true,
        },
      });
      if (subscription) {
        subscriptions = [subscription];
      } else {
        throw new Error('User not found or not subscribed to notifications');
      }
    } else {
      // Get all subscriptions
      const results = await prisma.pushSubscription.findMany({
        select: {
          endpoint: true,
          p256dh: true,
          auth: true,
        }
      });
      
      subscriptions = results;
    }

    if (subscriptions.length === 0) {
      throw new Error('No subscribed users found');
    }

    try {
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
              title: payload.title || 'Pemberitahuan',
              body: payload.body,
              icon: payload.icon || '/images/logoo.png',
              path: payload.path || '/',
            })
          )
        )
      );

      return { success: true, sent: results.length };
    } catch (pushError: any) {
      // If webpush returns a 410 error, it means the subscription is expired/invalid
      if (pushError.statusCode === 410) {
        await prisma.pushSubscription.delete({
          where: {
            endpoint: subscriptions[0].endpoint
          }
        });
      }
      throw pushError;
    }
  } catch (error) {
    console.error('Error sending push notification:', error);
    // Check if it's a webpush error response
    if (error instanceof Error && 'statusCode' in error) {
      const statusCode = (error as any).statusCode;
      if (statusCode === 410) {
        return { success: false, error: 'Subscription expired, please resubscribe' };
      }
    }
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send notification' };
  }
}
