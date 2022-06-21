// app/utils/reminders.server.ts
import { prisma } from "./prisma.server";
import { IReminder } from "./types.server";

export const getReminders = async (userId: string) => {
  return prisma.reminder.findMany({
    orderBy: [
      {
        dueDate: "asc",
      },
      {
        priority: "desc",
      },
    ],
    where: {
      user: {
        id: userId,
      },
    },
  });
};

export const getReminderById = async (reminderId: string) => {
  return prisma.reminder.findUnique({
    where: {
      id: reminderId,
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

export const getPastDueReminders = async (userId: string) => {
  return prisma.reminder.findMany({
    orderBy: [
      {
        dueDate: "asc",
      },
      {
        priority: "desc",
      },
    ],
    where: {
      user: {
        id: userId,
      },
      completed: false,
      dueDate: {
        lt: new Date(),
      },
    },
  });
};

export const getUncompletedReminders = async (userId: string) => {
  return prisma.reminder.findMany({
    orderBy: [
      {
        dueDate: "asc",
      },
      {
        priority: "desc",
      },
    ],
    where: {
      user: {
        id: userId,
      },
      completed: false,
    },
  });
};

//get next reminder time
export const getNextReminderTime = async (userId: string) => {
  return prisma.reminder.findMany({
    where: {
      user: {
        id: userId,
      },
      completed: false,
      sendReminderAt: {
        gt: new Date(),
      },
    },
  });
};

export const deleteReminderById = async (reminderId: string) => {
  return prisma.reminder.delete({
    where: {
      id: reminderId,
    },
  });
};

export const updateReminder = async (reminder: IReminder) => {
  return prisma.reminder.update({
    where: {
      id: reminder.id,
    },
    data: {
      title: reminder.title,
      description: reminder.description,
      dueDate: reminder.dueDate,
      sendReminderAt: reminder.sendReminderAt,
      repeatFreq: reminder.repeatFreq,
      completed: reminder.completed,
      pastCompletedDate: reminder.pastCompletedDate,
      priority: reminder.priority,
    },
  });
};
