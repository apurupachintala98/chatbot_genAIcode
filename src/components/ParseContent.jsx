import React from 'react';

const parseMessageContent = (content) => {
  // Regex for detecting URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Regex for detecting email addresses
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

  const parts = content.split(' ').map((part, index) => {
    // If the part is a URL, return a clickable link
    if (urlRegex.test(part)) {
      return <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{part}</a>;
    }

    // If the part is an email, return a clickable mailto link
    if (emailRegex.test(part)) {
      return <a key={index} href={`mailto:${part}`} className="text-blue-600 underline">{part}</a>;
    }

    // Otherwise, return the plain text part
    return <span key={index}>{part} </span>;
  });

  return parts;
};
