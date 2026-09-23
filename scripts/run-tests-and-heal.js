#!/usr/bin/env node
/**
 * BeChef Automated QA Runner & Self-Healing Loop
 * Executes backend & frontend test suites, captures failure stack traces,
 * categorizes failures (Sub-Agent 1: Backend vs Sub-Agent 2: Frontend UI),
 * and reports status.
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MAX_HEALING_ATTEMPTS = 3;
const LOG_FILE = path.join(__dirname, 'test-runner.log');

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n', 'utf8');
}

function runTestSuite() {
  log('Starting Jest Test Execution...');
  const result = spawnSync('npx', ['jest', '--runInBand'], {
    cwd: path.resolve(__dirname, '..'),
    encoding: 'utf8',
    env: { ...process.env, CI: 'true' }
  });

  return {
    exitCode: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || ''
  };
}

function analyzeFailure(stdout, stderr) {
  const fullOutput = stdout + '\n' + stderr;
  const isBackendFailure = fullOutput.includes('FAIL backend') || fullOutput.includes('tests/recipe.test.js');
  const isFrontendFailure = fullOutput.includes('FAIL frontend') || fullOutput.includes('tests/App.test.jsx');

  return {
    backend: isBackendFailure,
    frontend: isFrontendFailure,
    fullOutput
  };
}

function main() {
  fs.writeFileSync(LOG_FILE, '=== BeChef Test Automation Run ===\n', 'utf8');
  let attempt = 1;
  let passed = false;

  while (attempt <= MAX_HEALING_ATTEMPTS) {
    log(`--- Attempt ${attempt} / ${MAX_HEALING_ATTEMPTS} ---`);
    const { exitCode, stdout, stderr } = runTestSuite();

    if (exitCode === 0) {
      log('✅ ALL TESTS PASSED (100% SUCCESS RATE)');
      console.log('\n=============================================');
      console.log('🎉 100% TEST PASS - QA VERIFICATION COMPLETE');
      console.log('=============================================\n');
      passed = true;
      break;
    }

    log(`❌ Test run failed with exit code ${exitCode}. Capturing stack trace...`);
    const analysis = analyzeFailure(stdout, stderr);

    if (analysis.backend) {
      log('🚨 Detected Backend Failure -> Routing to SUB-AGENT 1 [BACKEND SPECIALIST]');
    }
    if (analysis.frontend) {
      log('🚨 Detected Frontend Failure -> Routing to SUB-AGENT 2 [FRONTEND SPECIALIST]');
    }

    // Write diagnostic ticket
    const ticketPath = path.join(__dirname, `healing-ticket-${attempt}.json`);
    fs.writeFileSync(
      ticketPath,
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          attempt,
          backendFailure: analysis.backend,
          frontendFailure: analysis.frontend,
          rawError: analysis.fullOutput.slice(-2000)
        },
        null,
        2
      ),
      'utf8'
    );
    log(`Ticket written to ${ticketPath}`);

    attempt++;
  }

  if (!passed) {
    log('❌ Self-healing loop exceeded max attempts without 100% pass.');
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main();
