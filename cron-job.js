const { PrismaClient } = require("@prisma/client");
let prisma = new PrismaClient();
const cron = require("node-cron");
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER, // if `host` is present, it will override the `cluster` option.
  // a base64 string which encodes 32 bytes, used to derive the per-channel encryption keys (see below!)
});
// Schedule tasks to be run on the server.
cron.schedule("* * * * *", async function () {
  console.log("running a task every minute");
  await prisma.$connect();

  //TODO get all the reminders
  const reminders = await getAllPastDueReminders();
  console.log("reminders", reminders);

  //TODO batch send the reminders
  reminders.map((reminder) => {
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
    //TODO reset reoccuring reminders
  });
});

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
    },
  });
};

// export {};
