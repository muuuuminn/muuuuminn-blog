module.exports = {
  dest: "public/locales/ja/resume.pdf",
  marked_options: {
    headerIds: false,
    smartypants: true,
  },
  pdf_options: {
    format: "A4",
    margin: "30mm 20mm",
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `
      <style>
        section {
          margin: 0 auto;
          font-size: 16px;
        }
      </style>
      <section>
        <span>履歴書</span>
        <span>2024/09/24</span>
      </section>`,
    footerTemplate: `
      <div style="font-size: 10px; margin: 0 auto;">
        <span class='pageNumber'></span> / <span class='totalPages'></span>
      </div>`,
  },
  stylesheet_encoding: "utf-8",
};
