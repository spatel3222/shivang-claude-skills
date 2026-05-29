/**
 * INTERROGATOR.JS - Question Framework for Users
 * 
 * Purpose: Keep asking questions until you really know what is actual and expected behavior
 * 
 * Based on Julius V7 case study where systematic questioning revealed:
 * - Actual: Julius V7 generating empty CSV files with 0 bytes
 * - Expected: CSV files with real data matching notebook reference files
 * - Actual: Summary showing $0 Total Spend in UI
 * - Expected: Summary showing real spend values from CSV data
 */

class DebugInterrogator {
  constructor() {
    this.evidence = {
      referenceFiles: [],
      screenshots: [],
      textDescriptions: [],
      actualBehavior: '',
      expectedBehavior: '',
      knownGaps: []
    };
    this.questionPhases = [
      'EVIDENCE_GATHERING',
      'BEHAVIOR_CLARIFICATION', 
      'GAP_IDENTIFICATION',
      'SCOPE_VALIDATION'
    ];
    this.currentPhase = 'EVIDENCE_GATHERING';
  }

  /**
   * Start interrogation process - Ask systematic questions to understand the problem
   */
  async startInterrogation(initialProblem) {
    console.log('🔍 STARTING DEBUG INTERROGATION');
    console.log('================================');
    console.log(`Problem Statement: ${initialProblem}\n`);
    
    const questions = this.generatePhaseQuestions(this.currentPhase);
    return this.askQuestions(questions);
  }

  /**
   * Generate questions based on current phase
   */
  generatePhaseQuestions(phase) {
    const questionSets = {
      'EVIDENCE_GATHERING': [
        "What reference files/screenshots can you provide that show EXPECTED behavior?",
        "What files/outputs are you seeing that show ACTUAL behavior?", 
        "Can you provide a step-by-step description of what you expect to happen?",
        "What specific values/data should appear in the output?",
        "Are there working examples from other systems/environments?"
      ],
      
      'BEHAVIOR_CLARIFICATION': [
        "When you say 'not working', what specifically is different?",
        "What error messages (exact text) are you seeing?", 
        "What data values are missing or incorrect?",
        "Is this a complete failure or partial degradation?",
        "What was the last time this worked correctly?"
      ],
      
      'GAP_IDENTIFICATION': [
        "What are the TOP 3 most obvious differences between actual vs expected?",
        "Are there any patterns in what's broken vs what works?",
        "Is this affecting all data or specific subsets?",
        "Can you quantify the scope (how many rows/records affected)?",
        "Are there any workarounds that currently work?"
      ],
      
      'SCOPE_VALIDATION': [
        "If I fix the top gap first, how will you verify it's actually fixed?",
        "What constitutes 'good enough' vs 'perfect' for this fix?", 
        "Are there any constraints on what I can/cannot change?",
        "What's the impact if this takes longer than expected?",
        "Should I focus on quick wins first or root cause fixes?"
      ]
    };
    
    return questionSets[phase] || [];
  }

  /**
   * Ask questions and gather responses
   */
  async askQuestions(questions) {
    console.log(`📋 ${this.currentPhase} QUESTIONS:`);
    console.log('='.repeat(this.currentPhase.length + 12));
    
    questions.forEach((question, index) => {
      console.log(`${index + 1}. ${question}`);
    });
    
    console.log('\n💡 REMINDER FOR USER:');
    console.log('- Provide reference files, screenshots, text descriptions');
    console.log('- Be specific about expected vs actual behavior'); 
    console.log('- Include exact error messages and data values');
    console.log('- Prioritize the most critical gaps first\n');
    
    return {
      phase: this.currentPhase,
      questions,
      nextPhase: this.getNextPhase(),
      instructions: 'Please answer these questions with specific details, files, and examples'
    };
  }

  /**
   * Process user responses and update evidence
   */
  processResponses(responses) {
    console.log('📝 PROCESSING USER RESPONSES');
    console.log('============================');
    
    // Extract evidence from responses
    if (responses.referenceFiles) {
      this.evidence.referenceFiles = this.evidence.referenceFiles.concat(responses.referenceFiles);
      console.log(`📄 Added ${responses.referenceFiles.length} reference files`);
    }
    
    if (responses.screenshots) {
      this.evidence.screenshots = this.evidence.screenshots.concat(responses.screenshots);  
      console.log(`📸 Added ${responses.screenshots.length} screenshots`);
    }
    
    if (responses.actualBehavior) {
      this.evidence.actualBehavior = responses.actualBehavior;
      console.log(`✅ Actual behavior documented`);
    }
    
    if (responses.expectedBehavior) {
      this.evidence.expectedBehavior = responses.expectedBehavior;
      console.log(`✅ Expected behavior documented`);
    }

    // Determine if we have enough evidence to proceed
    const hasMinimumEvidence = this.evidence.referenceFiles.length > 0 && 
                              this.evidence.actualBehavior && 
                              this.evidence.expectedBehavior;
                              
    if (hasMinimumEvidence) {
      console.log('\n🎯 SUFFICIENT EVIDENCE GATHERED');
      console.log('Ready to proceed to gap analysis');
      return { readyForAnalysis: true, evidence: this.evidence };
    } else {
      // Move to next phase and ask more questions
      this.currentPhase = this.getNextPhase();
      const nextQuestions = this.generatePhaseQuestions(this.currentPhase);
      return this.askQuestions(nextQuestions);
    }
  }

  /**
   * Get next phase in interrogation
   */
  getNextPhase() {
    const currentIndex = this.questionPhases.indexOf(this.currentPhase);
    const nextIndex = (currentIndex + 1) % this.questionPhases.length;
    return this.questionPhases[nextIndex];
  }

  /**
   * Generate summary of gathered evidence
   */
  generateEvidenceSummary() {
    return {
      evidenceCount: {
        referenceFiles: this.evidence.referenceFiles.length,
        screenshots: this.evidence.screenshots.length,
        descriptions: this.evidence.textDescriptions.length
      },
      behaviors: {
        actual: this.evidence.actualBehavior || 'NOT SPECIFIED',
        expected: this.evidence.expectedBehavior || 'NOT SPECIFIED'  
      },
      readyForAnalysis: this.evidence.referenceFiles.length > 0 && 
                       this.evidence.actualBehavior && 
                       this.evidence.expectedBehavior
    };
  }

  /**
   * Julius V7 case study example of good interrogation
   */
  static getJuliusV7Example() {
    return {
      problemStatement: "Julius V7 engine not working correctly",
      
      interrogationResults: {
        actualBehavior: "CSV files generated with 0 bytes (empty), UI shows $0 total spend",
        expectedBehavior: "CSV files with real data matching notebook reference files, UI shows actual spend values",
        referenceFiles: [
          'TopLevel_Daily_2025-11-12.csv',
          'AdSetLevel_Daily_2025-11-12.csv', 
          'AdLevel_Daily_2025-11-12.csv'
        ],
        keyEvidence: [
          "Screenshot showing $0 Total Spend in UI",
          "Empty CSV files vs reference files with real data",
          "Database contains real data but not appearing in output"
        ],
        criticalQuestions: [
          "Are the CSV files completely empty or just showing zeros?",
          "What specific data should appear in each CSV file?",
          "Is the database query returning data correctly?", 
          "Is this an attribution logic issue or data processing issue?"
        ],
        smokingGuns: [
          "UTM matching failures in Shopify attribution join",
          "Field mapping errors in summary calculation (Spent vs Spend)",
          "Empty AdSet/Ad level outputs due to join logic bugs"
        ]
      }
    };
  }
}

module.exports = { DebugInterrogator };