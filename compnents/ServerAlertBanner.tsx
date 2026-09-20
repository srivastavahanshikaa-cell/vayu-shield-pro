import React from 'react';

export default function SevereAlertBanner() {
  return (
    <div style={{
      backgroundColor: '#FEF2F2',
      borderLeft: '4px solid #DC2626',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '0.85rem',
      color: '#991B1B'
    }}>
      <div>
        <strong>⚠️ EMERGENCY SENTINEL ACTIVE:</strong> Autonomous Cyclone Infrastructure Telemetry Monitoring Bay of Bengal & Global BRICS Corridors.
      </div>
      <span style={{ fontWeight: 'bold', fontSize: '0.75rem', backgroundColor: '#FEE2E2', padding: '2px 8px', borderRadius: '4px' }}>
        T-MINUS 24H
      </span>
    </div>
  );
}
