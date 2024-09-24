import React from 'react';

const SuggestedPrompts = ({ prompts }) => {
    return (
        <div className="suggested-prompts-container">
            <h3 className='prompt-header'>Suggested Prompts</h3>
            <div className="suggested-prompts">
                {prompts.map((prompt, index) => (
                    // <div
                    //     key={index}
                    //     className="prompt"
                    //     onClick={() => onPromptClick(prompt)}
                    // >
                    <div
                    key={index}
                    className="prompt"
                >
                        {prompt}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuggestedPrompts;
