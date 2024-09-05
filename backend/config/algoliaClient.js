const algoliasearch = require('algoliasearch')

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID || 'U746KE1M5G';
const ALGOLIA_ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY || '7d72b4a70b7a0f991a6fe4ba0f1f7a48';

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY);
const index = client.initIndex('items');

module.exports = { index };
