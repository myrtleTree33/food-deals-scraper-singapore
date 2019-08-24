# node-scraper-burpple

- A scraper that extracts restaurant data from Burpple.
- Unofficial API

## Usage

**Scrape a page**

A page consists of 12 entries each. Use
the following:

```
import BurppleScraper from 'node-scraper-burpple';

(async () => {

    const entries = await BurppleScraper.scrapePage({
        page: 1,
        priceMin: 0,
        priceMax: 90
    });

})();
```

**Scrape a single entry**

Information such as coordinates, addresses and
opening times are found in individual listings.

Use the following:

```
import BurppleScraper from 'node-scraper-burpple';

(async () => {

    const entries = await BurppleScraper.scrapeEntry({
        url: 'https://www.burpple.com/the-dark-gallery-2'
    });

})();
```
