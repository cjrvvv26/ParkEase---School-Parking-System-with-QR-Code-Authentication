const QRCode = require("qrcode");
const bcrypt = require("bcrypt");

const generateQR = async (data) => {
  try {
    const qrCode = await QRCode.toDataURL(data);
    return await bcrypt.hash(qrCode, 10);
  } catch (err) {
    console.error(err);
  }
};

module.exports = generateQR;
