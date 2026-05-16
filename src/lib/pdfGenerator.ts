import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/** Plain-text PDF from markdown when visual capture fails. */
function generatePdfFromMarkdownPlain(markdown: string, filename: string): void {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const plain = markdown
    .replace(/\r\n/g, '\n')
    .replace(/^#{1,6}\s+(.*)$/gm, '$1\n')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/_([^_\n]+)_/g, '$1')
    .replace(/^[-*+]\s+/gm, '• ')
    .replace(/^>\s+/gm, '')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .trim();

  const maxWidth = 180;
  const lines = pdf.splitTextToSize(plain, maxWidth);
  let y = 15;
  const lineHeight = 5.6;
  const pageH = pdf.internal.pageSize.getHeight();

  for (const line of lines) {
    if (y + lineHeight > pageH - 12) {
      pdf.addPage();
      y = 15;
    }
    pdf.text(line, 15, y);
    y += lineHeight;
  }
  pdf.save(filename);
}

async function generatePdfWithHtmlPlugin(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  await Promise.race([
    new Promise<void>((resolve, reject) => {
      let settled = false;
      const safeReject = (e: unknown) => {
        if (settled) return;
        settled = true;
        reject(e);
      };
      const safeResolve = () => {
        if (settled) return;
        settled = true;
        resolve();
      };

      try {
        const worker = pdf.html(element, {
          callback: (doc) => {
            try {
              doc.save(filename);
              safeResolve();
            } catch (e) {
              safeReject(e);
            }
          },
          x: 10,
          y: 10,
          width: 190,
          windowWidth: Math.max(700, Math.min(element.scrollWidth, 1280)),
          autoPaging: 'text',
          html2canvas: {
            scale: 0.4,
            useCORS: true,
            letterRendering: true,
            logging: false,
            backgroundColor: '#ffffff',
            scrollX: 0,
            scrollY: -window.scrollY,
          },
        });

        if (worker != null && typeof (worker as Promise<unknown>).catch === 'function') {
          (worker as Promise<unknown>).catch(safeReject);
        }
      } catch (e) {
        safeReject(e);
      }
    }),
    new Promise<void>((_, reject) => {
      window.setTimeout(
        () => reject(new Error('PDF html() timed out')),
        45_000,
      );
    }),
  ]);
}

async function generatePdfWithCanvas(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  const maxSide = Math.max(element.offsetWidth, element.offsetHeight, 1);
  const scale = Math.min(2, 8192 / maxSide);

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    foreignObjectRendering: false,
  });

  if (canvas.width < 2 || canvas.height < 2) {
    throw new Error('Could not capture notes for PDF (empty canvas).');
  }

  const imgData = canvas.toDataURL('image/png', 1.0);
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const margin = 10;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const usableWidth = pageWidth - margin * 2;
  const usableHeight = pageHeight - margin * 2;

  const imgWidth = usableWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = margin;

  pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
  heightLeft -= usableHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight + margin;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
    heightLeft -= usableHeight;
  }

  pdf.save(filename);
}

/**
 * Prefer jsPDF's built-in HTML pipeline (pagination), then canvas snapshot, then plain text.
 */
export async function generatePdfFromElement(
  element: HTMLElement,
  filename: string,
  markdownFallback: string,
): Promise<void> {
  try {
    await generatePdfWithHtmlPlugin(element, filename);
    return;
  } catch (e) {
    console.warn('PDF: html() pipeline failed, trying canvas', e);
  }

  try {
    await generatePdfWithCanvas(element, filename);
    return;
  } catch (e) {
    console.warn('PDF: canvas pipeline failed, using text fallback', e);
  }

  generatePdfFromMarkdownPlain(markdownFallback, filename);
}

export function generatePdfFromMarkdownOnly(
  markdown: string,
  filename: string,
): void {
  generatePdfFromMarkdownPlain(markdown, filename);
}
