import crypto from 'crypto';

import { CronJob } from 'cron';
import OcbcParser from 'node-scraper-ocbc';

import logger from '../logger';
import asyncWorker from '../utils/asyncWorker';
import OcbcOutlet from '../models/OcbcOutlet';
import getLngLat from '../utils/locUtils';

const createHash = data =>
  crypto
    .createHash('md5')
    .update(data)
    .digest('hex');

const scrapePageWorker = asyncWorker({
  initialState: {
    numEntries: undefined
  },
  maxTimeout: 1000,
  onTriggered: async (prevState = {}) => {
    try {
      // Fill in page scraper code here
      const entries = await OcbcParser.scrapeOffers();

      logger.info(`[Ocbc] Scraping Ocbc offers..`);

      // Map entries to DB here
      const outletPromises = entries.map(async entry => {
        const {
          title,
          promoType,
          imgUrl,
          email,
          telephone,
          link,
          location: address,
          description,
          isOneForOne,
          isPercentDiscount,
          isReturnVoucher,
          percentDiscount,
          returnVoucherAmt,
          dateStart,
          dateEnd
        } = entry;

        if (!title) {
          console.log('-------------------');
          console.log('-------------------');
          console.log('-------------------');
        }

        const outletId = createHash(title);
        const resolvedLoc = await getLngLat(address);

        if (!resolvedLoc) {
          console.log(link);
          return Promise.resolve();
        }

        return OcbcOutlet.update(
          { outletId },
          {
            outletId,
            title,
            description,
            address,
            telephone,
            promoType,
            email,
            isOneForOne,
            isPercentDiscount,
            isReturnVoucher,
            percentDiscount,
            returnVoucherAmt,
            dateStart,
            dateEnd,
            link,
            imgUrls: [imgUrl],
            location: {
              type: 'Point',
              coordinates: resolvedLoc
            }
          },
          {
            setDefaultsOnInsert: true,
            upsert: true,
            new: true
          }
        );
      });

      await Promise.all(outletPromises);

      return { ...prevState, numEntries: entries.length };
    } catch (e) {
      logger.error(e.message);
      logger.error(
        '[Ocbc] During page scraping, encountered an exception.  Routine will now terminate.'
      );
    }
  },
  toProceed: async (prevState = {}) => {
    logger.info('[Ocbc] Done scraping Ocbc offers.');
    return false;
  }
});

const scrapeSite = () => {
  logger.info('[Ocbc] Started scraping..');
  scrapePageWorker();
};

const scrapeOcbcScheduled = interval => {
  const job = new CronJob(interval, () => scrapeSite(), null, true, 'America/Los_Angeles');
  job.start();
  logger.info('[Ocbc] Scheduled scraping.');

  scrapeSite();
};

export default scrapeOcbcScheduled;
