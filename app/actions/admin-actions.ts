'use server'

import { currentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRoles } from "@prisma/client"

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

  if (admin?.role !== UserRoles.ADMIN) {
    throw new Error('Unauthorized: Only admins can perform this action')
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: UserRoles.ADMIN }
    })
    return { success: true, user: updatedUser }
  } catch (error) {
    console.error('Error making user admin:', error)
    return { success: false, error: 'Failed to update user' }
  }
}
