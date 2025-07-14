import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, Send, Settings } from 'lucide-react';
import { logger } from './middleware/logging';
import { setupLoggingEnvironment, validateEnvironment, getEnvironmentInfo } from './utils/env-setup';
import { LogLevel, LogStack, LogPackage } from './types/logging';

function App() {
  const [authToken, setAuthToken] = useState('');
  const [logStack, setLogStack] = useState<LogStack>('frontend');
  const [logLevel, setLogLevel] = useState<LogLevel>('info');
  const [logPackage, setLogPackage] = useState<LogPackage>('api');
  const [message, setMessage] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [envInfo, setEnvInfo] = useState<any>(null);

  useEffect(() => {
    // Setup environment and get info
    const info = getEnvironmentInfo();
    setEnvInfo(info);
    
    // Try to get token from localStorage
    const savedToken = localStorage.getItem('logAuthToken');
    if (savedToken) {
      setAuthToken(savedToken);
      setupLoggingEnvironment({ logAuthToken: savedToken });
    }
  }, []);

  const handleSaveToken = () => {
    if (authToken.trim()) {
      localStorage.setItem('logAuthToken', authToken.trim());
      setupLoggingEnvironment({ logAuthToken: authToken.trim() });
      setError('');
      const info = getEnvironmentInfo();
      setEnvInfo(info);
    }
  };

  const handleSendLog = async () => {
    if (!message.trim()) {
      setError('Message is required');
      return;
    }

    setIsLogging(true);
    setError('');
    setLastResponse(null);

    try {
      const response = await logger.log(logStack, logLevel, logPackage, message, authToken || undefined);
      setLastResponse(response);
      setMessage(''); // Clear message on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLogging(false);
    }
  };

  const runExamples = async () => {
    setIsLogging(true);
    setError('');
    
    try {
      // Run a few example logs
      await logger.info('frontend', 'api', 'Demo: User interface loaded successfully');
      await logger.warn('frontend', 'validation', 'Demo: Form validation warning - email format suspicious');
      await logger.debug('frontend', 'utils', 'Demo: Utility function executed with sample data');
      
      setLastResponse({ success: true, message: 'Example logs sent successfully!' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Example logs failed');
    } finally {
      setIsLogging(false);
    }
  };

  const envValidation = validateEnvironment();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Logging Middleware Demo</h1>
            <p className="text-gray-600">Production-ready logging solution for frontend and backend applications</p>
          </div>

          {/* Environment Status */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Environment Status</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Platform</div>
                <div className="font-semibold text-gray-900">{envInfo?.platform || 'Unknown'}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Auth Token</div>
                <div className={`font-semibold ${envInfo?.hasToken ? 'text-green-600' : 'text-red-600'}`}>
                  {envInfo?.hasToken ? 'Configured' : 'Missing'}
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">API URL</div>
                <div className="font-semibold text-gray-900 text-xs">{envInfo?.apiUrl}</div>
              </div>
            </div>

            {!envValidation.isValid && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Configuration Issues</span>
                </div>
                <ul className="mt-2 text-sm text-red-700">
                  {envValidation.errors.map((err, idx) => (
                    <li key={idx}>• {err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Token Configuration */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Authorization Token</h2>
            <div className="flex gap-3">
              <input
                type="password"
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
                placeholder="Enter your authorization token"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSaveToken}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Token
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Token will be saved locally and used for subsequent log requests
            </p>
          </div>

          {/* Log Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Send Log Entry</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stack</label>
                <select
                  value={logStack}
                  onChange={(e) => setLogStack(e.target.value as LogStack)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                <select
                  value={logLevel}
                  onChange={(e) => setLogLevel(e.target.value as LogLevel)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="debug">Debug</option>
                  <option value="info">Info</option>
                  <option value="warn">Warn</option>
                  <option value="error">Error</option>
                  <option value="fatal">Fatal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package</label>
                <select
                  value={logPackage}
                  onChange={(e) => setLogPackage(e.target.value as LogPackage)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="api">API</option>
                  <option value="handler">Handler</option>
                  <option value="db">Database</option>
                  <option value="auth">Auth</option>
                  <option value="middleware">Middleware</option>
                  <option value="service">Service</option>
                  <option value="controller">Controller</option>
                  <option value="utils">Utils</option>
                  <option value="validation">Validation</option>
                  <option value="cache">Cache</option>
                  <option value="queue">Queue</option>
                  <option value="scheduler">Scheduler</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your log message here..."
                rows={3}
                maxLength={1000}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {message.length}/1000 characters
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSendLog}
                disabled={isLogging || !message.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLogging ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Log
                  </>
                )}
              </button>

              <button
                onClick={runExamples}
                disabled={isLogging}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Run Examples
              </button>
            </div>
          </div>

          {/* Response/Error Display */}
          {(lastResponse || error) && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Response</h2>
              
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-red-800">Error</div>
                    <div className="text-red-700 text-sm mt-1">{error}</div>
                  </div>
                </div>
              )}

              {lastResponse && (
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-green-800">Success</div>
                    <div className="text-green-700 text-sm mt-1">
                      {typeof lastResponse === 'object' ? JSON.stringify(lastResponse, null, 2) : lastResponse}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Documentation Link */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Check the project files for complete documentation, usage examples, and TypeScript types.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;