const fs = require('fs');
const pdf = require('pdf-parse');
const Docxtemplater = require('docxtemplater');
const JSZip = require('jszip');

const pdfToWord = async (pdfPath, docxPath) => {
  try {
    // Read the PDF file
    const dataBuffer = fs.readFileSync(pdfPath);
    
    // Extract text from the PDF using pdf-parse
    const pdfData = await pdf(dataBuffer);
    const pdfText = pdfData.text;

    // Create a Word document using docxtemplater
    const content = fs.readFileSync('template.docx', 'binary');
    const zip = new JSZip(content);
    const doc = new Docxtemplater().loadZip(zip);

// Set the extracted text as the content of the Word document
doc.setData({
  INSERT_PDF_CONTENT_HERE: pdfText, // Use the same placeholder text as in the template
});

doc.render();

const outputBuffer = doc.getZip().generate({ type: 'nodebuffer' });
    // Save the Word document
    fs.writeFileSync(docxPath, outputBuffer);

    console.log('Conversion complete. Word document saved:', docxPath);
  } catch (error) {
    console.error('Error converting PDF to Word:', error);
  }
};

// Usage example
const pdfPath = 'PDFInput.pdf';  // Path to the input PDF file
const docxPath = 'WordOutput.docx';  // Path to save the output Word document

pdfToWord(pdfPath, docxPath);
