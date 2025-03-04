import React from 'react';

const parseMessageContent = (content) => {
  const urlRegex = /(\bhttps?:\/\/\S+\b)/g; // Improved regex to detect URLs
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  
  return (
    <div>
      {content.split(/\n+/).map((line, index) => {
        return (
          <p key={index}>
            {line.split(/(\s+)/).flatMap((part, idx) => {
              if (urlRegex.test(part)) {
                return part.split(urlRegex).map((subpart, subIndex) => (
                  urlRegex.test(subpart) ? 
                  <a key={`${idx}-${subIndex}`} href={subpart} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{subpart}</a> :
                  <span key={`${idx}-${subIndex}`}>{subpart}</span>
                ));
              }
              if (emailRegex.test(part)) {
                return <a key={idx} href={`mailto:${part}`} className="text-blue-600 underline">{part}</a>;
              }
              return <span key={idx}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
};

export default parseMessageContent;
