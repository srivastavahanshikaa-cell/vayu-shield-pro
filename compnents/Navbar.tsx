import React from 'react';

export default function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 24px',
      backgroundColor: '#0F172A',
      color: '#FFFFFF',
      borderBottom: '1px solid #1E293B'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '1.5rem' }}>🌪️</span>
        <span style={{ fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '0.5px' }}>
          VAYU-SHIELD 2.0
        </span>
      </div>
      <div style={{
        backgroundColor: '#DC2626',
        color: '#FFFFFF',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '600',
        textTransform: 'uppercase'
      }}>
        Live Disaster Sentinel
      </div>
    </nav>
  );
}
