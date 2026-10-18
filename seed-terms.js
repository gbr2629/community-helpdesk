// Adds the built-in translations WITHOUT touching your other data or users.
require('dotenv').config();
const mongoose = require('mongoose');
const { Term } = require('./models');
const terms = require('./terms-data');

(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/community_helpdesk');
  const r = await Term.bulkWrite(terms.map(t => ({
    updateOne: { filter: { en: t.en }, update: { $setOnInsert: t }, upsert: true }
  })));
  console.log(`Translations added: ${r.upsertedCount} (existing ones were left unchanged)`);
  await mongoose.disconnect();
})();