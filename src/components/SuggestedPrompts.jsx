import React from 'react';

const SuggestedPrompts = ({ prompts, onPromptClick }) => {
    return (
        <div className="suggested-prompts-container">
            <h3>Suggested Prompts</h3>
            <div className="suggested-prompts">
                {prompts.map((prompt, index) => (
                    <div
                        key={index}
                        className="prompt"
                        onClick={() => onPromptClick(prompt)}
                    >
                        {prompt}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuggestedPrompts;
