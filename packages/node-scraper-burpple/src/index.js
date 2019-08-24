import { scrapePage, scrapeEntry } from './lib/fetcher';

const BurppleScraper = { scrapePage, scrapeEntry };

export default BurppleScraper;

// export default function app() {

// (async () => {
//   const result = await scrapePage({
//     page: 1,
//     priceMin: 0,
//     priceMax: 90
//   });

//   //     const result = await scrapeBurppleSingle({
//   //       url: 'https://www.burpple.com/the-dark-gallery-2'
//   //     });

//   console.log(result);
// })();

// }

// if (require.main === module) {
//   app();
// }
