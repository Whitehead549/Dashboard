import React, { useEffect } from 'react';

const Translate = () => {
  useEffect(() => {
    const addTranslateScript = () => {
      if (!window.google || !window.google.translate) {
        const script = document.createElement('script');
        script.src =
          "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      }

      // Function to hide the top translation bar and other unwanted UI
      const hideGoogleTranslateUI = () => {
        const style = document.createElement('style');
        style.innerHTML = `
          .goog-te-banner-frame { display: none !important; } /* Hide top bar */
          .goog-logo-link { display: none !important; } /* Hide Google Translate logo */
          .goog-te-gadget { font-size: 0 !important; } /* Minimize unwanted UI */
        `;
        document.head.appendChild(style);
      };

      hideGoogleTranslateUI();
    };

    addTranslateScript();
  }, []);

  return (
    <div className="relative z-50 inline-block p-2 bg-white rounded shadow-lg">
      <div id="google_translate_element" className="w-full"></div>
    </div>
  );
};

export default Translate;


