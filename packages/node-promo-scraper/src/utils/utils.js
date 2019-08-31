import crypto from 'crypto';

const enableCors = app => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
};

export const md5 = str =>
  crypto
    .createHash('md5')
    .update(str)
    .digest('hex');

export default enableCors;
