
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Could not find root element with ID 'root'");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("React rendering error:", error);
    rootElement.innerHTML = `
      <div style="padding: 20px; color: red; font-family: sans-serif; text-align: center;">
        <h2>দুঃখিত, অ্যাপ্লিকেশনটি লোড হতে সমস্যা হচ্ছে।</h2>
        <p>${error instanceof Error ? error.message : "অজানা ত্রুটি"}</p>
        <button onclick="window.location.reload()" style="padding: 10px 20px; cursor: pointer;">পুনরায় চেষ্টা করুন</button>
      </div>
    `;
  }
}
