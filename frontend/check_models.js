const https = require('https');

const key = 'AIzaSyCq9vc_otYYG6POFzWVmjCXUa2jxnoM0dc';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.error) {
          console.error("API Error:", json.error);
          return;
      }
      const chatModels = json.models
        .filter(m => m.supportedGenerationMethods.includes('generateContent'))
        .map(m => m.name);
      console.log("Available Chat Models:", JSON.stringify(chatModels, null, 2));
    } catch (e) {
      console.error("Parse Error:", e);
      console.log("Raw Data:", data);
    }
  });
}).on('error', (e) => console.error("Net Error:", e));
