const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("../models/user");
const Customer = require("../models/Customer");
const DeliveryCompany = require("../models/DeliveryCompany");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {

          res.status(200).json({
            message: "User created!",
            result: result
          })
        })
        .catch(err => {
          res.status(500).json({
            message: "Invalid authentication credentials!"
          })
        })
    });
}

exports.createCustomer = (req, res, next) => {
  bcrypt.hash(req.body.CPassword, 10)
    .then(hash => {
      const user = new Customer({
        CEmail: req.body.CEmail,
        CPassword: hash,
        CName: req.body.CName,
        CGender: req.body.CGender,
        CPhoneNumber: req.body.CPhoneNumber,
        TypeAccount: "Customer"
      });
      user.save()
        .then(result => {

          res.status(201).json({
            message: "User created!",
            result: result
          })
        })
        .catch(err => {
          res.status(500).json({
            message: "Invalid authentication credentials!"
          })
        })
    });
}

exports.updateCustomer = async (req, res, next) => {
  let user = await Customer.findOne({ CEmail: req.body.email });
  await Customer.updateOne({ _id: user._id }, {
    $set: {
      CName: req.body.name,
      CPhoneNumber: req.body.phonenumber,
      CGender: req.body.gender,
    }
  })
  await user.save();

  return res.status(201).json({
    name: req.body.name,
    phonenumber: req.body.phonenumber,
    gender: req.body.gender
  })
}

exports.createDeliveryCompany = (req, res, next) => {
  bcrypt.hash(req.body.DCPassword, 10)
    .then(hash => {
      const user = new DeliveryCompany({
        DCEmail: req.body.DCEmail,
        DCPassword: hash,
        DCName: req.body.DCName,
        DCPhoneNumber: req.body.DCPhoneNumber,
        SPID: "2",
        TypeAccount: "Delivery Company"
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: "User created!",
            result: result
          })
        })
        .catch(err => {
          res.status(500).json({
            message: "Invalid authentication credentials!"
          })
        })
    });
}

exports.userLogin = async (req, res, next) => {
  let user = await Customer.findOne({ CEmail: req.body.email });
  if (user) {
    const result = await bcrypt.compare(req.body.password, user.CPassword);
    if (!result) {
      return res.status(401).json({
        message: "Sai m???t kh???u!"
      })
    }
    const token = await jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
    return res.status(200).json({
      token: token,
      expiresIn: 3600,
      username: user.CName,
      email: user.CEmail,
      typeAccount: user.TypeAccount,
      gender: user.CGender,
      phonenumber: user.CPhoneNumber
    });
  }
  user = await DeliveryCompany.findOne({ DCEmail: req.body.email });
  if (user) {
    const result = await bcrypt.compare(req.body.password, user.DCPassword);
    if (!result) {
      return res.status(401).json({
        message: "Sai m???t kh???u!"
      })
    }
    const token = await jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
    return res.status(200).json({
      token: token,
      expiresIn: 3600,
      username: user.DCName,
      email: user.DCEmail,
      typeAccount: user.TypeAccount,
      phonenumber: user.DCPhoneNumber
    });
  }
  if (!user) {
    return res.status(401).json({
      message: "Kh??ng t??m th???y ng?????i d??ng!"
    })
  }
}

exports.checkExistUser = async (req, res, next) => {

  let user = await Customer.findOne({ CEmail: req.body.email }) || await DeliveryCompany.findOne({ DCEmail: req.body.email });

  if (user) {
    return res.status(401).json({ message: "Email is used!" });
  } else {
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: 'toantra21062000@gmail.com',
        pass: 'anhtoan2810T'
      }
    });
    var theRandomNumber = Math.floor(Math.random() * 10000) + 1;
    var mailOptions = {
      from: 'toantra21062000@gmail.com',
      to: '18120662@student.hcmus.edu.vn',
      subject: 'SAFAGO code',
      text: "Your code is " + theRandomNumber +"."
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
    }
    });
    return res.status(200).json({ message: "Email can use!", theRandomNumber: theRandomNumber});
  }
}

