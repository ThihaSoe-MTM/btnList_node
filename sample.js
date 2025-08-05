const axios = require("axios");
const { JSDOM } = require("jsdom");
const fs = require("fs");

const url = "https://www.hokennomadoguchi.com/"; // Replace with your target URL

axios
  .get(url)
  .then((response) => {
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    const elements = [
      ...document.querySelectorAll(
        'button, input[type="button"], input[type="submit"], a, img'
      ),
    ];

    const data = [];

    elements.forEach((el) => {
      let name = "";
      let link = "";
      let type = "";
      let attr_name="";

      if (el.tagName.toLowerCase() === "button") {
        name = el.textContent.trim();
        const attrs = el.getAttributeNames().reduce((acc, attrName) => {
          acc[attrName] = el.getAttribute(attrName);
          return acc;
        }, {});
        attr_name = JSON.stringify(attrs);
        type = "button";
      } else if (el.tagName.toLowerCase() === "input") {
        name = el.value || "";
        const attrs = el.getAttributeNames().reduce((acc, attrName) => {
          acc[attrName] = el.getAttribute(attrName);
          return acc;
        }, {});
        attr_name = JSON.stringify(attrs);
        type = "button";
      } else if (el.tagName.toLowerCase() === "a") {
        name = el.textContent.trim();
        link = el.href || "";
        type = "link";
      } else if (el.tagName.toLowerCase() === "img") {
        name = el.alt?.trim() || "Image";
        link = el.href || "";
        type = "image";
      }

      // Get link from enclosing <a> if no link yet
      if (!link) {
        const parentLink = el.closest("a");
        if (parentLink) {
          link = parentLink.href;
        }
      }

      data.push({ Type: type, Name: name, Link: link || "No link" , Attribute:attr_name });
    });

    // Sort so buttons first, then links, then images
    const sortOrder = { button: 1, link: 2, image: 3 };
    data.sort((a, b) => sortOrder[a.Type] - sortOrder[b.Type]);

    // Convert to CSV format
    const csv = [
      ["Type", "Name", "Link" , "Attribute"],
      ...data.map((row) => [row.Type, row.Name, row.Link, row.Attribute]),
    ]
      .map((e) => e.map((v) => `"${v.replace(/"/g, '""')}"`).join(","))
      .join("\n");

    // Save to CSV file
    const bom = "\ufeff";
    fs.writeFileSync("buttons.csv", bom + csv, "utf8");
    console.log("CSV file saved as buttons.csv");
  })
  .catch((error) => {
    console.error("Error fetching the page:", error.message);
  });
