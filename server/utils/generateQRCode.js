const QRCode = require('qrcode');

const generateQR = async (data) => {
  try {
    const qrCode = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      errorCorrectionLevel: 'H',
    });
    return qrCode;
  } catch (err) {
    console.error(err);
  }
};

module.exports = generateQR;
