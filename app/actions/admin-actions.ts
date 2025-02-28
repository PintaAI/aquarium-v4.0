'use server'

import { currentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export async function makeUserAdmin(email: string) {
  const currentUserData = await currentUser()
  if (!currentUserData?.email) {
    throw new Error('Authentication required')
  }

  // Get full user data including role
  const admin = await prisma.user.findUnique({
    where: { email: currentUserData.email },
    select: { role: true }
  })

  if (admin?.role !== 'ADMIN' && admin?.role !== 'GURU') {
    throw new Error('Unauthorized: Only admins and gurus can perform this action')
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    })
    return { success: true, user: updatedUser }
  } catch (error) {
    console.error('Error making user admin:', error)
    return { success: false, error: 'Failed to update user' }
  }
}
