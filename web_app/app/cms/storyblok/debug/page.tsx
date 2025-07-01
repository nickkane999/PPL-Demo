"use client";

import { useState, useEffect } from "react";
import { getCMSClient } from "@/lib/cms/factory";
import { StoryblokClient } from "@/lib/cms/clients/storyblok";

interface TestResult {
  test: string;
  success: boolean;
  data?: any;
  error?: string;
  details?: string;
  response?: any;
}

export default function StoryblokDebugPage() {
  const [config, setConfig] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [connectionTest, setConnectionTest] = useState<string>("Not tested");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [envVars, setEnvVars] = useState<any>({});

  useEffect(() => {
    // Check environment variables
    const env = {
      publicToken: process.env.NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN,
      previewToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN,
      spaceId: process.env.NEXT_PUBLIC_STORYBLOK_SPACE_ID,
      region: process.env.NEXT_PUBLIC_STORYBLOK_REGION,
      version: process.env.NEXT_PUBLIC_STORYBLOK_VERSION,
    };
    setEnvVars(env);

    try {
      console.log("🔧 Getting CMS client and debug info...");
      const client = getCMSClient() as StoryblokClient;
      const cmsConfig = client.getConfig();
      const cmsDebugInfo = client.getDebugInfo();

      setConfig(cmsConfig);
      setDebugInfo(cmsDebugInfo);

      console.log("🔧 Storyblok Debug Info:", { config: cmsConfig, debug: cmsDebugInfo });

      // Run basic connection test
      const testConnection = async () => {
        try {
          console.log("🧪 Testing basic connection...");
          const storiesResponse = await client.getStories({
            version: "published",
            page: 1,
            perPage: 5,
          });
          console.log("✅ Basic connection successful:", storiesResponse);
          setConnectionTest("✅ Connected successfully");
        } catch (error: any) {
          console.error("❌ Basic connection failed:", error);
          setConnectionTest(`❌ Connection failed: ${error.message}`);

          if (error.message.includes("401") || error.message.includes("Unauthorized")) {
            console.log("⚠️ Published content failed, trying draft...");
            try {
              const draftStories = await client.getStories({
                version: "draft",
                page: 1,
                perPage: 5,
              });
              console.log("✅ Draft connection successful:", draftStories);
              setConnectionTest("✅ Connected to draft content (preview token working)");
            } catch (draftError: any) {
              console.error("❌ Draft connection also failed:", draftError);
              setConnectionTest(`❌ Both published and draft failed: ${draftError.message}`);
            }
          }
        }
      };

      testConnection();
    } catch (error: any) {
      console.error("💥 Failed to initialize:", error);
      setConnectionTest(`💥 Failed to initialize: ${error.message}`);
    }
  }, []);

  const runDiagnosticTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    const results: TestResult[] = [];

    try {
      const client = getCMSClient() as StoryblokClient;
      const config = client.getConfig();

      // Determine the correct API base URL (using main endpoint like your working URL)
      const apiBase = "https://api.storyblok.com/v2";

      // Test 1: Basic space info
      try {
        console.log("🧪 Test 1: Fetching space info...");
        const response = await fetch(`${apiBase}/cdn/spaces/me?token=${config.storyblok?.accessToken}`);
        const responseText = await response.text();

        if (response.ok) {
          const spaceData = JSON.parse(responseText);
          results.push({
            test: "Space Information",
            success: true,
            data: spaceData.space,
            details: `Space: ${spaceData.space?.name}, ID: ${spaceData.space?.id}, Region: ${spaceData.space?.region}`,
            response: { status: response.status, headers: Object.fromEntries(response.headers.entries()) },
          });
        } else {
          results.push({
            test: "Space Information",
            success: false,
            error: `${response.status}: ${response.statusText}`,
            details: responseText,
            response: { status: response.status, headers: Object.fromEntries(response.headers.entries()) },
          });
        }
      } catch (error: any) {
        results.push({
          test: "Space Information",
          success: false,
          error: error.message,
          details: "Network error or invalid response",
        });
      }

      // Test 2: Direct token test with both tokens
      const tokensToTest = [
        { name: "Current Active Token", token: config.storyblok?.accessToken, type: "active" },
        { name: "Public Token", token: envVars.publicToken, type: "public" },
        { name: "Preview Token", token: envVars.previewToken, type: "preview" },
      ].filter((t) => t.token && t.token.length > 0);

      for (const tokenTest of tokensToTest) {
        try {
          console.log(`🧪 Testing ${tokenTest.name}...`);
          const response = await fetch(`${apiBase}/cdn/stories?token=${tokenTest.token}&version=published&per_page=1`);
          const responseText = await response.text();

          if (response.ok) {
            const data = JSON.parse(responseText);
            results.push({
              test: `${tokenTest.name} (${tokenTest.type})`,
              success: true,
              data: data,
              details: `Found ${data.stories?.length || 0} stories. Token: ${tokenTest.token.substring(0, 8)}...`,
              response: { status: response.status, headers: Object.fromEntries(response.headers.entries()) },
            });
          } else {
            results.push({
              test: `${tokenTest.name} (${tokenTest.type})`,
              success: false,
              error: `${response.status}: ${response.statusText}`,
              details: `Token: ${tokenTest.token.substring(0, 8)}... | Response: ${responseText}`,
              response: { status: response.status, headers: Object.fromEntries(response.headers.entries()) },
            });
          }
        } catch (error: any) {
          results.push({
            test: `${tokenTest.name} (${tokenTest.type})`,
            success: false,
            error: error.message,
            details: `Token: ${tokenTest.token.substring(0, 8)}...`,
          });
        }
      }

      // Test 3: Different regions (including main API endpoint)
      const regionsToTest = [
        { name: "Main API (no region)", url: "https://api.storyblok.com/v2" },
        { name: "US Region", url: "https://api-us.storyblok.com/v2" },
        { name: "EU Region", url: "https://api-eu.storyblok.com/v2" },
        { name: "Asia Pacific", url: "https://api-ap.storyblok.com/v2" },
        { name: "Canada", url: "https://api-ca.storyblok.com/v2" },
        { name: "China", url: "https://api-cn.storyblok.com/v2" },
      ];

      for (const regionTest of regionsToTest) {
        try {
          console.log(`🧪 Testing ${regionTest.name}...`);
          const response = await fetch(`${regionTest.url}/cdn/spaces/me?token=${config.storyblok?.accessToken}`);
          const responseText = await response.text();

          if (response.ok) {
            const data = JSON.parse(responseText);
            results.push({
              test: `Region Test: ${regionTest.name}`,
              success: true,
              data: data.space,
              details: `✅ Space found via ${regionTest.name}: ${data.space?.name} (${data.space?.id})`,
              response: { status: response.status },
            });
          } else {
            results.push({
              test: `Region Test: ${regionTest.name}`,
              success: false,
              error: `${response.status}: ${response.statusText}`,
              details: responseText,
              response: { status: response.status },
            });
          }
        } catch (error: any) {
          results.push({
            test: `Region Test: ${regionTest.name}`,
            success: false,
            error: error.message,
            details: "Network error",
          });
        }
      }

      // Test 4: Detailed API analysis
      try {
        console.log("🧪 Detailed API analysis...");
        const testUrl = `${apiBase}/cdn/stories?token=${config.storyblok?.accessToken}&version=published&per_page=1`;
        console.log("Test URL:", testUrl);

        const response = await fetch(testUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "User-Agent": "PPL-Demo-App/1.0",
          },
        });

        const responseHeaders = Object.fromEntries(response.headers.entries());
        const responseText = await response.text();

        results.push({
          test: "Detailed API Analysis",
          success: response.ok,
          error: response.ok ? undefined : `${response.status}: ${response.statusText}`,
          details: `URL: ${testUrl}\nResponse: ${responseText}`,
          response: {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
            body: responseText,
          },
        });
      } catch (error: any) {
        results.push({
          test: "Detailed API Analysis",
          success: false,
          error: error.message,
          details: "Network error during detailed analysis",
        });
      }

      // Test 5: Token validation by attempting to access Management API (should fail with proper error)
      try {
        console.log("🧪 Test: Token type validation...");
        const response = await fetch(`https://mapi.storyblok.com/v1/spaces/${config.storyblok?.spaceId || "285494041849876"}/stories`, {
          method: "GET",
          headers: {
            Authorization: config.storyblok?.accessToken || "",
          },
        });

        if (response.status === 401) {
          results.push({
            test: "Token Type Validation",
            success: true,
            details: "✅ Token is correctly a Content Delivery API token (not Management API)",
          });
        } else {
          results.push({
            test: "Token Type Validation",
            success: false,
            error: `Unexpected response: ${response.status}`,
            details: "Token might be a Management API token or have unexpected permissions",
          });
        }
      } catch (error: any) {
        results.push({
          test: "Token Type Validation",
          success: false,
          error: error.message,
          details: "Could not validate token type",
        });
      }
    } catch (error: any) {
      results.push({
        test: "Diagnostic Setup",
        success: false,
        error: error.message,
        details: "Failed to set up diagnostic tests",
      });
    }

    setTestResults(results);
    setIsRunningTests(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Storyblok Advanced Diagnostics</h1>
            <a href="/cms/storyblok" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
              ← Back to Main
            </a>
          </div>

          {/* Connection Status */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Connection Status</h2>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-lg">{connectionTest}</p>
            </div>
          </div>

          {/* Environment Variables */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Environment Variables</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p>
                    <strong>Public Token:</strong> {envVars.publicToken ? `${envVars.publicToken.substring(0, 8)}... (${envVars.publicToken.length} chars)` : "Not set"}
                  </p>
                  <p>
                    <strong>Preview Token:</strong> {envVars.previewToken ? `${envVars.previewToken.substring(0, 8)}... (${envVars.previewToken.length} chars)` : "Not set"}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Space ID:</strong> {envVars.spaceId || "Not set"}
                  </p>
                  <p>
                    <strong>Region:</strong> {envVars.region || "Default (us)"}
                  </p>
                  <p>
                    <strong>Version:</strong> {envVars.version || "Default (published)"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration */}
          {config && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Active Configuration</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p>
                      <strong>CMS Provider:</strong> {config.provider}
                    </p>
                    <p>
                      <strong>Region:</strong> {config.storyblok?.region || "Not set"}
                    </p>
                    <p>
                      <strong>Space ID:</strong> {config.storyblok?.spaceId || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Access Token:</strong> {config.storyblok?.accessToken ? `${config.storyblok.accessToken.substring(0, 8)}... (${config.storyblok.accessToken.length} chars)` : "Not set"}
                    </p>
                    <p>
                      <strong>Version:</strong> {config.storyblok?.version || "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Diagnostic Tests */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Advanced Diagnostics</h2>
              <button onClick={runDiagnosticTests} disabled={isRunningTests} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg">
                {isRunningTests ? "Running Tests..." : "Run API Tests"}
              </button>
            </div>

            {testResults.length > 0 && (
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${result.success ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{result.test}</h3>
                      <span className={`px-2 py-1 rounded text-sm ${result.success ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>{result.success ? "PASS" : "FAIL"}</span>
                    </div>
                    {result.error && (
                      <p className="text-red-600 mt-2">
                        <strong>Error:</strong> {result.error}
                      </p>
                    )}
                    {result.details && (
                      <p className="text-gray-600 mt-2">
                        <strong>Details:</strong> {result.details}
                      </p>
                    )}
                    {result.response && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-purple-600 hover:text-purple-800">View Response Details</summary>
                        <pre className="bg-gray-100 p-2 rounded text-xs mt-2 overflow-auto max-h-40">{JSON.stringify(result.response, null, 2)}</pre>
                      </details>
                    )}
                    {result.data && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-blue-600 hover:text-blue-800">View Data</summary>
                        <pre className="bg-gray-100 p-2 rounded text-xs mt-2 overflow-auto max-h-40">{JSON.stringify(result.data, null, 2)}</pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Debug Information */}
          {debugInfo && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Debug Information</h2>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-60">{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}

          {/* Troubleshooting Guide */}
          <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
            <h2 className="text-xl font-semibold mb-4">🔧 Troubleshooting Guide</h2>
            <div className="space-y-3 text-sm">
              <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <p>
                  <strong>🎉 API Endpoint Fixed:</strong>
                </p>
                <p>
                  The client now uses the correct endpoint: <code>https://api.storyblok.com/v2/cdn/stories</code>
                </p>
                <p>
                  This matches your working URL format: <code>https://api.storyblok.com/v2/cdn/stories?token=...</code>
                </p>
              </div>

              <p>
                <strong>If you're still getting 401 Unauthorized errors:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Verify the token was generated from the correct Storyblok space</li>
                <li>Check if your space has published content</li>
                <li>Try regenerating both tokens in your Storyblok space settings</li>
                <li>Ensure your space ID matches your actual space</li>
              </ul>

              <p className="mt-4">
                <strong>Next Steps:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Run the "Advanced Diagnostics" above to test all scenarios</li>
                <li>
                  Go to your Storyblok space:{" "}
                  <a href="https://app.storyblok.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    https://app.storyblok.com/
                  </a>
                </li>
                <li>Navigate to Settings → Access tokens</li>
                <li>Verify the Space ID in the URL matches: {config?.storyblok?.spaceId}</li>
                <li>Regenerate both the Public and Preview tokens if needed</li>
                <li>Update your environment variables with the new tokens</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
