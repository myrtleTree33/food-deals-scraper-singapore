import logger from '../logger';

import scrapeBurppleScheduled from './burppleScraper';
import scrapeChopeScheduled from './chopeScraper';
import scrapeAmexScheduled from './amexScraper';
import scrapeCitiScheduled from './citiScraper';
import scrapeOcbcScheduled from './ocbcScraper';
import scrapeDbsScheduled from './dbsScraper';

const startScraping = () => {
  logger.info('== Starting scrapers ==');
  // scrapeBurppleScheduled('1 1 */1 * *');
  // scrapeCitiScheduled('1 1 */1 * *');
  // scrapeChopeScheduled('1 2 */1 * *');
  // scrapeAmexScheduled('1 2 */1 * *');
  // scrapeOcbcScheduled('1 2 */1 * *');
  scrapeDbsScheduled('30 2 */1 * *');
};

export default startScraping;
