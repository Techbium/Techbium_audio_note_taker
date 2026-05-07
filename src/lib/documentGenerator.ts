import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

export async function generateDocx(markdownText: string, filename: string = "Student_Notes.docx") {
  // Simple markdown to docx converter
  // We'll split by lines and handle basic markers like ## and **
  
  const lines = markdownText.split("\n");
  const children: any[] = [];

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine === "") return;

    if (trimmedLine.startsWith("# ")) {
      children.push(
        new Paragraph({
          text: trimmedLine.substring(2),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        })
      );
    } else if (trimmedLine.startsWith("## ")) {
      children.push(
        new Paragraph({
          text: trimmedLine.substring(3),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 150 },
        })
      );
    } else if (trimmedLine.startsWith("### ")) {
      children.push(
        new Paragraph({
          text: trimmedLine.substring(4),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 },
        })
      );
    } else if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
       children.push(
        new Paragraph({
          children: [new TextRun(trimmedLine.substring(2))],
          bullet: { level: 0 },
        })
      );
    } else if (/^\d+\. /.test(trimmedLine)) {
       children.push(
        new Paragraph({
          children: [new TextRun(trimmedLine.replace(/^\d+\. /, ""))],
          numbering: { reference: "my-numbering", level: 0 },
        })
      );
    } else {
      // Handle bold text (simple implementation)
      const parts = trimmedLine.split(/(\*\*.*?\*\*)/g);
      const textRuns = parts.map(part => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return new TextRun({
            text: part.slice(2, -2),
            bold: true
          });
        }
        return new TextRun(part);
      });

      children.push(
        new Paragraph({
          children: textRuns,
          spacing: { after: 120 },
        })
      );
    }
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}
