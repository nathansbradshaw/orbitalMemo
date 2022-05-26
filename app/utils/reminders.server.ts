// app/utils/reminders.server.ts
import { prisma } from "./prisma.server";
import { IReminder } from "./types.server";

export const getReminders = async (userId: string) => {
  return prisma.reminder.findMany({
    where: {
      user: {
        id: userId,
      },
    },
  });
};

export const createReminder = async (userId: string, reminder: IReminder) => {
  return prisma.reminder.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
      ...reminder,
    },
  });
};
