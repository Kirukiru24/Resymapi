const puppeteer = require('puppeteer');

exports.generateWeeklyReportPDF = async (reportData, tasks) => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // HTML Template based on ALTA Computec Layout [cite: 1, 7, 37, 43, 47]
    const htmlContent = `
    <html>
    <head>
        <style>
            body { font-family: 'Helvetica', sans-serif; color: #333; line-height: 1.6; padding: 40px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0056b3; }
            .header h1 { color: #0056b3; margin: 0; text-transform: uppercase; }
            .header p { margin: 5px 0; font-style: italic; color: #666; }
            .meta-section { display: flex; justify-content: space-between; margin-bottom: 20px; background: #f9f9f9; padding: 15px; border-radius: 5px; }
            .section-title { background: #0056b3; color: white; padding: 8px 15px; border-radius: 3px; margin-top: 25px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f2f2f2; }
            .task-notes { font-size: 0.9em; color: #555; margin-top: 5px; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>ALTA COMPUTEC</h1>
            <p>The ICT solution center</p>
            <p>ALTA Computec PLC</p>
        </div>

        <div class="meta-section">
            <div>
                <strong>Name:</strong> ${reportData.full_name}<br>
                <strong>Role:</strong> ${reportData.role}
            </div>
            <div>
                <strong>Report Date:</strong> ${new Date(reportData.submitted_at).toLocaleDateString()}<br>
                <strong>Division:</strong> ${reportData.division}
            </div>
        </div>

        <h3 class="section-title">Activities</h3>
        <table>
            <thead>
                <tr>
                    <th>Task Description</th>
                    <th>Status</th>
                    <th>Time Spent</th>
                </tr>
            </thead>
            <tbody>
                ${tasks.map(task => `
                    <tr>
                        <td>
                            <strong>${task.title}</strong>
                            <div class="task-notes">${task.notes || ''}</div>
                        </td>
                        <td>${task.status}</td>
                        <td>${task.time_spent}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <h3 class="section-title">Achievements</h3>
        <p>${reportData.achievements || 'None reported.'}</p>

        <h3 class="section-title">Challenges</h3>
        <p>${reportData.challenges || 'None reported.'}</p>

        <h3 class="section-title">Future Plans</h3>
        <p>${reportData.future_plans || 'None reported.'}</p>
    </body>
    </html>
    `;

    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return pdfBuffer;
};