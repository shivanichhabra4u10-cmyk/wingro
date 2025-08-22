# Copilot Instructions

## Coding Instructions

### General Best Practices
- Use modular code structure for both frontend and backend.
- Follow consistent naming conventions for files, variables, and functions.
- Use Git for version control and maintain a clean commit history.
- Implement proper error handling in both frontend and backend.
- Write unit tests, integration tests, and end-to-end tests.
- Document APIs, database schema, and code structure.

### Frontend Best Practices
- Ensure responsive design for mobile and desktop.
- Use React's Context API or Redux for state management.
- Optimize images and assets for performance.
- Use lazy loading for components and data fetching.
- Refer to the UI design mentioned in `wingrox-website (28).html` for consistency.

### Backend Best Practices
- Follow RESTful principles for API design.
- Use proper HTTP status codes and methods.
- Optimize database queries and use indexes for frequently queried fields.
- Implement JWT for authentication and secure APIs.
- Sanitize user inputs to prevent SQL injection and XSS attacks.

### Deployment Best Practices
- Use Azure App Service for hosting the backend.
- Set up CI/CD pipelines for automated deployment.
- Use Azure Monitor or Application Insights for tracking performance and errors.

### Additional Preferences
- Follow coding standards and guidelines best practices.
- Containerize the application using Docker.

---

## Azure-Specific Rules

### Azure Tools
- When handling requests related to Azure, always use Azure tools.

### Azure Code Generation Best Practices
- When generating code for Azure, invoke the `azure_development-get_code_gen_best_practices` tool.

### Azure Deployment Best Practices
- When deploying to Azure or preparing applications for deployment to Azure, invoke the `azure_development-get_deployment_best_practices` tool.

### Azure Functions Best Practices
- When generating code for Azure Functions, invoke the `azure_development-get_azure_function_code_gen_best_practices` tool.

### Azure Static Web Apps Best Practices
- When working with Azure Static Web Apps, invoke the `azure_development-get_swa_best_practices` tool.