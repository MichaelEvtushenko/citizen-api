const {CronJob} = require('cron');
const {deleteWasteAlerts} = require('../api/services/alert.service');

// Job runs at midnight
new CronJob('00 00 00 * * *', () => deleteWasteAlerts()
    .catch(err => console.error('Error occurred while deleting waste alerts:', err)))
    .start();
