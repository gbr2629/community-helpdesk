const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const Area = model('Area', new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  wet: String, dry: String, hazardous: String
}));

const Bus = model('Bus', new Schema({
  route: { type: String, required: true, unique: true, trim: true },
  from: String, to: String,
  first: String, last: String,      // "HH:MM" 24-hour
  every: Number                     // minutes between buses
}));

const Helpline = model('Helpline', new Schema({
  name: { type: String, required: true },
  name_hi: String, name_mr: String,
  number: { type: String, required: true },
  keywords: [String]                // words that make the bot pick this helpline
}));

// Registered website users (passwords are stored only as salted scrypt hashes)
const User = model('User', new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  salt: String,
  hash: String
}, { timestamps: true }));

const Term = model('Term', new Schema({
  en: { type: String, required: true, unique: true, trim: true },
  hi: String, mr: String
}));

const ChatLog = model('ChatLog', new Schema({
  message: String, reply: String, intent: String, lang: String,
  userName: String, userEmail: String
}, { timestamps: true }));

module.exports = { Area, Bus, Helpline, User, Term, ChatLog };