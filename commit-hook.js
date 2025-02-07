// https://chatgpt.com/share/67a58d90-dc68-8000-bf7b-168b26b1bad3

const { execSync } = require('child_process');
const fetch = require('node-fetch'); // or use `undici` for a modern alternative

// 1. get the commit message
const commitMessage = execSync('git log -1 --pretty=%B').toString().trim();

// 2. get the commit hash
const commitHash = execSync('git rev-parse HEAD').toString().trim();

// 3. get the GitHub repo URL
let repoUrl = execSync('git config --get remote.origin.url').toString().trim();
repoUrl = repoUrl
  .replace(/^git@github\.com:/, 'https://github.com/')
  .replace(/\.git$/, '');

// 4. construct the commit permalink
const commitPermalink = `${repoUrl}/commit/${commitHash}`;

// 5. define the data payload
const projectName = repoUrl.split('/').pop(); // extract repo name
const payload = {
  data: commitMessage,
  metadata: {
    author: commitPermalink,
    title: `GitHub Commit/${projectName}`,
  },
  dbPath: 'DB_PATH_HERE',
  apiKey: 'API_KEY_HERE',
};

// 6. upload to the endpoint
const ENDPOINT_URL = 'YCB_ENDPOINT_HERE/add'; // replace with actual URL

(async () => {
  try {
    const response = await fetch(ENDPOINT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log('Upload successful:', result);
  } catch (error) {
    console.error('Upload failed:', error);
  }
})();
