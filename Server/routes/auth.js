const express = require("express");
const User = require("../model/UserShema");
const Posts = require("../model/InstaPostShema");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const router = express.Router();
const Authenticate = require("../middleware/Authenticate");

const { SKEY } = require("../secretkeys");
const jwt = require("jsonwebtoken");
router.get("/Authenticate", Authenticate, (req, res) => {
    console.log("fine");
});
router.get("/", (req, res) => {
    console.log("fine");
});
router.post("/signup", async(req, res) => {
    const { name, email, phone, photo, desp, password, cpassword } = req.body;
    if (!name || !email || !phone || !password || !cpassword) {
        res.json({ error: "Fill All The Feilds" });
    } else {
        const EmailAlredyExist = await User.findOne({ email: req.body.email });
        const PhoneAlredyExist = await User.findOne({ phone: req.body.phone });
        if (EmailAlredyExist || PhoneAlredyExist) {
            res.json({ error: "Email Or Phone Already Exist" });
        } else {
            if (req.body.password === req.body.cpassword) {
                const data = await User({
                    name,
                    email,
                    phone,
                    photo,
                    desp,
                    password,
                    cpassword,
                });

                const SaveData = await data.save();
                if (SaveData) {
                    res.json({ Message: "Data Added" });
                    console.log(SaveData);
                } else {
                    res.json({ error: "Somethings Went Wrong" });
                }
            } else {
                res.json({ error: "Password Not Matched" });
            }
        }
    }
});

router.post("/login", async(req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.json({ error: "Fill All The Filed" });
    } else {
        const UserEmail = await User.findOne({ email: req.body.email });
        const UserPassword = await bcrypt.compare(password, UserEmail.password);
        if (UserPassword) {
            let Generatingtoken = jwt.sign({ _id: UserEmail._id }, SKEY);

            const { _id, name, email, desp, photo } = UserEmail;

            res.json({
                Message: "Login Successful",
                token: Generatingtoken,
                users: {
                    _id,
                    name,
                    email,
                    desp,
                    photo,
                },
            });
        } else {
            res.json({ error: "Login Failed" });
        }
    }
});

module.exports = router;