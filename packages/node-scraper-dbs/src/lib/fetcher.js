import Axios from 'axios';
import convert from 'xml-js';
import moment from 'moment';
import Cheerio from 'cheerio';
import extractDate from 'extract-date';
import striptags from 'striptags';
import _ from 'lodash';

const processPage = async url => {
  const res = await Axios.get(
    `https://www.dbs.com.sg/personal/promotion/${url}`
  );

  const $ = Cheerio.load(res.data);

  let entries = $(
    '#bodywrapper > div.container.mTop-0 > section > div > div.col-md-8.col-sm-8 > div.rich-text-box'
  ).html();

  entries = entries.replace(/<br><br>/g, '\n\n').split('\n\n');

  const title = Cheerio.load(entries[0])('strong').text();

  let promos = entries[0].split('&#x2022; ').splice(1);
  if (!promos.length) {
    promos = entries[1].split('&#x2022; ');
  }
  promos = promos.map(p => p.replace(/<br>/g, '')).filter(Boolean);

  const dates = entries
    .map(extractDate)
    .flatten()
    .map(a => a.date);

  const endDate = _.last(dates);

  const details = striptags(_.last(entries));

  console.log(details);

  // TODO get date here------------

  return {
    title,
    promos,
    endDate
  };
};

const processEntry = async entry => {
  const {
    DBS_Title: title,
    DBS_SubTitle: promoType,
    DBS_Expiration_date: dateEndRaw,
    DBS_FriendlyURL: url,
    DBS_SquareImagePath: imgUrl,
    DBS_Tel_no: telephone
  } = entry;

  const dateEnd = moment(dateEndRaw, 'YYYY-MM-DD HH:mm:ss').toDate();

  const pageInfo = await processPage(url);

  return {
    // title,
    // promoType,
    // dateEnd,
    // imgUrl,
    // telephone,
    ...pageInfo
  };
};

export const scrapeOffers = async (
  opts = {
    page: 1
  }
) => {
  const { page } = opts;

  const url = `https://www.dbs.com.sg/personal/cards/offers/default/1489849577564.ajax?cardParam=all&firstLevelBenefit=jeluqztv&secondLevelBenefitParam=all&thirdLevelBenefitParam=all&loadMore=true&start=${page}&_=1566999239017`;
  const res = await Axios.get(url);
  const parsedXml = convert.xml2js(res.data);
  const entries = JSON.parse(
    parsedXml.elements[0].elements[0].elements[2].elements[0].elements[1]
      .elements[19].elements[0].text
  );

  const results = entries.map(processEntry);

  return Promise.all(results);
};

// TODO scrape page for
// https://www.dbs.com.sg/personal/promotion/thediningroom0508

export const scrapeEntry = async (opts = { url: undefined }) => {};
