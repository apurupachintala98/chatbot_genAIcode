import React from 'react';

const parseMessageContent = (content) => {
  // Regex for detecting URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Regex for detecting email addresses
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

  // Split content by line breaks first to handle paragraphs
  const lines = content.split(/\n+/).map((line, index) => {
    const parts = line.split(/(\s+)/).map((part, idx) => {
      // If the part is a URL, return a clickable link
      if (urlRegex.test(part)) {
        return <a key={idx} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{part}</a>;
      }

      // If the part is an email, return a clickable mailto link
      if (emailRegex.test(part)) {
        return <a key={idx} href={`mailto:${part}`} className="text-blue-600 underline">{part}</a>;
      }

      // Otherwise, return the plain text part with spaces intact
      return <span key={idx}>{part}</span>;
    });

    // Wrap each line in a <p> tag to create paragraphs
    return <p key={index}>{parts}</p>;
  });

  return lines;
};

export default parseMessageContent;
