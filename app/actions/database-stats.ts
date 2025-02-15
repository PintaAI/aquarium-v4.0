'use server'

import { prisma } from '@/lib/prisma'

import { UserRoles, UserPlan, CourseLevel } from '@prisma/client'

export interface DatabaseStats {
  counts: {
    users: number
    courses: number
    modules: number
    articles: number
    testimonials: number
    vocabularyCollections: number
    vocabularyItems: number
  }
  distribution: {
    usersByRole: Array<{ role: UserRoles; _count: number }>
    coursesByLevel: Array<{ level: CourseLevel; _count: number }>
    usersByPlan: Array<{ plan: UserPlan; _count: number }>
  }
}

export type DatabaseStatsResponse = {
  success: true
  stats: DatabaseStats
} | {
  success: false
  error: string
}

export async function getDatabaseStats(): Promise<DatabaseStatsResponse> {
  try {
    const [
      userCount,
      courseCount,
      moduleCount,
      articleCount,
      testimonialCount,
      vocabularyCollectionCount,
      vocabularyItemCount
    ] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.module.count(),
      prisma.article.count(),
      prisma.testimonial.count(),
      prisma.vocabularyCollection.count(),
      prisma.vocabularyItem.count(),
    ])

    // Get user stats by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: true,
    })

    // Get course stats by level
    const coursesByLevel = await prisma.course.groupBy({
      by: ['level'],
      _count: true,
    })

    // Get user stats by plan
    const usersByPlan = await prisma.user.groupBy({
      by: ['plan'],
      _count: true,
    })

    return {
      success: true,
      stats: {
        counts: {
          users: userCount,
          courses: courseCount,
          modules: moduleCount,
          articles: articleCount,
          testimonials: testimonialCount,
          vocabularyCollections: vocabularyCollectionCount,
          vocabularyItems: vocabularyItemCount,
        },
        distribution: {
          usersByRole,
          coursesByLevel,
          usersByPlan,
        }
      }
    }
  } catch (error) {
    console.error('Failed to get database stats:', error)
    return {
      success: false,
      error: 'Failed to fetch database statistics'
    }
  }
}
