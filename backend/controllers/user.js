const User = require("../models/user");
const bcrypt = require("bcrypt");
const { setUser } = require("../services/auth");

async function handleSignUp(req, res) {
  try {
    const { username, password, email, enrollmentNumber, role, picKey } = req.body;

    if (!username || !password || !email || !enrollmentNumber || !role) {
      return res.status(400).json({ error: "Please provide all required fields" });
    }

    if (role === 'pic_member') {
      if (!picKey || picKey !== process.env.PIC_ADMIN_KEY) {
        return res.status(403).json({ error: "Invalid PIC Secret Key. Unauthorized to create Admin." });
      }
    }

    const existingUser = await User.findOne({ $or: [{ email }, { enrollmentNumber }] });
    if (existingUser) {
      return res.status(400).json({ error: "Email or Enrollment Number already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      enrollmentNumber,
      role,
      password: hashedPassword,
      picKey: role === 'pic_member' ? picKey : undefined,
    });

    return res.status(201).json({ success: "Signed up successfully", user: newUser });
  } catch (error) {
    console.error("Error in sign-up:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleLogIn(req, res) {
  try {
    const { enrollmentNumber, password, picKey } = req.body;

    if (!enrollmentNumber || !password) {
      return res.status(400).json({ error: "Enrollment number and password are required" });
    }

    const currentUser = await User.findOne({ enrollmentNumber });
    if (!currentUser) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    if (currentUser.role === 'pic_member') {
        if (!picKey || picKey !== process.env.PIC_ADMIN_KEY) {
            return res.status(403).json({ error: "Invalid PIC Key for Admin Login" });
        }
    }

    const isMatch = await bcrypt.compare(password, currentUser.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    if (currentUser.role === 'pic_member') {
      if (!picKey) {
        return res.status(400).json({ error: "PIC key is required for PIC members" });
      }
      if (!currentUser.verifyPicKey(picKey)) {
        return res.status(400).json({ error: "Invalid PIC key" });
      }
    }

    const token = setUser(currentUser);
    const isProduction = process.env.NODE_ENV === 'production';

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,                      
      sameSite: isProduction ? 'None' : 'Lax',   
      path: '/',
      maxAge: 86400000, 
    };

    res.cookie("loginToken", token, cookieOptions);
    return res.json({ success: "Logged in successfully", user: currentUser });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleLogOut(req, res) {
  try {
    const isProduction = process.env.NODE_ENV === 'production';

    res.clearCookie("loginToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax',
      path: '/',
    });
    return res.status(200).json({ success: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getUserById(req, res) {
  try {
    const userId = req.user._id;

    const userdata = await User.findById(userId);
    if (!userdata) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ data: userdata });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  handleSignUp,
  handleLogIn,
  handleLogOut,
  getUserById,
};
