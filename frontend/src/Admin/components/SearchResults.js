import React from 'react';
import { connectStateResults, Hits} from 'react-instantsearch-dom';
import Hit2 from "./Hit2";

const Results = connectStateResults(({ searchState }) => {
  const hasResults = searchState.query && searchState.query.length > 0;
  return hasResults ? <Hits hitComponent={Hit2} /> : null;
});

export default Results;
