import React from 'react';

const parseMessageContent = (content) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  const lines = content.split(/\n+/).map((line, index) => {
    const parts = line.split(/(\s+)/).map((part, idx) => {
      if (urlRegex.test(part)) {
        return <a key={idx} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{part}</a>;
      }
      if (emailRegex.test(part)) {
        return <a key={idx} href={`mailto:${part}`} className="text-blue-600 underline">{part}</a>;
      }
      return <span key={idx}>{part}</span>;
    });
    return <p key={index}>{parts}</p>;
  });
  return lines;
};

export default parseMessageContent;
