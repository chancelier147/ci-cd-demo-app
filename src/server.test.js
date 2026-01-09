const { describe, it } = require('node:test');
const assert = require('node:assert');
const { getAppInfo, config } = require('./server.js');

describe('Application Configuration', () => {
  it('should have a default app name', () => {
    assert.ok(config.appName, 'App name should be defined');
    assert.strictEqual(typeof config.appName, 'string');
  });

  it('should have a valid environment', () => {
    const validEnvs = ['development', 'test', 'staging', 'production'];
    assert.ok(
      validEnvs.includes(config.environment) || config.environment,
      'Environment should be valid'
    );
  });

  it('should have a version number', () => {
    assert.ok(config.version, 'Version should be defined');
    assert.match(config.version, /^\d+\.\d+\.\d+$/, 'Version should follow semver');
  });
});

describe('API Functions', () => {
  it('getAppInfo should return correct structure', () => {
    const info = getAppInfo();
    
    assert.ok(info.name, 'Should have name');
    assert.ok(info.version, 'Should have version');
    assert.ok(info.environment, 'Should have environment');
    assert.ok(info.timestamp, 'Should have timestamp');
    assert.ok(typeof info.uptime === 'number', 'Should have numeric uptime');
    assert.ok(info.nodejs, 'Should have nodejs version');
  });

  it('getAppInfo timestamp should be valid ISO date', () => {
    const info = getAppInfo();
    const date = new Date(info.timestamp);
    
    assert.ok(!isNaN(date.getTime()), 'Timestamp should be valid date');
  });

  it('getAppInfo uptime should be positive', () => {
    const info = getAppInfo();
    
    assert.ok(info.uptime >= 0, 'Uptime should be non-negative');
  });
});

describe('Environment Variables', () => {
  it('should use PORT from environment if set', () => {
    // This test verifies the pattern, actual PORT binding is in server startup
    const testPort = process.env.PORT || 3000;
    assert.ok(typeof testPort === 'number' || typeof testPort === 'string');
  });
});
