import React from 'react';

const BaseLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
        <h1>AI Chatbot with Reusable Intelligence</h1>
      </header>

      <main style={{ flex: 1, padding: '1rem' }}>
        {children}
      </main>

      <footer style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderTop: '1px solid #dee2e6' }}>
        <p>© 2026 AI Chatbot. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BaseLayout;