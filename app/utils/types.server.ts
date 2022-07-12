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

export type IContact = {
  email?: string;
  phone?: string;
};

export type IReminder = {
  id?: string;
  userId?: string;
  title: string;
  description: string;
  dueDate: Date;
  sendReminderAt: Date;
  repeatFreq?: number;
  completed?: boolean;
  pastCompletedDate?: Date[];
  priority?: number;
  contact?: string[];
  pulse?: boolean;
};
