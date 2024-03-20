import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import multer from 'multer';
import cors from 'cors';
import bodyParser from 'body-parser';


const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
dotenv.config();

const sponsorRender = ({ name,email,phone,brandname,branddesc,desc }) => {
  return (
    `<div>
      <div>
        <b style="margin-right:3px;">İsim Soyisim:</b>
        <span>${name}</span>
      </div>
      <div>
        <b style="margin-right:3px;">E-posta adresiniz:</b>
        <span>${email}</span>
      </div>
      <div>
        <b style="margin-right:3px;">Telefon numaranız:</b>
        <span>${phone}</span>
      </div>
      <div>
        <b style="margin-right:3px;">Marka Adı:</b>
        <span>${brandname}</span>
      </div>
      <div>
        <b style="margin-right:3px;">Marka Açıklaması ?:</b>
        <span>${branddesc}</span>
      </div>
      <div>
        <b style="margin-right:3px;">Açıklama</b>
        <span>${desc}</span>
      </div>
    </div>`
  )
}

const streamerRender = ({ name,email,phone,birthDate,tiktok,city,hearus,gender }) => {
  return (
    `<div>
      <div>
        <b style="margin-right:3px;">İsim Soyisim:</b>
        <span>${name}</span>
      </div>
      <div>
        <b style="margin-right:3px;">E-posta adresiniz:</b>
        <span>${email}</span>
      </div>
      <div>
        <b style="margin-right:3px;">Telefon numaranız:</b>
        <span>${phone}</span>
      </div>
      <div>
        <b style="margin-right:3px;">Doğum tarihiniz:</b>
        <span>${birthDate}</span>
      </div>
      <div>
        <b style="margin-right:3px;">Tiktok Kullanıcı Adınız:</b>
        <span>${tiktok}</span>
      </div>
      <div>
        <b style="margin-right:3px;">Şehir:</b>
        <span>${city}</span>
      </div>
      <div>
        <b style="margin-right:3px;">Bizi Nereden Duydunuz ?:</b>
        <span>${hearus}</span>
      </div>
      <div>
        <b style="margin-right:3px;">Cinsiyet</b>
        <span>${gender}</span>
      </div>
    </div>`
  )
}

app.post('/api/streamer',(req, res) => {
  const {
    birthDate,
    city,
    email,
    gender,
    hearus,
    name,
    phone,
    tiktok
  } = req.body;

  let imagePath = null;

  if (req.file) {
    imagePath = `./uploads/${req.file.filename}`;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_MAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

  transporter.sendMail({
    from: process.env.USER_MAIL,
    to: process.env.USER_MAIL,
    subject: "Yayıncı Başvurusu",
    html: streamerRender({name,email,phone,birthDate,tiktok,city,hearus,gender}),
    attachments: imagePath ? [{ path: imagePath, filename: req.file.originalname }] : []
  }, (error, info) => {
    if (error) {
      return res.status(500).json({
        error: error.message
      });
    } else {
      return res.status(200).json({
        message: 'Mail Gönderildi!',
        status: true
      });
    }
  });
});

app.post('/api/sponsor', (req,res) => {
  const { brandname,branddesc,desc,name,email,phone } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_MAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

  transporter.sendMail({
    from: process.env.USER_MAIL,
    to: process.env.USER_MAIL,
    subject: "Sponsor Başvurusu",
    html: sponsorRender({name,email,phone,brandname,branddesc,desc})
  }, (error, info) => {
    if (error) {
      return res.status(500).json({
        error: error.message
      });
    } else {
      return res.status(200).json({
        message: 'Mail Gönderildi!',
        status: true
      });
    }
  });
});

app.listen(port, () => {
  console.log(`API listening on ${port} port`);
});