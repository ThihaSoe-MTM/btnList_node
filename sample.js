const axios = require('axios');
const { JSDOM } = require('jsdom');
const fs = require('fs');

const url = 'https://www.hokennomadoguchi.com/'; // Replace with your target URL

axios.get(url).then(response => {
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    const buttons = [
        ...document.querySelectorAll('button, input[type="button"], input[type="submit"], a')
    ];

    const data = [];

    buttons.forEach(btn => {
        let name = '';
        let link = '';

        if (btn.tagName.toLowerCase() === 'button') {
            name = btn.textContent.trim();
        } else if (btn.tagName.toLowerCase() === 'input') {
            name = btn.value || '';
        } else if (btn.tagName.toLowerCase() === 'a') {
            name = btn.textContent.trim();
            link = btn.href || '';
        }

        // Try to get link from surrounding <a> if button is inside one
        if (!link) {
            const parentLink = btn.closest('a');
            if (parentLink) {
                link = parentLink.href;
            }
        }

        data.push({ Name: name, Link: link || 'No link' });
    });

    // Convert to CSV format
    const csv = [
        ['Name', 'Link'],
        ...data.map(row => [row.Name, row.Link])
    ].map(e => e.map(v => `"${v.replace(/"/g, '""')}"`).join(',')).join('\n');

    // Save to CSV file
    const bom = '\ufeff';
    fs.writeFileSync('buttons.csv', bom + csv, 'utf8');
    console.log('✅ CSV file saved as buttons.csv');

}).catch(error => {
    console.error('Error fetching the page:', error.message);
});
