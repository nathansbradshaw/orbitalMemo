const { PrismaClient } = require("@prisma/client");
let prisma = new PrismaClient();
// const cron = require("node-cron");
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER, // if `host` is present, it will override the `cluster` option.
  // a base64 string which encodes 32 bytes, used to derive the per-channel encryption keys (see below!)
});
// Schedule tasks to be run on the server.
const job = async () => {
  console.log("running a task every minute");
  await prisma.$connect();

  //TODO get all the reminders
  const reminders = await getAllPastDueReminders();
  console.log("reminders", reminders);
  //TODO send the reminders to the pusher
  //TODO batch send the reminders
  reminders.map(async (reminder) => {
    console.log("over due", reminder);
    pusher.trigger(`reminder-${reminder.userId}`, "overdue", {
      reminder,
    });
    //
    //get user
    // prisma.user
    //   .findUnique({
    //     where: { id: reminder.userId },
    //   })
    //   .then((user) => {
    //     //send email
    //     sendEmail(user.email, reminder.title, reminder.description);
    //   });

    // delay the reminder
    //TODO send reminder to user
    //TODO update reminder to past due
    switch (reminder.priority) {
      case 0: // none
        await updateReminderSendTime(reminder, 60);
        break;
      case 1: // low
        await updateReminderSendTime(reminder, 30);
        break;
      case 5: // medium
        await updateReminderSendTime(reminder, 15);
        break;
      case 10: // high
        await updateReminderSendTime(reminder, 1);
        break;
      default:
        await updateReminderSendTime(reminder, 60);
        break;
    }
    // await updateReminderSendTime(reminder, 1);
    //TODO reset reoccuring reminders
  });
};

// TODO set up reminders schema
// TODO set up reminders model
// export {};
const getAllReminders = async () => {
  console.log("get all reminders");
  return prisma.reminder.findMany().catch((err) => {
    console.log("error", err);
  });
};

//Get all past due reminders
const getAllPastDueReminders = async () => {
  console.log("get all reminders");
  return prisma.reminder.findMany({
    where: {
      sendReminderAt: {
        lt: new Date(),
      },
      AND: {
        completed: false,
      },
    },
  });
};

// update reminder to send reminder again in 1 minute
const updateReminderSendTime = async (reminder, time) => {
  console.log("update reminder");
  return prisma.reminder.update({
    where: { id: reminder.id },
    data: {
      // TODO update 999 tp 1000
      sendReminderAt: new Date(Date.now() + time * 60 * 999),
    },
  });
};

// export {};
job();
