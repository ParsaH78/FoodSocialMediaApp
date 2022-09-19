const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const regexValidator = (data) => {
  const regex = {
    username: /^[A-Za-z0-9]{3,16}$/,
    email: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
    password: /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{8,20}$/,
  };

  for (const key in data) {
    if (regex[key]) {
      if (!regex[key].test(data[key])) {
        return false;
      }
    } else {
      continue;
    }
    return true;
  }
};

//REGISTER
const register = async (req, res) => {
  const data = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  };

  let regex = regexValidator(data);

  if (!regex) {
    return res.status(404).json({ message: "اطلاعات معتبر نیستند" });
  }

  
  if (!data.username || !data.email || !data.password ) {
    return res.status(400).json({message: "لطفا تمام خانه ها را پر کنید"});
  }

  const emailExists = await User.findOne({ email: data.email });
  if (emailExists) {
    return res.status(400).json({message: "کاربر با این ایمیل وجود دارد"});
  }

  const usernameExists = await User.findOne({ username: data.username });
  if (usernameExists) {
    return res.status(400).json({message: "کاربر با این نام کاربری وجود دارد"});
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const newUser = new User({
      username: data.username,
      email: data.email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    res.status(200).json({
      _id: user.id,
      token: generateToken(user._id),
    });
  } catch (err) {
    return res.status(500).json({message: "خطایی در فرآبند ثبت نام بوجود آمده است ! لطفا دوباره تلاش کنید"});
  }
};

//LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({message: "کاربر یافت نشد"});
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({message: "پسورد اشتباه است"});
    }

    res.status(200).json({
      _id: user.id,
      token: generateToken(user._id),
    });
  } catch (err) {
    return res.status(500).json({message: "خطایی در فرآیند ورود بوجود آمده است ! لطفا دوباره تلاش کنید"});
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

module.exports = {
  register,
  login,
}
