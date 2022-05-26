const { PrismaClient } = require("@prisma/client");
let prisma = new PrismaClient();
const cron = require("node-cron");
// Schedule tasks to be run on the server.
cron.schedule("* * * * *", async function () {
  console.log("running a task every minute");
  await prisma.$connect();

  //TODO get all the reminders
  const reminders = await getAllReminders();
  console.log("reminders", reminders);
  //TODO look for past due reminders
  const pastDueReminders = reminders.filter((reminder) => {
    return reminder.sendReminderAt < new Date();
  });
  console.log("pastDueReminders", pastDueReminders);
  pastDueReminders.map((reminder) => {
    console.log("over due", reminder);
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
// export {};
