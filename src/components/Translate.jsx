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
