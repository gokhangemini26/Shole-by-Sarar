const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000').catch(e => console.log('GOTO ERROR:', e.message));

  await new Promise(r => setTimeout(r, 5000));

  console.log('Done.');
  await browser.close();
})();
