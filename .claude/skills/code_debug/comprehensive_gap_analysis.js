const fs = require('fs');
const csv = require('csv-parser');
const { Transform } = require('stream');

class ComprehensiveGapAnalysis {
  constructor() {
    this.gaps = [];
    this.tolerance = 0.01; // 1% tolerance for numerical comparison
  }

  async analyzeCsvGaps(juliusFile, referenceFile, fileType) {
    console.log(`\n📊 Analyzing ${fileType}:`);
    console.log(`  Julius V7: ${juliusFile}`);
    console.log(`  Reference: ${referenceFile}`);
    
    try {
      const juliusData = await this.loadCsvData(juliusFile);
      const referenceData = await this.loadCsvData(referenceFile);
      
      console.log(`  Julius rows: ${juliusData.length}, Reference rows: ${referenceData.length}`);
      
      const fileGaps = [];
      
      // Row count gap
      if (juliusData.length !== referenceData.length) {
        fileGaps.push({
          type: 'Row Count Mismatch',
          severity: 'HIGH',
          julius: juliusData.length,
          reference: referenceData.length,
          description: `Julius has ${juliusData.length} rows vs reference ${referenceData.length} rows`,
          fileType
        });
      }
      
      // Column structure gaps
      if (juliusData.length > 0 && referenceData.length > 0) {
        const juliusColumns = Object.keys(juliusData[0]).sort();
        const referenceColumns = Object.keys(referenceData[0]).sort();
        
        const missingInJulius = referenceColumns.filter(col => !juliusColumns.includes(col));
        const extraInJulius = juliusColumns.filter(col => !referenceColumns.includes(col));
        
        missingInJulius.forEach(col => {
          fileGaps.push({
            type: 'Missing Column',
            severity: 'HIGH', 
            column: col,
            description: `Column "${col}" missing in Julius output`,
            fileType
          });
        });
        
        extraInJulius.forEach(col => {
          fileGaps.push({
            type: 'Extra Column',
            severity: 'LOW',
            column: col,
            description: `Column "${col}" exists in Julius but not reference`,
            fileType
          });
        });
        
        // Data value gaps (row by row comparison)
        const minRows = Math.min(juliusData.length, referenceData.length);
        const commonColumns = juliusColumns.filter(col => referenceColumns.includes(col));
        
        for (let i = 0; i < minRows; i++) {
          for (let col of commonColumns) {
            const juliusVal = juliusData[i][col];
            const refVal = referenceData[i][col];
            
            if (!this.valuesMatch(juliusVal, refVal)) {
              fileGaps.push({
                type: 'Value Mismatch',
                severity: this.getValueSeverity(col, juliusVal, refVal),
                row: i + 1,
                column: col,
                julius: juliusVal,
                reference: refVal,
                description: `Row ${i+1}, Column "${col}": Julius="${juliusVal}" vs Reference="${refVal}"`,
                fileType
              });
            }
          }
        }
      }
      
      this.gaps.push(...fileGaps);
      console.log(`  Found ${fileGaps.length} gaps`);
      return fileGaps;
      
    } catch (error) {
      console.error(`❌ Error analyzing ${fileType}:`, error.message);
      this.gaps.push({
        type: 'File Error',
        severity: 'CRITICAL',
        description: `Cannot analyze ${fileType}: ${error.message}`,
        fileType
      });
      return [];
    }
  }
  
  valuesMatch(val1, val2) {
    // Handle null/undefined/empty
    if (val1 == val2) return true;
    if ((val1 === '' || val1 == null) && (val2 === '' || val2 == null)) return true;
    
    // Numerical comparison with tolerance
    const num1 = this.parseNumber(val1);
    const num2 = this.parseNumber(val2);
    
    if (!isNaN(num1) && !isNaN(num2)) {
      const diff = Math.abs(num1 - num2);
      const maxVal = Math.max(Math.abs(num1), Math.abs(num2));
      return maxVal === 0 ? diff === 0 : (diff / maxVal) <= this.tolerance;
    }
    
    // String comparison
    return String(val1).trim() === String(val2).trim();
  }
  
  parseNumber(val) {
    if (val === '' || val == null) return NaN;
    const num = parseFloat(String(val).replace(/[,%$]/g, ''));
    return isNaN(num) ? NaN : num;
  }
  
  getValueSeverity(column, juliusVal, refVal) {
    // Critical fields that must match exactly
    const criticalFields = ['Date', 'Day', 'Campaign name', 'Ad Set Name', 'Ad name'];
    if (criticalFields.includes(column)) return 'CRITICAL';
    
    // High importance metrics
    const highImportanceFields = ['Spent', 'Users', 'Conversions', 'Meta Spend', 'Google Spend'];
    if (highImportanceFields.includes(column)) return 'HIGH';
    
    // Check for significant percentage differences
    const julius = this.parseNumber(juliusVal);
    const ref = this.parseNumber(refVal);
    
    if (!isNaN(julius) && !isNaN(ref)) {
      const maxVal = Math.max(Math.abs(julius), Math.abs(ref));
      if (maxVal > 0) {
        const percentDiff = Math.abs(julius - ref) / maxVal;
        if (percentDiff > 0.5) return 'HIGH';
        if (percentDiff > 0.1) return 'MEDIUM';
      }
    }
    
    return 'LOW';
  }
  
  loadCsvData(filePath) {
    return new Promise((resolve, reject) => {
      const data = [];
      
      if (!fs.existsSync(filePath)) {
        reject(new Error(`File not found: ${filePath}`));
        return;
      }
      
      const stream = fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          data.push(row);
        })
        .on('end', () => {
          resolve(data);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
  
  generateGapReport() {
    console.log('\n🔍 COMPREHENSIVE GAP ANALYSIS REPORT');
    console.log('=====================================\n');
    
    // Sort gaps by severity and count
    const gapCounts = this.gaps.reduce((acc, gap) => {
      acc[gap.severity] = (acc[gap.severity] || 0) + 1;
      return acc;
    }, {});
    
    console.log('📊 Gap Summary:');
    ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].forEach(severity => {
      if (gapCounts[severity]) {
        console.log(`  ${severity}: ${gapCounts[severity]} gaps`);
      }
    });
    
    const totalGaps = this.gaps.length;
    console.log(`  TOTAL: ${totalGaps} gaps\n`);
    
    if (totalGaps === 0) {
      console.log('✅ No gaps found! Julius V7 matches reference perfectly.');
      return;
    }
    
    // Sort by severity priority
    const severityOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
    this.gaps.sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]);
    
    console.log('📋 Detailed Gap List (sorted by priority):');
    console.log('==========================================\n');
    
    this.gaps.forEach((gap, index) => {
      console.log(`${index + 1}. [${gap.severity}] ${gap.type} - ${gap.fileType}`);
      console.log(`   ${gap.description}`);
      if (gap.julius !== undefined || gap.reference !== undefined) {
        console.log(`   Julius: "${gap.julius}" | Reference: "${gap.reference}"`);
      }
      console.log('');
    });
    
    // Calculate 25% batches for fixing
    const batchSize = Math.ceil(totalGaps * 0.25);
    console.log(`🔧 Fixing Strategy (25% batches):`);
    console.log(`  Batch size: ${batchSize} gaps`);
    console.log(`  Batch 1 (Priority): Gaps 1-${Math.min(batchSize, totalGaps)}`);
    console.log(`  Batch 2: Gaps ${batchSize + 1}-${Math.min(batchSize * 2, totalGaps)}`);
    console.log(`  Batch 3: Gaps ${batchSize * 2 + 1}-${Math.min(batchSize * 3, totalGaps)}`);
    console.log(`  Batch 4: Gaps ${batchSize * 3 + 1}-${totalGaps}\n`);
    
    return {
      totalGaps,
      gapCounts,
      batchSize,
      priorityBatch: this.gaps.slice(0, batchSize),
      allGaps: this.gaps
    };
  }
  
  async runFullAnalysis() {
    console.log('🚀 Starting Comprehensive Gap Analysis for Nov 12, 2025');
    console.log('======================================================');
    
    // Julius V7 files (OLD OUTPUT - with all zeros from failed attribution)
    const oldJuliusFiles = {
      daily: 'outputs/daily_summary_2025-11-12_to_2025-11-12_2025-11-13_1763054439412.csv',
      adset: 'outputs/adset_performance_2025-11-12_to_2025-11-12_2025-11-13_1763054439412.csv',
      ad: 'outputs/ad_performance_2025-11-12_to_2025-11-12_2025-11-13_1763054439412.csv'
    };
    
    // NEW Julius V7 files (FIXED OUTPUT - with attribution fix applied)
    const newJuliusFiles = {
      daily: 'outputs/TopLevel_Daily_2025-11-12.csv',   // Nov 14 11:17 - NEW with Shopify attribution fix
      adset: 'outputs/AdSetLevel_Daily_2025-11-12.csv',  // Nov 14 11:17 - NEW with Shopify attribution fix
      ad: 'outputs/AdLevel_Daily_2025-11-12.csv'         // Nov 14 11:17 - NEW with Shopify attribution fix
    };
    
    // Analyze OLD vs NEW Julius V7 files to measure improvement
    await this.analyzeCsvGaps(oldJuliusFiles.daily, newJuliusFiles.daily, 'Daily Summary');
    await this.analyzeCsvGaps(oldJuliusFiles.adset, newJuliusFiles.adset, 'Ad Set Level');
    await this.analyzeCsvGaps(oldJuliusFiles.ad, newJuliusFiles.ad, 'Ad Level');
    
    return this.generateGapReport();
  }
}

// Run analysis if called directly
if (require.main === module) {
  const analyzer = new ComprehensiveGapAnalysis();
  analyzer.runFullAnalysis()
    .then((report) => {
      if (report && report.totalGaps > 0) {
        console.log(`🎯 Next Action: Fix first ${report.batchSize} gaps (25% batch) and re-test`);
        process.exit(1); // Exit with error code to indicate gaps found
      } else {
        console.log('🎉 Analysis complete - no gaps found!');
        process.exit(0);
      }
    })
    .catch((error) => {
      console.error('❌ Analysis failed:', error);
      process.exit(1);
    });
}

module.exports = { ComprehensiveGapAnalysis };