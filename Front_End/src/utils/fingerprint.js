import FingerprintJS from '@fingerprintjs/fingerprintjs';

const fpPromise = FingerprintJS.load();

export const getVisitorId = async () => {
  const fp = await fpPromise;
  const result = await fp.get();
  console.log('Id del visitante: ', result.visitorId );
  return result.visitorId;
};
