const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  monthly: {
    type: Number,
  },
  yearly: {
    type: Number,
  },
  id: {
    type: Number,
  },
});

const Payment = new mongoose.model("Payment", paymentSchema);

module.exports = Payment;
