import sleep from 'await-sleep';
import DbsParser from 'node-scraper-dbs';

import { CronJob } from 'cron';

import logger from '../logger';
import asyncWorker from '../utils/asyncWorker';
import DbsOutlet from '../models/DbsOutlet';
import getLngLat from '../utils/locUtils';

import { md5 } from '../utils/utils';

const scrapePageWorker = asyncWorker({
  initialState: {
    numEntries: undefined,
    page: 1
  },
  maxTimeout: 10000,
  onTriggered: async (prevState = {}) => {
    const { page } = prevState;

    try {
      // Fill in page scraper code here
      const entries = await DbsParser.scrapeOffers({
        page
      });

      // if (page % 5 === 0) {
      logger.info(`[Dbs] Scraping page ${page}..`);
      // }

      // Map entries to DB here
      const outletPromises = entries.map(async entry => {
        const {
          title,
          promoType,
          imgUrl,
          telephone,
          address,
          promo: details,
          link,
          dateEnd: dateExpiry,
          isOneForOne,
          tos
        } = entry;

        // If dead link, skip
        if (!address) {
          return Promise.resolve({});
        }

        const resolvedLoc = await getLngLat(address);
        const outletId = md5(title + promoType);
        const imgUrls = [imgUrl];

        return DbsOutlet.update(
          { outletId },
          {
            title,
            link,
            outletId,
            address,
            imgUrls,
            location: {
              type: 'Point',
              coordinates: resolvedLoc
            },
            telephone,
            details,
            isOneForOne,
            dateExpiry,
            tos
          },
          {
            setDefaultsOnInsert: true,
            upsert: true,
            new: true
          }
        );
      });

      await Promise.all(outletPromises);

      return { ...prevState, page: page + 1, numEntries: entries.length };
    } catch (e) {
      logger.error(
        '[Dbs] During page scraping, encountered an exception.  Routine will now terminate.'
      );
      logger.error(e.message);
    }
  },
  toProceed: async (prevState = {}) => {
    const { numEntries } = prevState;
    const toContinue = numEntries > 0;
    if (!toContinue) {
      logger.info('[Dbs] Done scraping DBS offers.');
    }
    return toContinue;
  }
});

const scrapeSite = () => {
  logger.info('[Dbs] Started Citi scraping..');
  scrapePageWorker();
};

const scrapeDbsScheduled = interval => {
  const job = new CronJob(interval, () => scrapeSite(), null, true, 'Asia/Singapore');
  job.start();
  logger.info('[Dbs] Scheduled Dbs scraping.');

  scrapeSite();
};

export default scrapeDbsScheduled;
