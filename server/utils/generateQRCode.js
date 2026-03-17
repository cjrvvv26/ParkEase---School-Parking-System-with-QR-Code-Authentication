const QRCode = require('qrcode');
const cloudinary = require('./cloudinary');

const generateQR = async (data) => {
  const buffer = await QRCode.toBuffer(data, {
    width: 300,
    margin: 2,
    errorCorrectionLevel: 'H',
  });

  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: 'ParkEase/qrcodes', format: 'png' },
        (err, res) => (err ? reject(err) : resolve(res)),
      )
      .end(buffer);
  });

  return { url: result.secure_url, public_id: result.public_id };
};

module.exports = generateQR;
