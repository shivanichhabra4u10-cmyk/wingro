const store = {};
exports.setOTP = (phone, otp) => {
  store[phone] = otp;
  setTimeout(() => delete store[phone], 300000); // 5 min expiry
};
exports.getOTP = (phone) => store[phone];
