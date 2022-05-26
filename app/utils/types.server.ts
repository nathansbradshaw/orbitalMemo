// app/utils/types.server.ts
export type RegisterForm = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type LoginForm = {
  email: string;
  password: string;
};

export type IReminder = {
  title: string;
  description: string;
  dueDate: Date;
  sendReminderAt: Date;
  repeatFreq?: number;
  completed?: boolean;
  pastCompletedDate?: Date[];
  priority?: number;
};
