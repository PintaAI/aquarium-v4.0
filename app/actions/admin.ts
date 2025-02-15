'use server'

import { currentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function makeUserAdmin(email: string) {
  const user = await currentUser()
  if (!user?.email) {
    throw new Error('Authentication required')
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { isAdmin: true }
    })
    return { success: true, user: updatedUser }
  } catch (error) {
    console.error('Error making user admin:', error)
    return { success: false, error: 'Failed to update user' }
  }
}
