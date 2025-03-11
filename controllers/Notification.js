const admin = require('firebase-admin');
const webPush = require('web-push');
const Reservation = require('../model/Reservations');
const {sendEmail} = require('../controllers/email')

const VapidKey = process.env.VAPID_PUBLIC_KEY;
const VapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const notificationEmail = process.env.NOTIFICATION_EMAIL;

webPush.setVapidDetails(
    `mailto:${notificationEmail}`,
   VapidKey,
   VapidPrivateKey                 
);

const sendPushNotification = async (deviceToken, title, body) => {
    const message = {
        notification: {
            title,
            body,
        },
        token: deviceToken,
    };

    try {
        await admin.messaging().send(message);
        console.log(`Notification sent successfully to ${deviceToken}`);
        return true;
    } catch (error) {
        console.error(`Error sending notification to ${deviceToken}:`, error.message);
        return false;
    }
};

const sendWebPushNotification = async (subscription, title, body) => {
    const payload = JSON.stringify({ title, body });
  
    try {
      await webPush.sendNotification(subscription, payload);
      console.log(`Web Push notification sent.`);
    } catch (error) {
      console.error('Error sending web push notification:', error);
      return false;
    }
  };

const sendWebPushReminder = async (user, reservation) => {
    if (user.webPushSubscription) {
        const subscription = user.webPushSubscription;

        const reservationStartTime = new Date(reservation.startTime);
        const timeRemaining = Math.max(0, reservationStartTime - new Date());
        const reservationTimeFormatted = reservationStartTime.toLocaleTimeString();

        const pushTitle = 'Reservation Reminder';
        const pushBody = `Your reservation is coming up in less than 30 minutes at ${reservationTimeFormatted}.`;
    
        if (timeRemaining <= 30 * 60 * 1000 && timeRemaining > 0) { 
            try {
                const webPushSent = await sendWebPushNotification(subscription, pushTitle, pushBody);

                if (!webPushSent) {
                    console.log(`Failed to send web push notification to user ${user.email} for reservation ${reservation._id}`);
                } else {
                    console.log(`Sent web push notification to ${user.email} for reservation ${reservation._id}`);
                }
            } catch (error) {
                console.error(`Error sending web push to ${user.email} for reservation ${reservation._id}:`, error);
            }
        } else {
            console.log(`Reservation ${reservation._id} is not within the 30-minute reminder threshold.`);
        }
    } else {
        console.log(`User ${user.email} does not have a web push subscription.`);
    }
};


const sendReminderNotifications = async (user, reservation) => {
    if (!reservation || !reservation._id) {
        console.error('Reservation object is invalid or missing.');
        return; 
    }

    const email = user.email;
    const pushToken = user.deviceToken;
    const subject = '';
    const text = ``;
    const html = ``;

    try {
        await sendEmail(email, subject, text, html);
        console.log(`Sent email reminder to ${email}`);

        if (pushToken) {
            const pushTitle = '';
            const pushBody = '';
            try {
                await sendPushNotification(pushToken, pushTitle, pushBody);
                console.log(`Sent push notification to ${email}`);
            } catch (pushError) {
                console.error(`Failed to send push notification to ${email}:`, pushError);
                console.log(`Sending email as backup for push notification failure.`);
                await sendEmail(email, subject, text, html);
                console.log(`Sent email reminder to ${email} as a backup.`);
            }
        } else {
            console.log(`No push token found for user ${email}. Email sent instead.`);
        }

        const checkInUrl = ``;
        const followUpSubject = '';
        const followUpText = '';
        const followUpHtml = ``;

        await sendEmail(email, followUpSubject, followUpText, followUpHtml);
        console.log(`Sent follow-up email to ${email}`);
    } catch (emailError) {
        console.error(`Error sending email to ${email}:`, emailError);
    }
};


const handleExpiredReservations = async (Item) => {
    const placeholder = Item.placeholderId;
    const slot = placeholder.availableSlots.find(slot => slot._id?.toString() === Item.slotId?.toString());

    if (slot) {
        slot.status = true;
        await placeholder.save();
        console.log(`Slot for reservation ${Item._id} made available.`);
    }

    Item.status = 'expired';
    await Item.save();
};

let intervalID; 

const checkReservations = async () => {
    try {
        const reservations = await Reservation.find({ status: 'confirmed' })
            .populate('')
            .populate('');

        for (const reservation of reservations) {
            const now = new Date();
            const reservationStartTime = new Date(reservation.startTime);
            const reservationEndTime = new Date(reservation.endTime);
            const timeDiffToStart = reservationStartTime - now;
            const timeDiffToEnd = reservationEndTime - now;

            if (timeDiffToStart <= 30 * 60 * 1000 && timeDiffToStart > 0) {
                const user = reservation.userId;
                if (user) {
                    await sendWebPushReminder(user, reservation);
                    await sendReminderNotifications(user, reservation);
                }
            }

            if (timeDiffToEnd <= 0 && reservation.status !== 'arrived') {
                await handleExpiredReservations(reservation);
                console.log(`Stopping interval for reservation ${reservation._id}`);
                stopCheckingReservations();
            }
        }
    } catch (error) {
        console.error('Error checking reservations:', error);
    }
};

const stopCheckingReservations = () => {
    if (intervalID) {
        clearInterval(intervalID);
        intervalID = null;
        console.log('Reservation checking interval cleared.');
    }
};

intervalID = setInterval(checkReservations, 300000); 

module.exports = { sendPushNotification, stopCheckingReservations };