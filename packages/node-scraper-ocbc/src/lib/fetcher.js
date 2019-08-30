import Axios from 'axios';
import Cheerio from 'cheerio';
import moment from 'moment';
import striptags from 'striptags';

const parseDate = date => moment(date, 'DD/MM/YY').toDate();

const formatAddresses = rawAddresses => {
  let addresses = rawAddresses
    .split(/<br><br>|<br \/><br \/>/)
    .map(a => a.replace(/<br *\/>/g, ' '))
    .map(a => striptags(a))
    .map(a => a.replace(/\n/g, ' '))
    .map(a => a.replace(/\|/g, ' '))
    .map(a => a.replace(/  /g, ' '))
    .map(a => a.replace(/&#\d*;/g, ''))
    .map(a => a.replace(/S *(\d{6})/g, 'Singapore $1'))
    .map(a => a.trim())
    .filter(Boolean);

  return addresses;
};

const processEntry = entry => {
  const [
    id,
    merchant,
    promoShort,
    promoLong,
    addressRaw,
    link,
    email,
    telephoneRaw,
    terms,
    imageSmall,
    imageHero,
    dateStartRaw,
    dateEndRaw,
    preview,
    gaTag,
    gtmTag,
    category,
    promoType,
    imageLightbox,
    type,
    websiteNewTab
  ] = entry.split(',');

  if (!merchant || category !== 'dining') {
    return null;
  }

  const title = merchant.replace(/\| (.*)$/, ' ($1)');

  let telephone = striptags(telephoneRaw)
    .replace(/ /g, '')
    .match(/\d{8}/);

  telephone = telephone ? telephone[0] : null;

  const isOneForOne = promoShort.includes('1-for-1');
  const isPercentDiscount = promoShort.includes('% off');
  const isReturnVoucher = promoShort.includes('return voucher');

  const percentDiscount = isPercentDiscount
    ? promoShort.match(/(\d*) *%/)[1]
    : null;

  const returnVoucherAmt = isReturnVoucher
    ? promoShort.match(/S\$(\d+) /)[1]
    : null;

  const dateStart = parseDate(dateStartRaw);
  const dateEnd = parseDate(dateEndRaw);

  const tocDom = Cheerio.load(terms);
  const toc = tocDom('li')
    .toArray()
    .map(x => tocDom(x).text());

  const description = [striptags(promoLong), ...toc].join(' | ');

  const imgUrl = `https://www.ocbc.com/assets/images/cards_promotions_visuals/lightbox-image/${imageLightbox}`;

  const addresses = formatAddresses(addressRaw);

  return addresses.map(location => ({
    id,
    title,
    promoType,
    imgUrl,
    email: email || null,
    telephone: telephone || null,
    link,
    location,
    addressRaw,
    description,
    isOneForOne,
    isPercentDiscount,
    isReturnVoucher,
    percentDiscount,
    returnVoucherAmt,
    dateStart,
    dateEnd
  }));
};

export const scrapeOffers = async () => {
  const url = `http://ocbc.com.sg/assets/data/card-promotions.csv?${new Date().valueOf()}`;
  const { data } = await Axios.get(url);
  const entries = data.split('\r\n').splice(1);

  return entries.map(processEntry).filter(Boolean);
};

export default scrapeOffers;
