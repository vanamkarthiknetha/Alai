# Alai - Backend task

## Installation and Setup

### Clone the Repository
```sh
git clone https://github.com/vanamkarthiknetha/Alai.git
cd Alai
```

### Install Dependencies
```sh
npm install
```

### Create .env File
After installing dependencies, create a `.env` file in the root directory and add the following:
```sh
FIRECRAWL_API_KEY=your-firecrawl-api-key

# 2
ALAI_BASE_URL=https://alai-standalone-backend.getalai.com

ALAI_EMAIL=your-email

ALAI_PASSWORD=your-password

ALAI_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzY2hvdHRoamdsamJ4amVyY3puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAxMTI0NzYsImV4cCI6MjAyNTY4ODQ3Nn0.3pZ7fQ9qWjBcX-oSLJ37P4D9ojrdTF1zdI1B4ONcxrE
```

### Run the Project
```sh
node index.js
```

## Technologies Used
- Node.js
- NPM

## Output

Below is an example output after running the script:

![Output Screenshot](output.png)

🔗 [View Sample Output](https://app.getalai.com/view/jneDLMZ7TYSELC862T56lQ)


**Note:** Update the URL in `index.js` to a valid URL. The default URL is:

```js
const url = "https://en.wikipedia.org/wiki/Wiki";
```
Modify this to the URL of the webpage you want to scrape and generate a PPT from.
