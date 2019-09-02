import Axios from 'axios';
import Cheerio from 'cheerio';
import moment from 'moment';
import striptags from 'striptags';
import _ from 'lodash';

const parseOutlet = outlet => {
  const { title, category, description } = outlet;

  const category2 = category.includes('entertainer')
    ? 'entertainer'
    : category.includes('dining')
    ? 'dining'
    : category;

  const isPercentOff = /(.*)% off/.test(description);
  const percentOff = hasPercentOff
    ? description.match(/(.*)% off/)[1]
    : undefined;

  const dinesFreeRegex = /(\d+) Dines free with (\d+) paying/;
  const isDinesFree = dinesFreeRegex.test(description);
  const [, dinesFreeNum, dinesFreeMinNum] = description.match(dinesFreeRegex);

  return {
    title,
    details: description,
    isPercentOff,
    percentOff,
    isDinesFree,
    dinesFreeNum,
    dinesFreeMinNum
  };
};

export const scrapeOffers = async () => {
  const url = 'https://cardpromotions.hsbc.com.sg/dining';
  const { data } = await Axios.get(url);
  const $ = Cheerio.load(data);

  console.log('--------------');

  const scriptText = $('#bodycontent > script:nth-child(6)')
    .get()[0]
    .children[0].data.replace(/var outletJson= /, '')
    .slice(0, -1);
  const outlets = JSON.parse(scriptText);
  console.log(Object.keys(outlets));
  // .map(o => parseOutlet(o));
  // console.log(outlets);
  // console.log(scriptText);

  return [];
};

export default scrapeOffers;
