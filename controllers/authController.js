const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
require('dotenv').config();
// Kiểm tra biến môi trường
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error('Thiếu thông tin đăng nhập email (EMAIL_USER hoặc EMAIL_PASS)');
}

// Kiểm tra bcrypt
(async () => {
  try {
    const testPassword = 'test123';
    const hashedTestPassword = await bcrypt.hash(testPassword, 10);
    console.log('Test mã hóa:', hashedTestPassword);
    const isTestMatch = await bcrypt.compare(testPassword, hashedTestPassword);
    console.log('Test so sánh:', isTestMatch);
  } catch (error) {
    console.error('Lỗi khi kiểm tra bcrypt:', error.message);
  }
})();

// Cấu hình transporter với SMTP thủ công
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Sử dụng TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Bỏ qua lỗi chứng chỉ nếu cần (chỉ dùng trong môi trường phát triển)
  },
});

// Kiểm tra kết nối SMTP trước khi sử dụng
transporter.verify((error, success) => {
  if (error) {
    console.error('Lỗi kết nối SMTP:', error);
  } else {
    console.log('Kết nối SMTP thành công:', success);
  }
});

exports.register = async (req, res) => {
  try {
    const { fullname, email, phone, dob, gender, password } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email đã tồn tại' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Mật khẩu đã mã hóa:', hashedPassword);

    // Tạo người dùng mới
    const user = new User({
      fullname,
      email: email.toLowerCase(),
      phone,
      dob,
      gender,
      password: hashedPassword,
      role: 'user',
      isVerified: false,
    });
    await user.save();

    // Tạo token xác thực email
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Tạo liên kết xác thực
    const verificationLink = `http://localhost:3000/api/auth/verify-email?token=${token}`;

    // Gửi email xác thực
    await transporter.sendMail({
      from: `"Pet Haven" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Xác thực email cho tài khoản Pet Haven',
      html: `
        <h2>Xác thực email</h2>
        <p>Cảm ơn bạn đã đăng ký tại Pet Haven!</p>
        <p>Vui lòng nhấp vào liên kết dưới đây để xác thực email của bạn:</p>
        <a href="${verificationLink}" style="padding: 10px 20px; background-color: #1890ff; color: white; text-decoration: none; border-radius: 5px;">Xác thực ngay</a>
        <p>Liên kết này có hiệu lực trong 1 giờ.</p>
        <p>Nếu bạn không đăng ký, vui lòng bỏ qua email này.</p>
      `,
    }, (error, info) => {
      if (error) {
        console.error('Lỗi khi gửi email:', error);
        throw new Error('Không thể gửi email xác thực: ' + error.message);
      }
      console.log('Email gửi thành công:', info.response);
    });

    res.status(201).json({
      message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực.',
      user: {
        id: user._id,
        fullname,
        email,
        phone,
        dob,
        gender,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error.message);
    res.status(500).json({ error: 'Không thể đăng ký: ' + error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error('Người dùng không tồn tại');
    }
    if (user.isVerified) {
      throw new Error('Email đã được xác thực');
    }
    user.isVerified = true;
    user.updatedAt = new Date();
    await user.save();

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Xác thực thành công</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f0f2f5; }
            .container { max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            h1 { color: #1890ff; }
            a { display: inline-block; padding: 10px 20px; background-color: #1890ff; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Xác thực thành công!</h1>
            <p>Cảm ơn bạn đã xác thực email. Bạn có thể đăng nhập vào hệ thống ngay bây giờ.</p>
            <a href="http://localhost:3000/customer/login">Đăng nhập</a>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Lỗi khi xác thực email:', error.message);
    res.status(400).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Xác thực thất bại</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f0f2f5; }
            .container { max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            h1 { color: #ff4d4f; }
            a { display: inline-block; padding: 10px 20px; background-color: #1890ff; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Xác thực thất bại!</h1>
            <p>Token không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.</p>
            <a href="http://localhost:3000/customer/register">Đăng ký lại</a>
          </div>
        </body>
      </html>
    `);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Email nhập:', email);
    console.log('Mật khẩu nhập:', password);

    // Chuẩn hóa email thành chữ thường
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      console.log('Không tìm thấy người dùng với email:', normalizedEmail);
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    console.log('Người dùng tìm thấy:', user.email, 'isVerified:', user.isVerified);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Mật khẩu khớp:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ error: 'Vui lòng xác thực email trước khi đăng nhập' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Đăng nhập thành công',
      data: {
        token,
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          phone: user.phone,
          dob: user.dob,
          gender: user.gender,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error.message);
    res.status(401).json({ error: error.message });
  }
};