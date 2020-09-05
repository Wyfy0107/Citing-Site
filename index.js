const puppeteer = require("puppeteer");

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
      "https://www.sciencedirect.com/science/article/abs/pii/S0920586120302947"
    );

    let result = await page.evaluate(() => {
      let links = document.querySelectorAll("a.author");
      let text = document.querySelector("div.text-xs");
      let year = text.innerText.split(",")[1];

      let authors = [];
      let citation = "";

      links.forEach(link => {
        authors.push(link.innerText);
      });

      if (authors.length === 1) {
        citation = `(${authors[0]}, ${year})`;
      } else if (authors.length < 4) {
        for (let i = 0; i < authors.length; i++) {
          if (i === 0) {
            citation = authors[0];
          } else if (i === authors.length - 1) {
            citation = citation + ", and " + authors[i];
          } else {
            citation = citation + ", " + authors[i];
          }
        }
        citation = `(${citation}, ${year})`;
      } else {
        citation = `(${authors[0]} et al.,${year})`;
      }

      return citation;
    });

    console.log(result);

    await browser.close();
  } catch (error) {
    console.log(error);
  }
})();
