import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import '../../styles/swagger-custom.css';

export default function ApiDocs() {
  return (
    <div className="swagger-docs-container">
      <SwaggerUI url="/openapi.yaml" />
    </div>
  );
} 