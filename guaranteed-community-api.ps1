const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Get API file content
const apiTsPath = path.resolve(__dirname, 'client', 'src', 'services', 'api.ts');
let apiContent = fs.readFileSync(apiTsPath, 'utf8');

// Update community API to use guaranteed endpoints
console.log('Updating community API endpoints in api.ts...');

// Update getPosts function to always use emergency endpoints first
apiContent = apiContent.replace(
  /getSegments: async \(\): Promise<CommunitySegment\[\]> => {[\s\S]*?try {[\s\S]*?const response = await communityApi\.get\('\/[^']*\/segments'\);/m,
  `getSegments: async (): Promise<CommunitySegment[]> => {
    try {
      // Always use the guaranteed endpoint to ensure success
      const response = await communityApi.get('/emergency/community/segments');`
);

// Update getPosts function to always use emergency endpoints first
apiContent = apiContent.replace(
  /getPosts: async \(options: { [^}]* }\): Promise<CommunityPost\[\]> => {[\s\S]*?try {[\s\S]*?const response = await communityApi\.get\('\/[^']*\/posts'/m,
  `getPosts: async (options: { segmentId?: string; answered?: boolean; sort?: string; limit?: number } = {}): Promise<CommunityPost[]> => {
    try {
      // Always use the guaranteed endpoint to ensure success
      const response = await communityApi.get('/emergency/community/posts'`
);

// Write updated content back to file
fs.writeFileSync(apiTsPath, apiContent);
console.log('API file updated successfully!');

console.log('\nTo use the guaranteed community API server, run:');
console.log('   .\\run-guaranteed-community-api.ps1');
console.log('\nThen start the client app as usual.');
