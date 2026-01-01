
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Root element 'root' not found.");
} else {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("React render error:", error);
    rootElement.innerHTML = `
      <div style="padding: 30px; color: #856404; background-color: #fff3cd; border: 1px solid #ffeeba; border-radius: 12px; font-family: sans-serif; text-align: center; max-width: 450px; margin: 100px auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h3 style="margin-top: 0; color: #856404;">লোডিং এরর!</h3>
        <p style="font-size: 14px;">ব্রাউজারে মডিউল লোড করতে সমস্যা হচ্ছে। অনুগ্রহ করে পেজটি রিফ্রেশ দিন বা অন্য ব্রাউজার (Chrome/Edge) ব্যবহার করুন।</p>
        <div style="background: rgba(0,0,0,0.05); padding: 10px; border-radius: 6px; margin: 15px 0; font-size: 11px; text-align: left; overflow-x: auto; white-space: pre-wrap;">
          <code>${error instanceof Error ? error.message : String(error)}</code>
        </div>
        <button onclick="window.location.reload()" style="background: #856404; color: white; border: none; padding: 10px 25px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px;">পুনরায় লোড দিন</button>
      </div>
    `;
  }
}
