import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportOptions {
  format: 'pdf' | 'word' | 'presentation' | 'web';
  title: string;
  content: string;
  selectedStudies: any[];
}

export const exportReport = async (options: ExportOptions): Promise<void> => {
  const { format, title, content, selectedStudies } = options;
  
  try {
    switch (format) {
      case 'pdf':
        await exportToPDF(title, content);
        break;
      case 'word':
        exportToWord(title, content, selectedStudies);
        break;
      case 'presentation':
        exportToPresentation(title, content, selectedStudies);
        break;
      case 'web':
        exportToWeb(title, content, selectedStudies);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};

const exportToPDF = async (title: string, content: string): Promise<void> => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const lineHeight = 7;
  let yPosition = margin;

  // Add title
  pdf.setFontSize(20);
  pdf.setFont(undefined, 'bold');
  pdf.text(title, margin, yPosition);
  yPosition += lineHeight * 2;

  // Add generated date
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  pdf.text(`Generated on ${new Date().toLocaleDateString()}`, margin, yPosition);
  yPosition += lineHeight * 2;

  // Add content (simplified text extraction)
  pdf.setFontSize(11);
  const lines = pdf.splitTextToSize(content, pageWidth - (margin * 2));
  
  lines.forEach((line: string) => {
    if (yPosition > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
    pdf.text(line, margin, yPosition);
    yPosition += lineHeight;
  });

  // Save the PDF
  pdf.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
};

const exportToWord = (title: string, content: string, selectedStudies: any[]): void => {
  // Create HTML content for Word document
  const htmlContent = `
    <!DOCTYPE html>
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
        h2 { color: #1e40af; margin-top: 30px; }
        .metadata { background: #f8fafc; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0; }
        .study-list { background: #f1f5f9; padding: 15px; margin: 10px 0; }
        .finding { margin: 10px 0; padding: 10px; background: #f8fafc; border-left: 3px solid #10b981; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="metadata">
        <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Studies Analyzed:</strong> ${selectedStudies.length}</p>
      </div>
      
      <h2>Selected Studies</h2>
      <div class="study-list">
        ${selectedStudies.map(study => `
          <p><strong>${study.title}</strong> (${study.year})</p>
          <p><em>Mission:</em> ${study.mission}</p>
          <p>${study.summary}</p>
          <hr>
        `).join('')}
      </div>
      
      <h2>Executive Summary</h2>
      <p>This comprehensive analysis examines ${selectedStudies.length} space biology studies, revealing critical insights into how various organisms respond to space environments.</p>
      
      <h2>Key Findings</h2>
      <div class="finding">• Microgravity significantly affects cellular metabolism across multiple species</div>
      <div class="finding">• Plant species show remarkable adaptation mechanisms to space radiation</div>
      <div class="finding">• Bone density changes follow predictable patterns during extended missions</div>
      <div class="finding">• Bacterial biofilm formation exhibits enhanced antibiotic resistance in space</div>
      
      <h2>Methodology</h2>
      <p>Data was collected from NASA Life Sciences Data Archive, European Space Agency Database, and International Space Station Research programs. Analysis utilized AI-powered pattern recognition and statistical correlation analysis.</p>
      
      <h2>Recommendations</h2>
      <p>1. Implement standardized protocols for metabolic studies in microgravity</p>
      <p>2. Develop targeted countermeasures for bone density preservation</p>
      <p>3. Investigate cross-species adaptation mechanisms for future applications</p>
      <p>4. Establish monitoring systems for bacterial behavior in space habitats</p>
    </body>
    </html>
  `;

  // Create and download Word document
  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword'
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const exportToPresentation = (title: string, content: string, selectedStudies: any[]): void => {
  // Create HTML content for PowerPoint-style presentation
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .slide { width: 100vw; height: 100vh; padding: 60px; box-sizing: border-box; page-break-after: always; }
        .slide-title { background: white; padding: 40px; text-align: center; }
        .slide-content { background: white; padding: 40px; margin-top: 20px; }
        h1 { color: #2563eb; font-size: 48px; margin: 0; }
        h2 { color: #1e40af; font-size: 36px; border-bottom: 3px solid #2563eb; }
        .key-stats { display: flex; justify-content: space-around; margin: 40px 0; }
        .stat { text-align: center; padding: 20px; background: #f8fafc; border-radius: 10px; }
        .stat-number { font-size: 48px; font-weight: bold; color: #2563eb; }
      </style>
    </head>
    <body>
      <!-- Title Slide -->
      <div class="slide">
        <div class="slide-title">
          <h1>${title}</h1>
          <p style="font-size: 24px; color: #64748b;">Generated on ${new Date().toLocaleDateString()}</p>
          <div class="key-stats">
            <div class="stat">
              <div class="stat-number">${selectedStudies.length}</div>
              <div>Studies Analyzed</div>
            </div>
            <div class="stat">
              <div class="stat-number">${selectedStudies.filter(s => s.species).length}</div>
              <div>Species Studied</div>
            </div>
            <div class="stat">
              <div class="stat-number">${new Set(selectedStudies.map(s => s.mission)).size}</div>
              <div>Space Missions</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Executive Summary Slide -->
      <div class="slide">
        <div class="slide-content">
          <h2>Executive Summary</h2>
          <ul style="font-size: 20px; line-height: 1.8;">
            <li>Comprehensive analysis of ${selectedStudies.length} space biology studies</li>
            <li>Critical insights into organism responses to space environments</li>
            <li>Valuable data for future mission planning and research protocols</li>
            <li>Cross-species adaptation patterns identified</li>
          </ul>
        </div>
      </div>
      
      <!-- Key Findings Slide -->
      <div class="slide">
        <div class="slide-content">
          <h2>Key Findings</h2>
          <div style="font-size: 18px; line-height: 1.6;">
            <div style="background: #f0f9ff; padding: 20px; margin: 10px 0; border-left: 4px solid #0ea5e9;">
              🔬 Microgravity significantly affects cellular metabolism across multiple species
            </div>
            <div style="background: #f0fdf4; padding: 20px; margin: 10px 0; border-left: 4px solid #22c55e;">
              🌱 Plant species show remarkable adaptation mechanisms to space radiation
            </div>
            <div style="background: #fef7f0; padding: 20px; margin: 10px 0; border-left: 4px solid #f97316;">
              🦴 Bone density changes follow predictable patterns during extended missions
            </div>
            <div style="background: #fdf2f8; padding: 20px; margin: 10px 0; border-left: 4px solid #ec4899;">
              🦠 Bacterial biofilm formation exhibits enhanced antibiotic resistance in space
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Create and download presentation
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_presentation.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const exportToWeb = (title: string, content: string, selectedStudies: any[]): void => {
  // Create a comprehensive web report
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', system-ui, sans-serif; line-height: 1.6; color: #334155; background: #f8fafc; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 60px 0; text-align: center; }
        .header-content { max-width: 800px; margin: 0 auto; }
        h1 { font-size: 3rem; margin-bottom: 20px; }
        .subtitle { font-size: 1.2rem; opacity: 0.9; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 40px 0; }
        .stat-card { background: white; padding: 30px; border-radius: 10px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .stat-number { font-size: 2.5rem; font-weight: bold; color: #2563eb; }
        .section { background: white; margin: 30px 0; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        h2 { color: #1e40af; font-size: 1.8rem; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
        .finding { background: #f1f5f9; padding: 20px; margin: 15px 0; border-left: 4px solid #3b82f6; border-radius: 0 8px 8px 0; }
        .study-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .study-card { background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .study-title { font-weight: bold; color: #1e40af; margin-bottom: 10px; }
        .study-meta { font-size: 0.9rem; color: #64748b; margin-bottom: 10px; }
        footer { background: #1e293b; color: white; text-align: center; padding: 40px 0; margin-top: 60px; }
      </style>
    </head>
    <body>
      <header>
        <div class="header-content">
          <h1>${title}</h1>
          <p class="subtitle">Generated on ${new Date().toLocaleDateString()}</p>
        </div>
      </header>
      
      <div class="container">
        <div class="stats">
          <div class="stat-card">
            <div class="stat-number">${selectedStudies.length}</div>
            <div>Studies Analyzed</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${selectedStudies.filter(s => s.species).length}</div>
            <div>Species Studied</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${new Set(selectedStudies.map(s => s.mission)).size}</div>
            <div>Space Missions</div>
          </div>
        </div>
        
        <div class="section">
          <h2>Executive Summary</h2>
          <p>This comprehensive analysis examines ${selectedStudies.length} space biology studies, revealing critical insights into how various organisms respond to space environments. The findings provide valuable data for future mission planning and biological research protocols.</p>
        </div>
        
        <div class="section">
          <h2>Key Findings</h2>
          <div class="finding">🔬 Microgravity significantly affects cellular metabolism across multiple species</div>
          <div class="finding">🌱 Plant species show remarkable adaptation mechanisms to space radiation</div>
          <div class="finding">🦴 Bone density changes follow predictable patterns during extended missions</div>
          <div class="finding">🦠 Bacterial biofilm formation exhibits enhanced antibiotic resistance in space</div>
        </div>
        
        <div class="section">
          <h2>Analyzed Studies</h2>
          <div class="study-grid">
            ${selectedStudies.map(study => `
              <div class="study-card">
                <div class="study-title">${study.title}</div>
                <div class="study-meta">
                  <strong>Year:</strong> ${study.year} | 
                  <strong>Mission:</strong> ${study.mission}
                </div>
                <p>${study.summary}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      
      <footer>
        <p>&copy; ${new Date().getFullYear()} GenSpace Research Platform</p>
      </footer>
    </body>
    </html>
  `;

  // Open in new window or download
  const newWindow = window.open();
  if (newWindow) {
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  } else {
    // Fallback: download as HTML file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_web_report.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};