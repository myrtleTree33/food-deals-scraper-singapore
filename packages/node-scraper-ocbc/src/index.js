import util from 'util';

import scrapeOffers from './lib/fetcher';

(async () => {
  const results = await scrapeOffers();
  // console.dir(results);
  console.log(util.inspect(results, false, null, true /* enable colors */));
  // results.map(r => console.log(JSON.stringify(r)));
  console.log(results.length);
})();

const OcbcScraper = { scrapeOffers };

export default OcbcScraper;
