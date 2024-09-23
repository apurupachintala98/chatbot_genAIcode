import React, { useState } from 'react';

const ThumbsUpIcon = () => <svg class="w-[16px] h-[16px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11c.889-.086 1.416-.543 2.156-1.057a22.323 22.323 0 0 0 3.958-5.084 1.6 1.6 0 0 1 .582-.628 1.549 1.549 0 0 1 1.466-.087c.205.095.388.233.537.406a1.64 1.64 0 0 1 .384 1.279l-1.388 4.114M7 11H4v6.5A1.5 1.5 0 0 0 5.5 19v0A1.5 1.5 0 0 0 7 17.5V11Zm6.5-1h4.915c.286 0 .372.014.626.15.254.135.472.332.637.572a1.874 1.874 0 0 1 .215 1.673l-2.098 6.4C17.538 19.52 17.368 20 16.12 20c-2.303 0-4.79-.943-6.67-1.475"/>
</svg>;
const ThumbsDownIcon = () => <svg class="w-[16px] h-[16px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13c-.889.086-1.416.543-2.156 1.057a22.322 22.322 0 0 0-3.958 5.084 1.6 1.6 0 0 1-.582.628 1.549 1.549 0 0 1-1.466.087 1.587 1.587 0 0 1-.537-.406 1.666 1.666 0 0 1-.384-1.279l1.389-4.114M17 13h3V6.5A1.5 1.5 0 0 0 18.5 5v0A1.5 1.5 0 0 0 17 6.5V13Zm-6.5 1H5.585c-.286 0-.372-.014-.626-.15a1.797 1.797 0 0 1-.637-.572 1.873 1.873 0 0 1-.215-1.673l2.098-6.4C6.462 4.48 6.632 4 7.88 4c2.302 0 4.79.943 6.67 1.475"/>
</svg>;
const ThumbsUpIconDark = () => <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
<path fill-rule="evenodd" d="M15.03 9.684h3.965c.322 0 .64.08.925.232.286.153.532.374.717.645a2.109 2.109 0 0 1 .242 1.883l-2.36 7.201c-.288.814-.48 1.355-1.884 1.355-2.072 0-4.276-.677-6.157-1.256-.472-.145-.924-.284-1.348-.404h-.115V9.478a25.485 25.485 0 0 0 4.238-5.514 1.8 1.8 0 0 1 .901-.83 1.74 1.74 0 0 1 1.21-.048c.396.13.736.397.96.757.225.36.32.788.269 1.211l-1.562 4.63ZM4.177 10H7v8a2 2 0 1 1-4 0v-6.823C3 10.527 3.527 10 4.176 10Z" clip-rule="evenodd"/>
</svg>;
const ThumbsDownIconDark = () => <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
<path fill-rule="evenodd" d="M8.97 14.316H5.004c-.322 0-.64-.08-.925-.232a2.022 2.022 0 0 1-.717-.645 2.108 2.108 0 0 1-.242-1.883l2.36-7.201C5.769 3.54 5.96 3 7.365 3c2.072 0 4.276.678 6.156 1.256.473.145.925.284 1.35.404h.114v9.862a25.485 25.485 0 0 0-4.238 5.514c-.197.376-.516.67-.901.83a1.74 1.74 0 0 1-1.21.048 1.79 1.79 0 0 1-.96-.757 1.867 1.867 0 0 1-.269-1.211l1.562-4.63ZM19.822 14H17V6a2 2 0 1 1 4 0v6.823c0 .65-.527 1.177-1.177 1.177Z" clip-rule="evenodd"/>
</svg>;
const CommentIcon = () => <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 10.5h.01m-4.01 0h.01M8 10.5h.01M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.6a1 1 0 0 0-.69.275l-2.866 2.723A.5.5 0 0 1 8 18.635V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/>
</svg>;

const Feedback = () => {
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [isCommentBoxVisible, setIsCommentBoxVisible] = useState(false);

  const handleFeedback = () => {
  setIsLiked(!isLiked);
  if (isDisliked) setIsDisliked(false);
  }
  const handleThumbsUp = async () => {
    // Toggle the thumbs-up state and reset thumbs-down if it's active
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);

    //Send the new state to the backend
    // try {
    //     const response = await fetch('http://localhost:5000/api/like', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ liked: !isLiked, disliked: false }),
    //     });

    //     if (!response.ok) {
    //         throw new Error('Failed to update like status');
    //     }
    // } catch (error) {
    //     console.error('Error updating like status:', error);
    // }
};

const handleThumbsDown = async () => {
    // Toggle the thumbs-down state and reset thumbs-up if it's active
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);

    // Send the new state to the backend
    // try {
    //     const response = await fetch('http://localhost:5000/api/like', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ liked: false, disliked: !isDisliked }),
    //     });

    //     if (!response.ok) {
    //         throw new Error('Failed to update dislike status');
    //     }
    // } catch (error) {
    //     console.error('Error updating dislike status:', error);
    // }
};

const handleButtonClick = () => {
    setIsCommentBoxVisible(!isCommentBoxVisible);
};

  return (
    // <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
    //   <p style={{
    //       marginBottom: '0px',
    //     }}>Was this response helpful?</p>
    //    <button onClick={handleThumbsUp} className="text-gray-500 hover:text-gray-800 ml-2">
    //   {isLiked ? <ThumbsUpIconDark /> : <ThumbsUpIcon />}
    // </button>
    // <button onClick={handleThumbsDown} className="text-gray-500 hover:text-gray-800 ml-2">
    //     {isDisliked ? <ThumbsDownIconDark /> : <ThumbsDownIcon />}
    //   </button>
    
    //   <button onClick={handleButtonClick}
    //     style={{
    //       marginLeft: '5px',
    //       border: 'none',
    //       cursor: 'pointer',
    //     }}
    //   >
    //     <CommentIcon />
    //   </button>
    //   {isCommentBoxVisible && (
    //     <textarea
    //       placeholder="Write your comment here..."
    //       rows="4"
    //       cols="50"
    //       style={{ display: 'block', marginTop: '10px' }}
    //     />
    //   )}
    // </div>

    <div className="feedback-container">
    <p className="feedback-text fw-bold">Was this response helpful?</p>
    <button onClick={handleThumbsUp} className="text-gray-500 hover:text-gray-800 ml-2">
        {isLiked ? <ThumbsUpIconDark /> : <ThumbsUpIcon />}
    </button>
    <button onClick={handleThumbsDown} className="text-gray-500 hover:text-gray-800 ml-2">
        {isDisliked ? <ThumbsDownIconDark /> : <ThumbsDownIcon />}
    </button>
    <button onClick={handleButtonClick} className="feedback-button">
        <CommentIcon />
    </button>
    {isCommentBoxVisible && (
        <div className="comment-box">
            <form className="comment-submit">
                <label for="chat" class="sr-only">Your Comment</label>
                <div class="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <textarea id="chat" rows="3" class="block p-2 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message..."></textarea>
                    <button type="submit" class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
                        <svg class="w-5 h-5" aria-hidden="true" fill="#44b8f3" viewBox="0 0 448 448">
                            <path d="M.213 32L0 181.333 320 224 0 266.667.213 416 448 224z" />
                        </svg>
                        <span class="sr-only">Send message</span>
                    </button>
                </div>
            </form>
        </div>
    )}
</div>
  );
};

export default Feedback;
