"use server"
import { Language } from "@prisma/client"
import { db } from "./db"
import { cache } from "react"
import { auth } from "@clerk/nextjs"
import { mostRecentLang } from "./mostRecentLang"
import { start } from "repl"
import { getProfileProgress } from "./profiles"

export const decreaseHearts = async () => {
  const { userId } = auth()
  if (!userId) return
  const profile = await db.profile.findFirst({
    where: {
      user: {
        userId,
      },
      language: await mostRecentLang(),
    },
  })
  if (!profile) return
  await db.profile.update({
    where: {
      id: profile.id,
    },
    data: {
      hearts: Math.max(profile.hearts - 1, 0),
    },
  })
}

export const queryChallengeSession = async () => {
  const { userId } = auth()
  if (!userId) return
  const profile = await db.profile.findFirst({
    where: {
      user: {
        userId,
      },
      language: await mostRecentLang(),
    },
  })
  if (!profile) return
  const challengeSession = {
    hearts: profile?.hearts,
    language: profile?.language,
    startedAt: profile?.startedAt,
    progress: profile?.challengeProgress,
    timeLimit: await queryChallengeTime(),
  }

  if (
    challengeSession.startedAt.getTime() +
      (challengeSession.timeLimit || 0) * 1000 <
    Date.now()
  ) {
    // expired: reset session
    await db.profile.update({
      where: {
        id: profile.id,
      },
      data: {
        challengeProgress: 0,
        startedAt: new Date(),
        hearts: 5,
      },
    })

    challengeSession.hearts = 5
    challengeSession.startedAt = new Date()
    challengeSession.progress = 0
  }

  return challengeSession
}

export const queryChallengeTime = async () => {
  const { userId } = auth()
  if (!userId) return
  const mostRecentLanguage = await mostRecentLang()
  const profile = await db.profile.findFirst({
    where: {
      user: {
        userId,
      },
      language: mostRecentLanguage,
    },
  })
  if (!profile) return
  const activeLesson = Math.floor(profile.progress / 5)
  const activeUnit = profile.progress % 5

  return (
    await db.lesson.findFirst({
      where: {
        course: {
          language: mostRecentLanguage,
        },
        index: activeLesson,
      },
      include: {
        units: {
          orderBy: {
            index: "asc",
          },
        },
      },
    })
  )?.units[activeUnit].timeLimit
}

export const checkSolution = async (solution: String) => {
  const { userId } = auth()
  if (!userId) return
  const mostRecentLanguage = await mostRecentLang()
  const profile = await db.profile.findFirst({
    where: {
      user: {
        userId,
      },
      language: mostRecentLanguage,
    },
  })
  if (!profile) return
  const activeLesson = Math.floor(profile.progress / 5)
  const activeUnit = profile.progress % 5
  const lesson = await db.lesson.findFirst({
    where: {
      course: {
        language: mostRecentLanguage,
      },
      index: activeLesson,
    },
    include: {
      units: {
        include: {
          tasks: true,
        },
      },
    },
  })
  if (!lesson) return
  const unit = lesson.units[activeUnit]
  const task = unit.tasks[profile.challengeProgress]
  const right = task.solution === solution
  if (right) {
    await db.profile.update({
      where: {
        id: profile.id,
      },
      data: {
        progress: profile.progress + 1,
      },
    })
  } else {
    await decreaseHearts()
  }

  return {
    right,
  }
}
