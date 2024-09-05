import algoliasearch from 'algoliasearch';

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID || 'U746KE1M5G';
const ALGOLIA_SEARCH_API_KEY = process.env.ALGOLIA_SEARCH_API_KEY || '3a7dc04e46ffac98ffba02229e3b0438';

const searchClient = algoliasearch(ALGOLIA_APP_ID,ALGOLIA_SEARCH_API_KEY);

export default searchClient;
