require('dotenv').config();
const mongoose = require('mongoose');
const { Area, Bus, Helpline, Term } = require('./models');
const terms = require('./terms-data');

const areas = [
  { name: 'Green Park',  wet: 'Every day, 7:00–9:00 AM',  dry: 'Monday and Thursday',    hazardous: 'First Saturday of the month' },
  { name: 'Market Road', wet: 'Every day, 6:30–8:30 AM',  dry: 'Tuesday and Friday',     hazardous: 'Second Saturday of the month' },
  { name: 'Lake View',   wet: 'Every day, 7:30–9:30 AM',  dry: 'Wednesday and Saturday', hazardous: 'Third Saturday of the month' }
];
const buses = [
  { route: '12', from: 'Railway Station', to: 'Market Road',   first: '06:00', last: '22:00', every: 15 },
  { route: '21', from: 'Lake View',       to: 'City Hospital', first: '06:30', last: '21:30', every: 20 },
  { route: '45', from: 'Green Park',      to: 'Bus Depot',     first: '05:30', last: '23:00', every: 30 },
  { route: '7',  from: 'Railway Station', to: 'Lake View',     first: '06:00', last: '21:00', every: 25 }
];
const helplines = [
  { name: 'All emergencies', name_hi: 'सभी आपातकालीन सेवाएँ', name_mr: 'सर्व आणीबाणी सेवा', number: '112', keywords: ['emergency', '112', 'आपात', 'आणीबाणी'] },
  { name: 'Police', name_hi: 'पुलिस', name_mr: 'पोलीस', number: '100', keywords: ['police', 'theft', 'crime', 'पुलिस', 'पोलिस', 'पोलीस'] },
  { name: 'Fire brigade', name_hi: 'दमकल', name_mr: 'अग्निशमन', number: '101', keywords: ['fire', 'आग', 'दमकल', 'अग्निशमन'] },
  { name: 'Ambulance', name_hi: 'एम्बुलेंस', name_mr: 'रुग्णवाहिका', number: '102', keywords: ['ambulance', 'एम्बुलेंस', 'रुग्णवाहिका'] },
  { name: 'Women helpline', name_hi: 'महिला हेल्पलाइन', name_mr: 'महिला हेल्पलाइन', number: '1091', keywords: ['women', 'woman', 'महिला'] },
  { name: 'Child helpline', name_hi: 'बाल हेल्पलाइन', name_mr: 'बाल हेल्पलाइन', number: '1098', keywords: ['child', 'children', 'बाल', 'मुल'] },
  { name: 'Senior citizen helpline', name_hi: 'वरिष्ठ नागरिक हेल्पलाइन', name_mr: 'ज्येष्ठ नागरिक हेल्पलाइन', number: '14567', keywords: ['senior', 'elder', 'वरिष्ठ', 'ज्येष्ठ'] },
  { name: 'Cyber crime helpline', name_hi: 'साइबर अपराध हेल्पलाइन', name_mr: 'सायबर गुन्हे हेल्पलाइन', number: '1930', keywords: ['cyber', 'fraud', 'साइबर', 'सायबर'] }
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/community_helpdesk');
  await Promise.all([Area.deleteMany(), Bus.deleteMany(), Helpline.deleteMany(), Term.deleteMany()]);
  await Area.insertMany(areas); await Bus.insertMany(buses); await Helpline.insertMany(helplines); await Term.insertMany(terms);
  console.log('Sample data loaded.');
  await mongoose.disconnect();
})();