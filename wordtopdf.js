const fs = require('fs');
const mammoth = require('mammoth');
const PDFDocument = require('pdfkit');
const striptags = require('striptags'); // You'll need to install the 'striptags' package

// Input Word document path
const inputPath = 'WordInput.docx';

// Output PDF path
const outputPath = 'PDFOutput.pdf';

// Read the Word document
fs.readFile(inputPath, 'binary', (err, docxData) => {
  if (err) {
    console.error(err);
    return;
  }

  // Convert Word document to HTML
  mammoth.convertToHtml({ buffer: Buffer.from(docxData, 'binary') })
    .then((result) => {
      const html = result.value;

      // Strip HTML tags to keep plain text
      const plainText = striptags(html);

      // Create a PDF document
      const pdfDoc = new PDFDocument();
      const pdfStream = fs.createWriteStream(outputPath);

      // Pipe plain text to the PDF document
      pdfDoc.pipe(pdfStream);
      pdfDoc.text(plainText);

      // End the PDF document
      pdfDoc.end();

      console.log('PDF conversion complete. Output saved to ' + outputPath);
    })
    .catch((error) => {
      console.error(error);
    });
});
