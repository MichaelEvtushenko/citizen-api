const {CronJob} = require('cron');
const {removeExpiredLinks} = require('../api/services/auth-link.service');

// Job runs at midnight
new CronJob('00 00 00 * * *', removeExpiredLinks).start();
