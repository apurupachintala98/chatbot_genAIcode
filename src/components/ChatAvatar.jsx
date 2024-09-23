import React from 'react';
import { Avatar } from 'flowbite-react';

const ChatAvatar = ({ imgSrc, altText }) => {
  return (
    <Avatar
      img={imgSrc}
      alt={altText}
      rounded={true} // Optionally, you can make the avatar rounded
    />
  );
};

export default ChatAvatar;


