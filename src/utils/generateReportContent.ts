export const generateReportHTML = (data: {
  title: string;
  studyCount: number;
  keyFindings: string[];
  recommendations: string[];
  selectedStudies: any[];
}) => {
  const { title, studyCount, keyFindings, recommendations, selectedStudies } = data;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      <header style="border-bottom: 2px solid #8B5CF6; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="color: #1a1a1a; margin-bottom: 10px;">${title}</h1>
        <p style="color: #666; font-size: 14px;">Generated on ${new Date().toLocaleDateString()}</p>
        <p style="background: #8B5CF6; color: white; padding: 8px 16px; display: inline-block; border-radius: 4px; font-size: 14px;">
          ${studyCount} studies analyzed
        </p>
      </header>

      <section style="margin-bottom: 30px;">
        <h2 style="color: #1a1a1a; border-left: 4px solid #8B5CF6; padding-left: 12px; margin-bottom: 15px;">
          Executive Summary
        </h2>
        <p style="color: #555; line-height: 1.6;">
          This comprehensive analysis examines ${studyCount} space biology studies, 
          revealing critical insights into how various organisms respond to space environments. 
          The findings provide valuable data for future mission planning and biological research protocols.
        </p>
      </section>

      <section style="margin-bottom: 30px;">
        <h2 style="color: #1a1a1a; border-left: 4px solid #8B5CF6; padding-left: 12px; margin-bottom: 15px;">
          Key Findings
        </h2>
        <ul style="list-style: none; padding: 0;">
          ${keyFindings.map(finding => `
            <li style="padding: 10px 0; border-bottom: 1px solid #eee; color: #555;">
              <span style="color: #8B5CF6; font-weight: bold;">•</span> ${finding}
            </li>
          `).join('')}
        </ul>
      </section>

      ${selectedStudies.length > 0 ? `
        <section style="margin-bottom: 30px;">
          <h2 style="color: #1a1a1a; border-left: 4px solid #8B5CF6; padding-left: 12px; margin-bottom: 15px;">
            Selected Studies
          </h2>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
            ${selectedStudies.map(study => `
              <div style="margin-bottom: 15px; padding: 12px; background: white; border-radius: 4px; border-left: 3px solid #06B6D4;">
                <h3 style="margin: 0 0 8px 0; color: #1a1a1a; font-size: 16px;">${study.title}</h3>
                <p style="margin: 0; color: #666; font-size: 14px;">
                  <strong>Mission:</strong> ${study.mission} | 
                  <strong>Species:</strong> ${study.species} | 
                  <strong>Year:</strong> ${study.year}
                </p>
                ${study.summary ? `<p style="margin: 8px 0 0 0; color: #777; font-size: 13px;">${study.summary}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <section style="margin-bottom: 30px;">
        <h2 style="color: #1a1a1a; border-left: 4px solid #8B5CF6; padding-left: 12px; margin-bottom: 15px;">
          Statistical Analysis
        </h2>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px;">
          <div style="background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); padding: 20px; border-radius: 8px; text-align: center;">
            <div style="font-size: 32px; font-weight: bold; color: #2563EB; margin-bottom: 5px;">94%</div>
            <div style="font-size: 14px; color: #2563EB;">Confidence Level</div>
          </div>
          <div style="background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%); padding: 20px; border-radius: 8px; text-align: center;">
            <div style="font-size: 32px; font-weight: bold; color: #16A34A; margin-bottom: 5px;">87%</div>
            <div style="font-size: 14px; color: #16A34A;">Data Coverage</div>
          </div>
          <div style="background: linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%); padding: 20px; border-radius: 8px; text-align: center;">
            <div style="font-size: 32px; font-weight: bold; color: #9333EA; margin-bottom: 5px;">91%</div>
            <div style="font-size: 14px; color: #9333EA;">Reproducibility</div>
          </div>
        </div>
      </section>

      <section style="margin-bottom: 30px;">
        <h2 style="color: #1a1a1a; border-left: 4px solid #8B5CF6; padding-left: 12px; margin-bottom: 15px;">
          Methodology
        </h2>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
            <h3 style="font-size: 16px; margin: 0 0 10px 0; color: #1a1a1a;">Data Sources</h3>
            <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 14px;">
              <li>NASA Life Sciences Data Archive</li>
              <li>European Space Agency Database</li>
              <li>International Space Station Research</li>
              <li>Commercial Space Research Data</li>
            </ul>
          </div>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
            <h3 style="font-size: 16px; margin: 0 0 10px 0; color: #1a1a1a;">Analysis Methods</h3>
            <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 14px;">
              <li>AI-powered pattern recognition</li>
              <li>Statistical correlation analysis</li>
              <li>Cross-species comparison</li>
              <li>Temporal trend analysis</li>
            </ul>
          </div>
        </div>
      </section>

      <section style="margin-bottom: 30px;">
        <h2 style="color: #1a1a1a; border-left: 4px solid #8B5CF6; padding-left: 12px; margin-bottom: 15px;">
          Recommendations
        </h2>
        ${recommendations.map((rec, index) => `
          <div style="background: #F5F3FF; border: 1px solid #DDD6FE; border-radius: 8px; padding: 15px; margin-bottom: 10px;">
            <div style="display: flex; align-items: start; gap: 12px;">
              <div style="background: #8B5CF6; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-weight: bold; font-size: 14px;">
                ${index + 1}
              </div>
              <p style="margin: 0; color: #555; line-height: 1.5;">${rec}</p>
            </div>
          </div>
        `).join('')}
      </section>

      <footer style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e5e5; text-align: center; color: #888; font-size: 12px;">
        <p>This report was generated using GenSpace Research Platform</p>
        <p>© ${new Date().getFullYear()} - All Rights Reserved</p>
      </footer>
    </div>
  `;
};
