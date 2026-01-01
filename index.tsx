
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Root element 'root' not found.");
} else {
  try {
    // Basic guard against multiple initializations
    if (!(window as any)._edu_app_initialized) {
      (window as any)._edu_app_initialized = true;
      const root = createRoot(rootElement);
      root.render(<App />);
    }
  } catch (error) {
    console.error("React render error:", error);
    rootElement.innerHTML = `
      <div style="padding: 30px; color: #856404; background-color: #fff3cd; border: 1px solid #ffeeba; border-radius: 12px; font-family: sans-serif; text-align: center; max-width: 450px; margin: 100px auto;">
        <h3 style="margin-top: 0;">লোডিং এরর!</h3>
        <p style="font-size: 14px;">${error instanceof Error ? error.message : String(error)}</p>
        <button onclick="window.location.reload()" style="background: #856404; color: white; border: none; padding: 10px 25px; border-radius: 8px; cursor: pointer; margin-top: 15px;">পুনরায় লোড দিন</button>
      </div>
    `;
  }
}
