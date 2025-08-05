const axios = require('axios');
const { JSDOM } = require('jsdom');

const url = 'https://www.hokennomadoguchi.com/'; // Replace with your target URL

axios.get(url).then(response => {
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    const buttons = [...document.querySelectorAll('button, input[type="button"], input[type="submit"]')];

    console.log(`Total buttons found: ${buttons.length}`);
    buttons.forEach((btn, i) => {
        console.log(`Button ${i + 1}:`);
        console.log(`  Tag: <${btn.tagName.toLowerCase()}>`);
        console.log(`  Text: ${btn.tagName.toLowerCase() === 'button' ? btn.textContent.trim() : btn.value}`);
        console.log(`  Attributes:`, btn.getAttributeNames().reduce((attrs, name) => {
            attrs[name] = btn.getAttribute(name);
            return attrs;
        }, {}));
        console.log('----------------------------------------');
    });
}).catch(error => {
    console.error('Error fetching the page:', error.message);
});
