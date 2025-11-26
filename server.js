const express = require("express");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const resetTokens = {};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "gmail_manziling@gmail.com",
        pass: "gmail-app-parol",
    },
});

app.post("/forgot", async (req, res) => {
    const { email } = req.body;

    const token = crypto.randomBytes(32).toString("hex");

    resetTokens[token] = {
        email,
        expires: Date.now() + 1000 * 60 * 10
    };

    const link = `http://localhost:3000/reset-password/${token}`;

    await transporter.sendMail({
        to: email,
        subject: "Parolni tiklash",
        html: `<a href="${link}">Parolni tiklash uchun bosing</a>`
    });

    res.send("Email yuborildi!");
});

app.listen(3000, () => console.log("Server ishlayapti..."));
const fs = require("fs");

// Register qabul qilish
app.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    // Baza o‘qish
    let users = JSON.parse(fs.readFileSync("users.json", "utf8"));

    // Email band yoki yo‘qligini tekshirish
    const existing = users.find(u => u.email === email);

    if (existing) {
        return res.send("Bu email bilan akkaunt mavjud!");
    }

    // Yangi user qo‘shish
    users.push({
        name,
        email,
        password
    });

    fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

    res.send("Ro‘yxatdan o‘tdingiz! Endi login sahifaga qayting.");
});