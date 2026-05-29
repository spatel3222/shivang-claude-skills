/**
 * GAP-ANALYZER.JS - Systematic Actual vs Expected Comparison
 * 
 * Purpose: Calculate gaps between actual and expected behavior systematically
 * 
 * Based on Julius V7 case study where gap analysis revealed:
 * - Row count gaps: 77 actual vs 40 expected (AdSet level)
 * - Data value gaps: $0 actual vs $295.49 expected (spend values)
 * - File size gaps: 0 bytes actual vs 5.2KB expected
 * - Attribution logic gaps: UTM matching failures
 */

const fs = require('fs');
const path = require('path');

class GapAnalyzer {
  constructor(tolerance = 0.01) {
    this.gaps = [];
    this.tolerance = tolerance; // 1% tolerance for numerical comparison
    this.gapTypes = {
      'CRITICAL': 'System completely broken',
      'HIGH': 'Major functionality missing', 
      'MEDIUM': 'Minor discrepancies',
      'LOW': 'Cosmetic differences'
    };
  }

  /**
   * Main gap analysis between actual and expected behavior
   */
  async analyzeAllGaps(actualFiles, expectedFiles) {
    console.log('🔍 COMPREHENSIVE GAP ANALYSIS');
    console.log('=============================');
    console.log(`Tolerance: ${this.tolerance * 100}% for numerical values\n`);
    
    this.gaps = []; // Reset gaps
    
    // File-level gap analysis
    await this.analyzeFileGaps(actualFiles, expectedFiles);
    
    // Content-level gap analysis
    await this.analyzeContentGaps(actualFiles, expectedFiles);
    
    // Generate prioritized gap report
    return this.generateGapReport();
  }

  /**
   * Analyze file-level gaps (existence, size, structure)
   */
  async analyzeFileGaps(actualFiles, expectedFiles) {
    console.log('📁 FILE-LEVEL GAP ANALYSIS');
    console.log('==========================');
    
    const expectedFileNames = Array.isArray(expectedFiles) ? 
      expectedFiles.map(f => typeof f === 'string' ? path.basename(f) : f.fileName) :
      Object.keys(expectedFiles);
      
    const actualFileNames = Array.isArray(actualFiles) ?
      actualFiles.map(f => typeof f === 'string' ? path.basename(f) : f.fileName) :
      Object.keys(actualFiles);

    // Missing files
    expectedFileNames.forEach(expectedFile => {
      if (!actualFileNames.some(actualFile => actualFile.includes(expectedFile) || expectedFile.includes(actualFile))) {
        this.addGap({
          type: 'Missing File',
          severity: 'CRITICAL',
          expected: expectedFile,
          actual: 'NOT FOUND',
          description: `Expected file ${expectedFile} is completely missing`,
          category: 'FILE_EXISTENCE'
        });
      }
    });

    // Size gaps
    for (const expectedFile of expectedFiles) {
      const expectedPath = typeof expectedFile === 'string' ? expectedFile : expectedFile.path;
      const expectedName = path.basename(expectedPath);
      
      // Find corresponding actual file
      const actualFile = actualFiles.find(actual => {
        const actualName = typeof actual === 'string' ? path.basename(actual) : actual.fileName;
        return actualName.includes(expectedName.split('_')[0]) || expectedName.includes(actualName.split('_')[0]);
      });
      
      if (actualFile && fs.existsSync(expectedPath)) {
        const actualPath = typeof actualFile === 'string' ? actualFile : actualFile.path;
        
        if (fs.existsSync(actualPath)) {
          const expectedStats = fs.statSync(expectedPath);
          const actualStats = fs.statSync(actualPath);
          
          const sizeDiff = Math.abs(expectedStats.size - actualStats.size);
          const sizePercentDiff = expectedStats.size > 0 ? sizeDiff / expectedStats.size : 1;
          
          if (actualStats.size === 0 && expectedStats.size > 0) {
            this.addGap({
              type: 'Empty File',
              severity: 'CRITICAL',
              expected: `${expectedStats.size} bytes`,
              actual: '0 bytes',
              description: `${expectedName} is empty but should contain data`,
              category: 'FILE_SIZE',
              file: expectedName
            });
          } else if (sizePercentDiff > this.tolerance) {
            this.addGap({
              type: 'File Size Mismatch',
              severity: sizePercentDiff > 0.5 ? 'HIGH' : 'MEDIUM',
              expected: `${expectedStats.size} bytes`,
              actual: `${actualStats.size} bytes`,
              description: `File size differs by ${(sizePercentDiff * 100).toFixed(1)}%`,
              category: 'FILE_SIZE',
              file: expectedName
            });
          }
        }
      }
    }
    
    console.log(`📊 File-level gaps identified: ${this.gaps.filter(g => g.category.startsWith('FILE')).length}\n`);
  }

  /**
   * Analyze content-level gaps (data values, row counts, column structure)
   */
  async analyzeContentGaps(actualFiles, expectedFiles) {
    console.log('📊 CONTENT-LEVEL GAP ANALYSIS');
    console.log('=============================');
    
    for (const expectedFile of expectedFiles) {
      const expectedPath = typeof expectedFile === 'string' ? expectedFile : expectedFile.path;
      const expectedName = path.basename(expectedPath);
      
      // Find corresponding actual file
      const actualFile = actualFiles.find(actual => {
        const actualPath = typeof actual === 'string' ? actual : actual.path;
        const actualName = path.basename(actualPath);
        return actualName.includes(expectedName.split('_')[0]) || expectedName.includes(actualName.split('_')[0]);
      });
      
      if (actualFile && fs.existsSync(expectedPath)) {
        const actualPath = typeof actualFile === 'string' ? actualFile : actualFile.path;
        
        if (fs.existsSync(actualPath)) {
          await this.analyzeCsvGaps(actualPath, expectedPath, expectedName);
        }
      }
    }
    
    console.log(`📊 Content-level gaps identified: ${this.gaps.filter(g => !g.category.startsWith('FILE')).length}\n`);
  }

  /**
   * Detailed CSV file gap analysis
   */
  async analyzeCsvGaps(actualPath, expectedPath, fileType) {
    try {
      console.log(`🔍 Analyzing ${fileType}...`);
      
      const actualContent = fs.readFileSync(actualPath, 'utf8');
      const expectedContent = fs.readFileSync(expectedPath, 'utf8');
      
      const actualLines = actualContent.split('\n').filter(line => line.trim());
      const expectedLines = expectedContent.split('\n').filter(line => line.trim());
      
      // Parse CSV data
      const actualData = actualLines.slice(1).map(line => this.parseCsvLine(line, actualLines[0]));
      const expectedData = expectedLines.slice(1).map(line => this.parseCsvLine(line, expectedLines[0]));
      
      // Row count analysis
      if (actualData.length !== expectedData.length) {
        this.addGap({
          type: 'Row Count Mismatch', 
          severity: 'HIGH',
          expected: expectedData.length,
          actual: actualData.length,
          description: `${fileType}: Expected ${expectedData.length} rows, got ${actualData.length} rows`,
          category: 'ROW_COUNT',
          file: fileType
        });
      }
      
      // Column structure analysis
      const actualColumns = actualLines[0] ? actualLines[0].split(',').map(col => col.trim()) : [];
      const expectedColumns = expectedLines[0] ? expectedLines[0].split(',').map(col => col.trim()) : [];
      
      const missingColumns = expectedColumns.filter(col => !actualColumns.includes(col));
      const extraColumns = actualColumns.filter(col => !expectedColumns.includes(col));
      
      missingColumns.forEach(col => {
        this.addGap({
          type: 'Missing Column',
          severity: 'HIGH',
          expected: col,
          actual: 'NOT FOUND',
          description: `${fileType}: Column "${col}" is missing`,
          category: 'COLUMN_STRUCTURE',
          file: fileType
        });
      });
      
      extraColumns.forEach(col => {
        this.addGap({
          type: 'Extra Column',
          severity: 'LOW',
          expected: 'NOT EXPECTED',
          actual: col,
          description: `${fileType}: Unexpected column "${col}"`,
          category: 'COLUMN_STRUCTURE',
          file: fileType
        });
      });
      
      // Data value analysis (row by row comparison)
      const minRows = Math.min(actualData.length, expectedData.length);
      const commonColumns = actualColumns.filter(col => expectedColumns.includes(col));
      
      for (let i = 0; i < minRows; i++) {
        for (let col of commonColumns) {
          const actualVal = actualData[i][col];
          const expectedVal = expectedData[i][col];
          
          if (!this.valuesMatch(actualVal, expectedVal)) {
            const severity = this.getValueSeverity(col, actualVal, expectedVal);
            
            this.addGap({
              type: 'Value Mismatch',
              severity,
              expected: expectedVal,
              actual: actualVal,
              description: `${fileType} Row ${i+1}, Column "${col}": Expected "${expectedVal}", got "${actualVal}"`,
              category: 'DATA_VALUE',
              file: fileType,
              row: i + 1,
              column: col
            });
          }
        }
      }
      
    } catch (error) {
      console.error(`❌ Error analyzing ${fileType}:`, error.message);
      this.addGap({
        type: 'Analysis Error',
        severity: 'CRITICAL',
        expected: 'Successful analysis',
        actual: `Error: ${error.message}`,
        description: `Failed to analyze ${fileType}`,
        category: 'ANALYSIS_ERROR',
        file: fileType
      });
    }
  }

  /**
   * Parse CSV line into object
   */
  parseCsvLine(line, header) {
    const columns = header.split(',').map(col => col.trim());
    const values = line.split(',').map(val => val.trim());
    
    const row = {};
    columns.forEach((col, index) => {
      row[col] = values[index] || '';
    });
    
    return row;
  }

  /**
   * Check if two values match within tolerance
   */
  valuesMatch(actual, expected) {
    // Exact match
    if (actual === expected) return true;
    
    // Both empty/null
    if ((!actual || actual === '') && (!expected || expected === '')) return true;
    
    // Numerical comparison with tolerance
    const actualNum = parseFloat(actual);
    const expectedNum = parseFloat(expected);
    
    if (!isNaN(actualNum) && !isNaN(expectedNum)) {
      if (expectedNum === 0) {
        return actualNum === 0;
      }
      const percentDiff = Math.abs(actualNum - expectedNum) / Math.abs(expectedNum);
      return percentDiff <= this.tolerance;
    }
    
    return false;
  }

  /**
   * Determine severity of value mismatch
   */
  getValueSeverity(column, actualVal, expectedVal) {
    const colLower = column.toLowerCase();
    
    // Critical for key business metrics
    if (colLower.includes('spend') || colLower.includes('revenue') || colLower.includes('cost')) {
      if ((actualVal === '0' || actualVal === '') && parseFloat(expectedVal) > 0) {
        return 'CRITICAL'; // Zero instead of real money values
      }
      return 'HIGH';
    }
    
    // Critical for zero vs non-zero data
    if (actualVal === '0' && parseFloat(expectedVal) > 0) {
      return 'HIGH';
    }
    
    // High for ID mismatches
    if (colLower.includes('id') || colLower.includes('name')) {
      return 'HIGH';
    }
    
    return 'MEDIUM';
  }

  /**
   * Add gap to collection
   */
  addGap(gap) {
    gap.timestamp = new Date().toISOString();
    gap.gapId = this.gaps.length + 1;
    this.gaps.push(gap);
  }

  /**
   * Generate prioritized gap report with 25% batching
   */
  generateGapReport() {
    console.log('📋 GAP ANALYSIS REPORT');
    console.log('=====================');
    
    // Sort gaps by severity and type
    const severityOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
    this.gaps.sort((a, b) => {
      const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
      if (severityDiff !== 0) return severityDiff;
      
      // Secondary sort by category importance
      const categoryOrder = { 'FILE_EXISTENCE': 5, 'ROW_COUNT': 4, 'DATA_VALUE': 3, 'FILE_SIZE': 2, 'COLUMN_STRUCTURE': 1 };
      return (categoryOrder[b.category] || 0) - (categoryOrder[a.category] || 0);
    });
    
    const totalGaps = this.gaps.length;
    const batchSize = Math.max(1, Math.ceil(totalGaps * 0.25)); // 25% batches
    
    // Categorize gaps
    const gapsByCategory = {};
    this.gaps.forEach(gap => {
      if (!gapsByCategory[gap.category]) {
        gapsByCategory[gap.category] = [];
      }
      gapsByCategory[gap.category].push(gap);
    });
    
    // Report summary
    console.log(`📊 Total Gaps Found: ${totalGaps}`);
    console.log(`📦 25% Batch Size: ${batchSize} gaps per iteration\n`);
    
    // Show top gaps
    console.log('🔥 TOP PRIORITY GAPS (First 25%):');
    console.log('=================================');
    this.gaps.slice(0, batchSize).forEach((gap, index) => {
      console.log(`${index + 1}. [${gap.severity}] ${gap.type}`);
      console.log(`   Expected: ${gap.expected}`);
      console.log(`   Actual: ${gap.actual}`);
      console.log(`   ${gap.description}\n`);
    });
    
    const report = {
      totalGaps,
      batchSize,
      gapsByCategory: Object.keys(gapsByCategory).map(category => ({
        category,
        count: gapsByCategory[category].length,
        gaps: gapsByCategory[category]
      })),
      gapsBySeverity: {
        critical: this.gaps.filter(g => g.severity === 'CRITICAL').length,
        high: this.gaps.filter(g => g.severity === 'HIGH').length,
        medium: this.gaps.filter(g => g.severity === 'MEDIUM').length,
        low: this.gaps.filter(g => g.severity === 'LOW').length
      },
      firstBatch: this.gaps.slice(0, batchSize),
      allGaps: this.gaps,
      summary: {
        hasFileGaps: this.gaps.some(g => g.category.startsWith('FILE')),
        hasDataGaps: this.gaps.some(g => g.category === 'DATA_VALUE'),
        hasStructureGaps: this.gaps.some(g => g.category === 'COLUMN_STRUCTURE'),
        isCritical: this.gaps.some(g => g.severity === 'CRITICAL')
      }
    };
    
    return report;
  }

  /**
   * Julius V7 case study example of gap analysis
   */
  static getJuliusV7Example() {
    return {
      gapAnalysisResults: {
        totalGaps: 127,
        criticalGaps: 8,
        firstBatch: [
          {
            type: 'Empty File',
            severity: 'CRITICAL',
            expected: '5.2KB with 40 rows',
            actual: '0 bytes',
            description: 'AdSetLevel_Daily_2025-11-12.csv is completely empty',
            fix: 'Fix Shopify attribution join logic in JuliusV7Engine'
          },
          {
            type: 'Value Mismatch',
            severity: 'CRITICAL',
            expected: '$295.49',
            actual: '$0',
            description: 'Spend values showing zero instead of real amounts',
            fix: 'Fix UTM matching in joinMetaShopify method'
          },
          {
            type: 'Row Count Mismatch',
            severity: 'HIGH',
            expected: '40 rows',
            actual: '77 rows',
            description: 'Too many duplicate rows in AdSet level output',
            fix: 'Add proper deduplication logic'
          }
        ],
        keyPatterns: [
          'All Shopify-attributed values are zero',
          'File generation logic not executing',
          'UTM matching completely failing',
          'Summary calculation field mapping wrong'
        ]
      }
    };
  }
}

module.exports = { GapAnalyzer };