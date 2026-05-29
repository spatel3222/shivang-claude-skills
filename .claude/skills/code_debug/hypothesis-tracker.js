/**
 * HYPOTHESIS-TRACKER.JS - Todo List Integration for Debugging
 * 
 * Purpose: Proper todo list to make sure you do not lose track of hypotheses and tests
 * 
 * Based on Julius V7 case study where hypothesis tracking revealed:
 * - Initial hypothesis: Database issue (REJECTED after testing)
 * - Second hypothesis: Attribution logic broken (CONFIRMED via UTM matching test)
 * - Third hypothesis: Field mapping error (CONFIRMED via summary calculation test)
 * - Fourth hypothesis: UI display bug separate from data (CONFIRMED via CSV vs UI comparison)
 */

class HypothesisTracker {
  constructor() {
    this.hypotheses = [];
    this.currentHypothesis = null;
    this.testResults = {};
    this.confirmationTests = {};
    this.debugSession = {
      startTime: new Date().toISOString(),
      sessionId: this.generateSessionId(),
      totalHypotheses: 0,
      confirmedHypotheses: 0,
      rejectedHypotheses: 0
    };
  }

  /**
   * Generate unique session ID for debugging session
   */
  generateSessionId() {
    return `debug_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Add a new hypothesis to track
   */
  addHypothesis(description, priority = 'MEDIUM', evidence = []) {
    console.log('💡 ADDING NEW HYPOTHESIS');
    console.log('========================');
    
    const hypothesis = {
      id: `hyp_${this.hypotheses.length + 1}`,
      description,
      priority, // HIGH, MEDIUM, LOW
      evidence,
      status: 'PENDING', // PENDING, TESTING, CONFIRMED, REJECTED
      createdAt: new Date().toISOString(),
      testPlan: [],
      testResults: [],
      smokingGuns: [], // Evidence that strongly supports/rejects hypothesis
      confidence: 0 // 0-100 confidence level
    };
    
    this.hypotheses.push(hypothesis);
    this.debugSession.totalHypotheses++;
    
    console.log(`📝 Hypothesis ${hypothesis.id}: ${description}`);
    console.log(`🎯 Priority: ${priority}`);
    console.log(`📊 Evidence: ${evidence.length} pieces`);
    
    // Auto-prioritize based on priority
    this.sortHypothesesByPriority();
    
    return hypothesis;
  }

  /**
   * Create smoking gun test to validate/reject hypothesis
   */
  createSmokingGunTest(hypothesisId, testDescription, testFunction) {
    console.log('🔫 CREATING SMOKING GUN TEST');
    console.log('============================');
    
    const hypothesis = this.getHypothesis(hypothesisId);
    if (!hypothesis) {
      console.error(`❌ Hypothesis ${hypothesisId} not found`);
      return null;
    }
    
    const test = {
      id: `test_${Date.now()}`,
      hypothesisId,
      description: testDescription,
      testFunction,
      status: 'READY', // READY, RUNNING, COMPLETED
      result: null, // CONFIRMS, REJECTS, INCONCLUSIVE
      evidence: [],
      createdAt: new Date().toISOString(),
      executedAt: null,
      executionTime: null
    };
    
    hypothesis.testPlan.push(test);
    this.confirmationTests[test.id] = test;
    
    console.log(`🧪 Test ${test.id} for ${hypothesis.description}`);
    console.log(`📋 Test: ${testDescription}`);
    
    return test;
  }

  /**
   * Execute smoking gun test
   */
  async executeSmokingGunTest(testId) {
    console.log('🚀 EXECUTING SMOKING GUN TEST');
    console.log('=============================');
    
    const test = this.confirmationTests[testId];
    if (!test) {
      console.error(`❌ Test ${testId} not found`);
      return null;
    }
    
    const hypothesis = this.getHypothesis(test.hypothesisId);
    if (!hypothesis) {
      console.error(`❌ Hypothesis ${test.hypothesisId} not found`);
      return null;
    }
    
    console.log(`🎯 Testing: ${test.description}`);
    console.log(`💡 Hypothesis: ${hypothesis.description}`);
    
    try {
      test.status = 'RUNNING';
      test.executedAt = new Date().toISOString();
      const startTime = Date.now();
      
      // Execute the test function
      const result = await test.testFunction();
      
      test.executionTime = Date.now() - startTime;
      test.status = 'COMPLETED';
      test.result = result.conclusion; // CONFIRMS, REJECTS, INCONCLUSIVE
      test.evidence = result.evidence || [];
      
      // Update hypothesis based on test result
      this.updateHypothesisFromTest(hypothesis, test);
      
      console.log(`📊 Test completed in ${test.executionTime}ms`);
      console.log(`🎯 Result: ${test.result}`);
      console.log(`📋 Evidence: ${test.evidence.length} pieces`);
      
      return test;
      
    } catch (error) {
      test.status = 'COMPLETED';
      test.result = 'ERROR';
      test.evidence = [`Test execution error: ${error.message}`];
      
      console.error(`❌ Test execution failed: ${error.message}`);
      return test;
    }
  }

  /**
   * Update hypothesis confidence based on test results
   */
  updateHypothesisFromTest(hypothesis, test) {
    console.log(`🔄 UPDATING HYPOTHESIS FROM TEST RESULTS`);
    
    hypothesis.testResults.push({
      testId: test.id,
      result: test.result,
      evidence: test.evidence,
      executedAt: test.executedAt
    });
    
    // Update confidence and status based on test results
    if (test.result === 'CONFIRMS') {
      hypothesis.confidence = Math.min(100, hypothesis.confidence + 30);
      hypothesis.smokingGuns.push(...test.evidence);
      
      if (hypothesis.confidence >= 80) {
        hypothesis.status = 'CONFIRMED';
        this.debugSession.confirmedHypotheses++;
        console.log(`✅ HYPOTHESIS CONFIRMED: ${hypothesis.description}`);
      } else {
        hypothesis.status = 'TESTING';
      }
    } else if (test.result === 'REJECTS') {
      hypothesis.confidence = Math.max(0, hypothesis.confidence - 40);
      
      if (hypothesis.confidence <= 20) {
        hypothesis.status = 'REJECTED';
        this.debugSession.rejectedHypotheses++;
        console.log(`❌ HYPOTHESIS REJECTED: ${hypothesis.description}`);
      }
    } else if (test.result === 'INCONCLUSIVE') {
      console.log(`🤷 INCONCLUSIVE: ${hypothesis.description} needs more testing`);
    }
    
    console.log(`📊 Updated confidence: ${hypothesis.confidence}%`);
  }

  /**
   * Get next hypothesis to test (highest priority + highest confidence)
   */
  getNextHypothesisToTest() {
    const pendingHypotheses = this.hypotheses.filter(h => 
      h.status === 'PENDING' || h.status === 'TESTING'
    );
    
    if (pendingHypotheses.length === 0) {
      return null;
    }
    
    // Sort by priority and then by confidence (lowest confidence tested first to eliminate quickly)
    const priorityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
    
    pendingHypotheses.sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // For same priority, test lower confidence first (easier to eliminate)
      return a.confidence - b.confidence;
    });
    
    return pendingHypotheses[0];
  }

  /**
   * Generate todo list for current debugging session
   */
  generateDebuggingTodoList() {
    console.log('📋 DEBUGGING TODO LIST');
    console.log('======================');
    
    const todos = [];
    
    // Active hypothesis testing
    const activeHypotheses = this.hypotheses.filter(h => h.status === 'TESTING');
    activeHypotheses.forEach(hypothesis => {
      const pendingTests = hypothesis.testPlan.filter(test => test.status === 'READY');
      pendingTests.forEach(test => {
        todos.push({
          content: `Execute smoking gun test: ${test.description}`,
          status: 'pending',
          activeForm: `Executing smoking gun test: ${test.description}`,
          priority: hypothesis.priority,
          hypothesisId: hypothesis.id,
          testId: test.id,
          category: 'TEST_EXECUTION'
        });
      });
    });
    
    // Hypothesis validation
    const nextHypothesis = this.getNextHypothesisToTest();
    if (nextHypothesis) {
      todos.push({
        content: `Test hypothesis: ${nextHypothesis.description}`,
        status: 'in_progress',
        activeForm: `Testing hypothesis: ${nextHypothesis.description}`,
        priority: nextHypothesis.priority,
        hypothesisId: nextHypothesis.id,
        category: 'HYPOTHESIS_TESTING'
      });
    }
    
    // Fix implementation for confirmed hypotheses
    const confirmedHypotheses = this.hypotheses.filter(h => h.status === 'CONFIRMED');
    confirmedHypotheses.forEach(hypothesis => {
      todos.push({
        content: `Implement fix based on confirmed hypothesis: ${hypothesis.description}`,
        status: 'pending',
        activeForm: `Implementing fix based on confirmed hypothesis: ${hypothesis.description}`,
        priority: 'HIGH',
        hypothesisId: hypothesis.id,
        category: 'IMPLEMENTATION'
      });
    });
    
    // Verification testing
    const implementedFixes = confirmedHypotheses.filter(h => h.fixImplemented);
    implementedFixes.forEach(hypothesis => {
      todos.push({
        content: `Verify fix works: ${hypothesis.description}`,
        status: 'pending',
        activeForm: `Verifying fix works: ${hypothesis.description}`,
        priority: 'HIGH',
        hypothesisId: hypothesis.id,
        category: 'VERIFICATION'
      });
    });
    
    // Sort todos by priority and category
    const categoryOrder = { 'TEST_EXECUTION': 4, 'HYPOTHESIS_TESTING': 3, 'IMPLEMENTATION': 2, 'VERIFICATION': 1 };
    const priorityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
    
    todos.sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return categoryOrder[b.category] - categoryOrder[a.category];
    });
    
    console.log(`📊 Generated ${todos.length} debugging todos`);
    todos.forEach((todo, index) => {
      const status = todo.status === 'in_progress' ? '🔄' : todo.status === 'pending' ? '⏳' : '✅';
      console.log(`${index + 1}. ${status} [${todo.priority}] ${todo.content}`);
    });
    
    return todos;
  }

  /**
   * Helper functions
   */
  getHypothesis(hypothesisId) {
    return this.hypotheses.find(h => h.id === hypothesisId);
  }

  sortHypothesesByPriority() {
    const priorityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
    this.hypotheses.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  }

  /**
   * Generate debugging session summary
   */
  generateSessionSummary() {
    console.log('📊 DEBUGGING SESSION SUMMARY');
    console.log('============================');
    
    const summary = {
      sessionId: this.debugSession.sessionId,
      startTime: this.debugSession.startTime,
      duration: Date.now() - new Date(this.debugSession.startTime).getTime(),
      totalHypotheses: this.debugSession.totalHypotheses,
      confirmedHypotheses: this.debugSession.confirmedHypotheses,
      rejectedHypotheses: this.debugSession.rejectedHypotheses,
      pendingHypotheses: this.hypotheses.filter(h => h.status === 'PENDING').length,
      testingHypotheses: this.hypotheses.filter(h => h.status === 'TESTING').length,
      totalTests: Object.keys(this.confirmationTests).length,
      completedTests: Object.values(this.confirmationTests).filter(t => t.status === 'COMPLETED').length,
      smokingGuns: this.hypotheses.flatMap(h => h.smokingGuns),
      progress: this.debugSession.totalHypotheses > 0 ? 
        ((this.debugSession.confirmedHypotheses + this.debugSession.rejectedHypotheses) / this.debugSession.totalHypotheses * 100).toFixed(1) : 0
    };
    
    console.log(`⏱️  Session Duration: ${Math.floor(summary.duration / 1000 / 60)} minutes`);
    console.log(`📊 Progress: ${summary.progress}% (${summary.confirmedHypotheses + summary.rejectedHypotheses}/${summary.totalHypotheses} hypotheses tested)`);
    console.log(`✅ Confirmed: ${summary.confirmedHypotheses}`);
    console.log(`❌ Rejected: ${summary.rejectedHypotheses}`);
    console.log(`⏳ Pending: ${summary.pendingHypotheses}`);
    console.log(`🧪 Tests: ${summary.completedTests}/${summary.totalTests} completed`);
    console.log(`🔫 Smoking Guns: ${summary.smokingGuns.length} pieces of evidence`);
    
    return summary;
  }

  /**
   * Julius V7 case study example of hypothesis tracking
   */
  static getJuliusV7Example() {
    return {
      debuggingSession: {
        hypotheses: [
          {
            id: 'hyp_1',
            description: 'Database connection or query is failing',
            priority: 'HIGH',
            status: 'REJECTED',
            confidence: 10,
            smokingGunTest: 'Check if database returns non-empty results for Nov 12',
            result: 'REJECTS - Database returns 1250+ rows correctly',
            timeToReject: '5 minutes'
          },
          {
            id: 'hyp_2', 
            description: 'Shopify attribution join logic is completely broken',
            priority: 'HIGH',
            status: 'CONFIRMED',
            confidence: 95,
            smokingGunTest: 'Add debug logging to joinMetaShopify and count successful matches',
            result: 'CONFIRMS - 0 successful matches out of 1250 attempts',
            evidence: ['UTM field matching failures', 'All Shopify metrics defaulting to 0'],
            timeToConfirm: '10 minutes'
          },
          {
            id: 'hyp_3',
            description: 'Field mapping error in summary calculation causing UI to show $0',
            priority: 'MEDIUM', 
            status: 'CONFIRMED',
            confidence: 85,
            smokingGunTest: 'Compare CSV data vs UI display values',
            result: 'CONFIRMS - CSV has real data, UI shows $0 due to field name mismatch',
            evidence: ['CSV shows 295.49 spend', 'UI calculation looks for row.Spend, data has row.Spent'],
            timeToConfirm: '8 minutes'
          }
        ],
        outcomes: {
          totalTimeDebugging: '45 minutes with hypothesis tracking vs 3+ hours without',
          rootCausesFound: 2,
          fixesImplemented: 2,
          finalResult: 'Julius V7 now generates perfect CSV files with 0 gaps vs reference'
        }
      }
    };
  }
}

module.exports = { HypothesisTracker };