/**
 * EVIDENCE-COLLECTOR.JS - Gather Reference Files/Screenshots
 * 
 * Purpose: Systematically collect and organize evidence for debugging
 * 
 * Based on Julius V7 case study where evidence collection revealed:
 * - Reference CSV files from notebook with real data
 * - Screenshot showing $0 total spend UI bug
 * - Database data vs output data comparison
 * - Empty CSV files vs expected populated files
 */

const fs = require('fs');
const path = require('path');

class EvidenceCollector {
  constructor() {
    this.evidence = {
      referenceFiles: [],
      actualOutputs: [],
      screenshots: [],
      errorLogs: [],
      configFiles: [],
      databaseQueries: [],
      metadata: {
        collectionDate: new Date().toISOString(),
        collectionPhase: 'INITIAL'
      }
    };
    this.evidenceDir = './debug_evidence';
  }

  /**
   * Initialize evidence collection directory
   */
  initializeCollection() {
    console.log('📂 INITIALIZING EVIDENCE COLLECTION');
    console.log('===================================');
    
    if (!fs.existsSync(this.evidenceDir)) {
      fs.mkdirSync(this.evidenceDir, { recursive: true });
      console.log(`✅ Created evidence directory: ${this.evidenceDir}`);
    }
    
    // Create subdirectories for organization
    const subdirs = ['reference_files', 'actual_outputs', 'screenshots', 'logs', 'configs', 'comparisons'];
    subdirs.forEach(dir => {
      const fullPath = path.join(this.evidenceDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`📁 Created: ${fullPath}`);
      }
    });
    
    return this.evidenceDir;
  }

  /**
   * Collect reference files (what the output SHOULD look like)
   */
  async collectReferenceFiles(filePaths) {
    console.log('📄 COLLECTING REFERENCE FILES');
    console.log('=============================');
    
    if (!Array.isArray(filePaths)) {
      filePaths = [filePaths];
    }
    
    for (const filePath of filePaths) {
      try {
        if (fs.existsSync(filePath)) {
          const fileName = path.basename(filePath);
          const referenceDir = path.join(this.evidenceDir, 'reference_files');
          const destPath = path.join(referenceDir, `ref_${fileName}`);
          
          fs.copyFileSync(filePath, destPath);
          
          // Analyze file content
          const stats = fs.statSync(filePath);
          const content = fs.readFileSync(filePath, 'utf8');
          const lineCount = content.split('\n').filter(line => line.trim()).length;
          
          const evidence = {
            originalPath: filePath,
            collectedPath: destPath,
            fileName,
            size: stats.size,
            lineCount: lineCount - 1, // Exclude header
            lastModified: stats.mtime,
            contentPreview: content.substring(0, 200),
            type: 'reference'
          };
          
          this.evidence.referenceFiles.push(evidence);
          console.log(`✅ Collected reference: ${fileName} (${stats.size} bytes, ${lineCount-1} rows)`);
          
          // Generate content analysis
          await this.analyzeFileContent(filePath, 'reference');
          
        } else {
          console.log(`❌ Reference file not found: ${filePath}`);
        }
      } catch (error) {
        console.error(`❌ Error collecting reference file ${filePath}:`, error.message);
      }
    }
    
    return this.evidence.referenceFiles;
  }

  /**
   * Collect actual output files (what the system IS producing)
   */
  async collectActualOutputs(filePaths) {
    console.log('📊 COLLECTING ACTUAL OUTPUTS');
    console.log('============================');
    
    if (!Array.isArray(filePaths)) {
      filePaths = [filePaths];
    }
    
    for (const filePath of filePaths) {
      try {
        if (fs.existsSync(filePath)) {
          const fileName = path.basename(filePath);
          const outputDir = path.join(this.evidenceDir, 'actual_outputs');
          const destPath = path.join(outputDir, `actual_${fileName}`);
          
          fs.copyFileSync(filePath, destPath);
          
          const stats = fs.statSync(filePath);
          const content = fs.readFileSync(filePath, 'utf8');
          const lineCount = content.split('\n').filter(line => line.trim()).length;
          
          const evidence = {
            originalPath: filePath,
            collectedPath: destPath,
            fileName,
            size: stats.size,
            lineCount: lineCount - 1,
            lastModified: stats.mtime,
            contentPreview: content.substring(0, 200),
            type: 'actual',
            isEmpty: stats.size === 0 || lineCount <= 1
          };
          
          this.evidence.actualOutputs.push(evidence);
          console.log(`✅ Collected actual output: ${fileName} (${stats.size} bytes, ${lineCount-1} rows)${evidence.isEmpty ? ' [EMPTY]' : ''}`);
          
          await this.analyzeFileContent(filePath, 'actual');
          
        } else {
          console.log(`❌ Actual output file not found: ${filePath}`);
        }
      } catch (error) {
        console.error(`❌ Error collecting actual output ${filePath}:`, error.message);
      }
    }
    
    return this.evidence.actualOutputs;
  }

  /**
   * Collect screenshots and visual evidence
   */
  async collectScreenshots(imagePaths, descriptions) {
    console.log('📸 COLLECTING SCREENSHOTS');
    console.log('=========================');
    
    if (!Array.isArray(imagePaths)) {
      imagePaths = [imagePaths];
      descriptions = [descriptions];
    }
    
    for (let i = 0; i < imagePaths.length; i++) {
      const imagePath = imagePaths[i];
      const description = descriptions[i] || 'No description provided';
      
      try {
        if (fs.existsSync(imagePath)) {
          const fileName = path.basename(imagePath);
          const screenshotDir = path.join(this.evidenceDir, 'screenshots');
          const destPath = path.join(screenshotDir, `screenshot_${Date.now()}_${fileName}`);
          
          fs.copyFileSync(imagePath, destPath);
          
          const stats = fs.statSync(imagePath);
          const evidence = {
            originalPath: imagePath,
            collectedPath: destPath,
            fileName,
            description,
            size: stats.size,
            lastModified: stats.mtime,
            type: 'screenshot'
          };
          
          this.evidence.screenshots.push(evidence);
          console.log(`✅ Collected screenshot: ${fileName} - ${description}`);
          
        } else {
          console.log(`❌ Screenshot not found: ${imagePath}`);
        }
      } catch (error) {
        console.error(`❌ Error collecting screenshot ${imagePath}:`, error.message);
      }
    }
    
    return this.evidence.screenshots;
  }

  /**
   * Collect error logs and debug output
   */
  async collectErrorLogs(logData, source = 'unknown') {
    console.log('📝 COLLECTING ERROR LOGS');
    console.log('========================');
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      source,
      content: typeof logData === 'string' ? logData : JSON.stringify(logData, null, 2),
      type: 'error_log'
    };
    
    this.evidence.errorLogs.push(logEntry);
    
    // Save to file
    const logsDir = path.join(this.evidenceDir, 'logs');
    const logFile = path.join(logsDir, `error_log_${Date.now()}.txt`);
    fs.writeFileSync(logFile, `Source: ${source}\nTimestamp: ${logEntry.timestamp}\n\n${logEntry.content}`);
    
    console.log(`✅ Collected error log from ${source}`);
    return logEntry;
  }

  /**
   * Analyze file content to extract key information
   */
  async analyzeFileContent(filePath, type) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n').filter(line => line.trim());
      
      const analysis = {
        fileName: path.basename(filePath),
        type,
        totalLines: lines.length,
        dataRows: lines.length - 1,
        header: lines[0] || 'No header',
        isEmpty: lines.length <= 1,
        hasNumericData: false,
        sampleValues: [],
        patterns: {
          hasZeros: false,
          hasNulls: false,
          hasEmptyFields: false,
          hasRealData: false
        }
      };
      
      // Analyze first few data rows
      if (lines.length > 1) {
        for (let i = 1; i <= Math.min(3, lines.length - 1); i++) {
          const row = lines[i];
          analysis.sampleValues.push(row);
          
          // Check for patterns
          if (row.includes('0') || row.includes('0.0')) analysis.patterns.hasZeros = true;
          if (row.includes('null') || row.includes('NULL')) analysis.patterns.hasNulls = true;
          if (row.includes(',,')) analysis.patterns.hasEmptyFields = true;
          
          // Check for real data (Julius V7 case study values)
          if (row.includes('295.49') || row.includes('1186.48') || 
              parseFloat(row.split(',').find(val => parseFloat(val) > 100))) {
            analysis.patterns.hasRealData = true;
            analysis.hasNumericData = true;
          }
        }
      }
      
      // Save analysis
      const analysisDir = path.join(this.evidenceDir, 'comparisons');
      const analysisFile = path.join(analysisDir, `analysis_${type}_${path.basename(filePath)}.json`);
      fs.writeFileSync(analysisFile, JSON.stringify(analysis, null, 2));
      
      console.log(`📊 Analyzed ${type} file: ${analysis.dataRows} rows, ${analysis.patterns.hasRealData ? 'HAS REAL DATA' : 'NO REAL DATA'}`);
      
      return analysis;
      
    } catch (error) {
      console.error(`❌ Error analyzing file ${filePath}:`, error.message);
      return null;
    }
  }

  /**
   * Generate evidence summary report
   */
  generateEvidenceSummary() {
    console.log('📋 EVIDENCE COLLECTION SUMMARY');
    console.log('==============================');
    
    const summary = {
      collectionDate: this.evidence.metadata.collectionDate,
      counts: {
        referenceFiles: this.evidence.referenceFiles.length,
        actualOutputs: this.evidence.actualOutputs.length,
        screenshots: this.evidence.screenshots.length,
        errorLogs: this.evidence.errorLogs.length
      },
      referenceFiles: this.evidence.referenceFiles.map(f => ({
        fileName: f.fileName,
        size: f.size,
        rows: f.lineCount,
        empty: f.size === 0
      })),
      actualOutputs: this.evidence.actualOutputs.map(f => ({
        fileName: f.fileName,
        size: f.size,
        rows: f.lineCount,
        empty: f.isEmpty
      })),
      screenshots: this.evidence.screenshots.map(s => ({
        fileName: s.fileName,
        description: s.description
      })),
      readyForComparison: this.evidence.referenceFiles.length > 0 && this.evidence.actualOutputs.length > 0
    };
    
    console.log(`📊 Reference Files: ${summary.counts.referenceFiles}`);
    console.log(`📊 Actual Outputs: ${summary.counts.actualOutputs}`);
    console.log(`📸 Screenshots: ${summary.counts.screenshots}`);
    console.log(`📝 Error Logs: ${summary.counts.errorLogs}`);
    console.log(`🎯 Ready for comparison: ${summary.readyForComparison ? 'YES' : 'NO'}`);
    
    // Save summary
    const summaryFile = path.join(this.evidenceDir, 'evidence_summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    
    return summary;
  }

  /**
   * Julius V7 case study example of evidence collection
   */
  static getJuliusV7Example() {
    return {
      evidenceCollected: {
        referenceFiles: [
          'TopLevel_Daily_2025-11-12.csv (2.1KB, real aggregated data)',
          'AdSetLevel_Daily_2025-11-12.csv (5.2KB, 40 campaigns)',
          'AdLevel_Daily_2025-11-12.csv (8.1KB, 70 individual ads)'
        ],
        actualOutputs: [
          'TopLevel_Daily_2025-11-12.csv (0 bytes, empty)',
          'AdSetLevel_Daily_2025-11-12.csv (0 bytes, empty)',
          'AdLevel_Daily_2025-11-12.csv (0 bytes, empty)'
        ],
        screenshots: [
          'ui_showing_zero_spend.png - UI displays $0 Total Spend despite having CSV data'
        ],
        errorLogs: [
          'UTM matching failures in Shopify attribution',
          'Field mapping errors in summary calculation',
          'Empty join results in Meta-Shopify attribution'
        ]
      },
      keyFindings: [
        'Reference files contain real data, actual outputs are empty',
        'UI calculation bug separate from CSV generation issue',
        'Attribution logic completely failing to join data',
        'Database contains data but processing pipeline broken'
      ]
    };
  }
}

module.exports = { EvidenceCollector };