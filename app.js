const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const formidable = require("formidable");
const mongoose = require("mongoose");
const stripe = require("stripe")("sk_live_5r6Fu8m91qo2dHsfLO6JZVLj00xe5Pa9eB", {
  apiVersion: "",
});

const Newsletter = require("./models/newsletter");
const Payment = require("./models/payment");

const PORT = process.env.PORT || 9000;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/newsletter", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.send({ data: "Server is live" });
});

// upload image
app.post("/image-upload", (req, res) => {
  const form = formidable({ multiples: true });

  form.parse(req);

  form.on("fileBegin", (name, file) => {
    file.path = __dirname + "/public/uploads/" + file.name;
  });

  form.on("file", function (name, file) {
    res.json({
      status: 200,
      path: `http://localhost:9000/uploads/${file.name}`,
    });
  });
});

// create newsletter
app.post("/create", async (req, res) => {
  console.log(req.body);
  const newNewsletter = new Newsletter({
    imageUrl: req.body.image,
    title: req.body.title,
    description: req.body.description,
    sampleText: req.body.sampleText,
  });

  await newNewsletter.save();
  res.json({ status: 200, message: "success" });
});

// payment
app.post("/payment", async (req, res) => {
  console.log(req.body);
  const newPayment = new Payment({
    id: Math.floor(Math.random() * 100000),
    monthly: req.body.monthly ? parseFloat(req.body.monthly) : null,
    yearly: req.body.yearly ? parseFloat(req.body.yearly) : null,
  });

  await newPayment.save();
  res.json({ status: 200, message: "success" });
});

// stripe
app.post("/stripe", async (req, res) => {
  console.log(req.body);
  const response = await stripe.oauth.token({
    grant_type: "authorization_code",
    code: req.body.code,
  });
  console.log(response);
  res.json({
    status: 200,
    message: "success",
    access_token: response.access_token,
    refresh_token: response.refresh_token,
    stripe_user_id: response.stripe_user_id,
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
