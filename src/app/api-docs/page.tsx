'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css'; // ต้อง import CSS ของมันมาด้วย

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
 
        <SwaggerUI url="/api/swagger" />
      </div>
    </div>
  );
}