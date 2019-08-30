import Axios from 'axios';
import Cheerio from 'cheerio';

const processResult = ($, elem) => {
  let title = $('div > h2', elem).text();
  title = title.replace(/ \(Privileges apply to Amex menu only\)/g, '');
  title = title.replace(/ \(Privileges Apply To Buffets Only\)/g, '');
  title = title.replace(/ \(Privileges Apply To Buffet Only\)/g, '');

  const address = $('ul > ul > li.map-marker', elem)
    .text()
    .trim();

  const telephone = $('ul > ul > li.call > p', elem)
    .text()
    .trim()
    .replace(/\s+/g, '');

  const website = $('ul > ul > li.site > a', elem).attr('href');

  let imgUrl = $('div > div', elem).html();

  if (imgUrl) {
    const matches = imgUrl.match(/background:url\(&apos;(.*)&apos;\)/);
    if (matches.length > 1) {
      imgUrl = matches[1];
    }
  }

  return {
    title,
    address,
    telephone,
    website,
    imgUrl,
    offers: [
      { minGuest: 1, maxGuest: 1, discount: 15 },
      { minGuest: 2, maxGuest: 2, discount: 50 },
      { minGuest: 3, maxGuest: 3, discount: 35 },
      { minGuest: 4, maxGuest: 4, discount: 25 },
      { minGuest: 5, maxGuest: 19, discount: 20 }
    ]
  };
};

export const scrapeOffers = async (
  opts = {
    page: 1,
    query: null,
    priceMin: 0,
    priceMax: 100
  }
) => {
  const { page } = opts;

  const url = `https://lovedining.americanexpress.com.sg/restaurants/`;
  const res = await Axios.get(url);
  const $ = Cheerio.load(res.data);

  const results = $('#restaurantListings > div')
    .map((i, elem) => processResult($, elem))
    .get();

  results.pop(); // remove last element (empty)

  return results;
};

export const scrapeEntry = async (opts = { url: undefined }) => {
  const { url } = opts;
  const res = await Axios.get(url);
  const $ = Cheerio.load(res.data);
};
