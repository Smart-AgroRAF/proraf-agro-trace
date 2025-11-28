import { useEffect } from 'react';

const GA_TRACKING_ID = 'G-QGDQD6MYPK';

export const GoogleAnalytics = () => {
  useEffect(() => {
    // Criar e adicionar o script do gtag.js
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script1);

    // Inicializar o Google Analytics
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_TRACKING_ID}');
    `;
    document.head.appendChild(script2);

    console.log('Google Analytics inicializado com ID:', GA_TRACKING_ID);

    return () => {
      // Cleanup não é necessário pois o GA deve persistir
    };
  }, []);

  return null;
};
