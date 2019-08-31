import Axios from 'axios';
import Cheerio from 'cheerio';
import moment from 'moment';
import striptags from 'striptags';
import _ from 'lodash';

const parseDate = date => moment(date, 'DD/MM/YY').toDate();

const formatAddresses = (link, rawAddresses) => {
  if (link.includes('rwsentosa.com/en/restaurants/tangerine')) {
    return ['18 Sentosa Gateway, ESPA, #01-563 & 564, Singapore 098134'];
  } else if (link.includes('www.indochili.com')) {
    return [
      '54 Zion Road. Singapore 247779',
      '7 Wallich Street #B1-03. Singapore 078884',
      '2 Science Park Drive #01-09. Singapore 118222'
    ];
  } else if (link.includes('www.rwsentosa.com/en/restaurants/forest')) {
    return [
      '16 Sentosa Gateway Equarius Hotel Lobby, #01-521 & 522, Singapore 098133'
    ];
  } else if (link.includes('www.starkergroup.com')) {
    return [
      '1 Jalan Rajah #01-02, Singapore 329133',
      '4 Hill View Rise #01-02, Singapore 667979',
      '88 East Coast Road #01-15/16, Singapore 423371',
      '85 Punggol Central #01-01, Singapore 828726',
      '50 Jurong Gateway Road #01-05, Singapore 608549'
    ];
  } else if (link.includes('www.manhattanfishmarket.com')) {
    return [
      '1 Woodlands Square, Causeway Point #02-34/K1, Singapore 738099',
      '5 Changi Business Central Park 1, Changi City Point #01-39/40, Singapore 486038',
      '90 Hougang Avenue 10, Hougang Mall #04-10/10A Singapore 538766',
      '2 Jurong East Central 1, JCube #04-10/21, Singapore 609731',
      '6 Raffles Boulevard, Marina Square #02-183, Singapore 039594',
      '930 Yishun Avenue 2 Northpoint #02-08 Singapore 769098',
      '68 Orchard Road, Plaza Singapura #06-07, Singapore 238839',
      '3 Temasek Boulevard, Suntec City Mall #B1-134, Singapore 038983'
    ];
  } else if (link.includes('themarmaladepantry.com.sg')) {
    return [
      '#04-11a, ION Orchard 2 Orchard Turn, Singapore 238801',
      '#01-01, Oasia Hotel Downtown 100 Peck Seah Street, Singapore 079333',
      '#01-02/04, Oasia Hotel Novena 8 Sinaran Drive, Singapore 307470',
      '01-02, SBF Centre 160 Robinson Road, Singapore 068914'
    ];
  } else if (link.includes('indoboxcafe.com.sg')) {
    return ['2 Orchard Turn #B3-24 Singapore 238801'];
  } else if (link.includes('www.timhowan.com/country/singapore')) {
    return [
      '3 Temasek Boulevar #02-389/390, Suntec City Mall, Singapore 038983',
      '83 Punggol Central, #01-62, Waterway Point, Singapore 828761',
      '78 Airport Boulevard, #02-223 Jewel Changi Airport',
      '1 Kim Seng Promenade, Great World City #01-139 Singapore 237994',
      '63 Jurong West Central 3, Jurong Point Shopping Centre, Singapore 648331',
      '18 Tai Seng Street #01-36-39, Singapore 539775',
      '9 Scotts Road #02-10/11/12/13, Singapore 228210',
      '112 East Coast Road #01-04, Singapore 428802',
      'One Raffles Link #B1-63/63A, Citylink Mall, Singapore 039393',
      '12 Kallang Avenue Lavender #01-01/02/03 Aperia Singapore 339511'
    ];
  } else if (
    link.includes('swensens.com.sg') &&
    !link.includes('earleswensens')
  ) {
    return [
      '53 Ang Mo Kio Ave 3, #B1-25/26',
      '311 New Upper Changi Road #01-77',
      '200 Victoria Street #01-68, Bugis Junction',
      '1 Jelebu Road, #03-04, Bukit Panjang Plaza',
      '1 Woodlands Square, #02-08/09',
      'Mezzanine Level, Arrival Hall North, Changi Airport Terminal 2',
      '180 Kitchener Road, #03-37/38, City Square Mall',
      '3155 Commonwealth Ave West,',
      '1 Sengkang Square, #B1-16, Compass One',
      '1 Pasir Ris Close #02-121 E!hub@Downtown East',
      '2 Jurong East St 21, #01-111, IMM',
      '78 Airport Boulevard, #03-219, Jewel Changi Airport',
      '9 Bishan Place #01-39, Junction 8',
      '63 Jurong West Central 3, #B1-64, Jurong Point',
      '23 Serangoon Central, Nex Mall, Singapore 556083',
      '930 Yishun Avenue 2 #02-14, North Point',
      '80 Marine Parade Road #B1-33/34, Parkway Parade',
      'Orchard Road #03-23, Plaza Singapura',
      '#02-136/137 SingPost Centre 10 Eunos Road 8',
      '30 Sembawang Drive, #02-21/22',
      '4 Tampines Central 5, #03-30, Tampines Mall',
      '33 Sengkang West Avenue #02-11/12, The Seletar Mall',
      '301 Upper Thomson Road #03-23, Thomson Plaza',
      '1 HarbourFront Walk, VivoCity, Singapore 098585',
      '83 Punggol Central #02-35, Waterway Point Singapore 828761',
      '1 Bukit Batok Central Link #02-05, West Mall'
    ];
  } else if (link.includes('seoulgardenhotpot.com.sg')) {
    return [
      '311 New Upper Changi Rd #B1-51 Singapore 467360',
      '5 Changi Business Park Central 1 #01-18/19 Changi City Point Singapore 486038',
      '1 Maritime Square #02-03/04 HarbourFront Centre Singapore 099253',
      '2 Jurong East Street 21 #01-112 Singapore 609601',
      '63 Jurong West Central 3 JP2 #B1-46 Singapore 648331',
      '930 Yishun Ave 2 #03-06 Singapore 769098'
    ];
  } else if (link.includes('hutong.com.sg')) {
    return ['3D River Valley Road #01-07 Singapore 179023'];
  } else if (link.includes('honguo.com.sg')) {
    return [
      '200, Victoria Street #B1-06 Singapore 188021',
      '23 Serangoon Central #B1-75 Singapore 556083'
    ];
  } else if (link.includes('thedailycut.sg')) {
    return [
      '1 Raffles Place #B1-31 One Raffles Place Singapore 048616',
      '7 Wallich Street #B2-16 Tanjong Pagar Centre Singapore 78884',
      '5 Straits View #B1-41/42 The Heart Singapore 018935'
    ];
  } else if (link.includes('www.sopho.com.sg')) {
    return [
      '50 Jurong Gateway Road #03-22 Singapore 608549',
      '4 Tampines Central 5 #04-30 Singapore 529510',
      '290 Orchard Road #B1-20 Singapore 238859',
      '238 Thomson Road #02-43/45 Singapore 307683',
      '80 Marine Parade Road #03-30D Singapore 449269',
      '23 Serangoon Central #B1-15 Singapore 556083',
      '83 Punggol Central #01-28 Singapore 828761',
      '3155 Commonwealth Ave West #04-34 & 04-K3/K4 Singapore 129588',
      '1 HarbourFront Walk #01-171 Singapore 098585',
      '1 Woodlands Square #B1-16 Singapore 738099',
      '1 Northpoint Drive #B1-182/183 Singapore 768019',
      '5 Straits View, #B2-50 Singapore 018935',
      '1 Vista Exchange Green #B1-11',
      '1 Pasir Ris Central Street 3 #02-04 White Sands Singapore 518457',
      '2 Orchard Turn #B3-19 ION Singapore 238801',
      '65 Airport Boulevard #03-30/31, Changi Airport Terminal 3 Singapore 819663',
      '2 Jurong East St 21 #02-53 Singapore 609601',
      '78 Airport Boulevard #B1-248 Singapore 819666',
      '1 Kim Seng Promenade #B1-112 Singapore 237994',
      '3 Temasek Boulevard #B1-126 Singapore 038983'
    ];
  } else if (link.includes('haixianlao')) {
    return [
      '350 Orchard Road Level 4 Isetan Shaw House Singapore 238868',
      '8 Wilkie Road #01-21, Wilkie Edge Singapore 228095'
    ];
  } else if (link.includes('fratelli-pizzeria')) {
    return ['26 Sentosa Gateway, #02-144 Hotel Michael, Singapore 098138'];
  } else if (link.includes('rwsentosa.com/en/restaurants/sessions')) {
    return [
      '26 Sentosa Gateway, Resorts World Sentosa, The Forum #01-209, 098138'
    ];
  } else if (link.includes('deandeluca.com.sg')) {
    return [
      '47 Pekin Street #01-01 Singapore 048777',
      '4 Hillview Rise #01-01 Singapore 667979'
    ];
  } else if (link.includes('earleswensens.com.sg')) {
    return [
      '78 Airport Boulevard, #03-219, Jewel Changi Airport Singapore 819663',
      '1 HarbourFront Walk, #02-117, VivoCity Singapore 098585'
    ];
  } else if (link.includes('')) {
    return [];
  }

  let addresses = rawAddresses
    .split(/<br><br>|<br \/><br \/>/)
    .map(a => a.replace(/<br *\/>/g, ' '))
    .map(a => striptags(a))
    .map(a => a.replace(/\n/g, ' '))
    .map(a => a.replace(/\|/g, ' '))
    .map(a => a.replace(/&#\d*;/g, ''))
    .map(a => a.replace(/S *(\d{6})/g, 'Singapore $1'))
    .map(a => a.replace(/Singapore/g, ' Singapore'))
    .map(a => a.replace(/  /g, ' '))
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
    return [];
  }

  const title = merchant.replace(/\| (.*)$/, ' ($1)');

  if (!title) {
    console.log(merchant);
  }

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

  const addresses = formatAddresses(link, addressRaw);

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

  return _.flatMap(entries.map(processEntry));
};

export default scrapeOffers;
