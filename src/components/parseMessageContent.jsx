import React from 'react';

const parseMessageContent = (content) => {
  // Regex for detecting URLs (but without the trailing period)
  const urlRegex = /(https?:\/\/[^\s]+)(\.?)/g;

  // Regex for detecting email addresses (without the trailing period)
  const emailRegex = /([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})(\.?)/i;

  return content.split(/(\s+)/).map((part, index) => {
    // Check for URLs
    if (urlRegex.test(part)) {
      // Capture the URL and the trailing period (if any)
      const match = part.match(urlRegex);
      const url = match[1]; // The actual URL without the period
      const trailingPeriod = match[2] || ''; // Keep the trailing period, if there is one

      return (
        <span key={index}>
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{url}</a>{trailingPeriod}
        </span>
      );
    }

    // Check for emails
    if (emailRegex.test(part)) {
      // Capture the email and the trailing period (if any)
      const match = part.match(emailRegex);
      const email = match[1]; // The actual email without the period
      const trailingPeriod = match[2] || ''; // Keep the trailing period, if there is one

      return (
        <span key={index}>
          <a href={`mailto:${email}`} className="text-blue-600 underline">{email}</a>{trailingPeriod}
        </span>
      );
    }

    // Otherwise, return the plain text part with spaces intact
    return <span key={index}>{part}</span>;
  });
};



export default parseMessageContent;
