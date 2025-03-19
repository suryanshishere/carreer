import React from 'react';
import moment from 'moment';

interface RenderedDateProps {
  strValue: string;
  uniqueKey: string | number;
}

const RenderedDate: React.FC<RenderedDateProps> = ({ strValue, uniqueKey }) => {
  // Use the global flag to catch all matches in the string.
  const partialDateRegex = /\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(.\d+)?Z)?/g;

  // Replace all substrings that match the regex with the formatted date.
  const replacedString = strValue.replace(partialDateRegex, (match) => {
    const m = moment(match);
    // If Moment can parse the date, format it; otherwise, leave it unchanged.
    return m.isValid() ? m.format("Do MMMM YYYY") : match;
  });

  return <span key={uniqueKey}>{replacedString}</span>;
};

export default RenderedDate;