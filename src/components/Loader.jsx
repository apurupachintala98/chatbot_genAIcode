import React from 'react';

function Loader() {
  return (
    <div>
      {/* Inline style tag for the CSS */}
      <style jsx="true">{`
        .loader {
            display: flex;
         width: 100%;
  margin-left: 25px;
        }

        .dot {
          width: 5px;
    height: 5px;
    margin: 0 5px;
    background-color: #5009b5; /* Customize color as needed */
    border-radius: 50%;
    animation: loading 0.8s infinite alternate;
        }

        @keyframes loading {
    0% {
      transform: scale(1);
      opacity: 0.6;
    }
    100% {
      transform: scale(1.5);
      opacity: 1;
    }
  }
        .dot:nth-child(2) {
          animation-delay: 0.2s;
    background-color: #794cff;
        }

        .dot:nth-child(3) {
           animation-delay: 0.4s;
    background-color: #00bbba;
        }

        .dot:nth-child(4) {
          animation-delay: 0.6s; 
    background-color: #44b8f3;
        }
      `}</style>

      <div className="loader">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
}

export default Loader;
