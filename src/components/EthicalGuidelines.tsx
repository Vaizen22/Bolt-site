import React, { useState } from 'react';
import { Shield, ChevronDown, ChevronUp, ExternalLink, AlertTriangle } from 'lucide-react';

const EthicalGuidelines: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-6">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <Shield className="text-yellow-600" size={24} />
          <h2 className="text-lg font-semibold text-yellow-800">Web Scraping Ethics & Best Practices</h2>
        </div>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4 text-sm text-yellow-800">
          <div className="flex items-start space-x-2">
            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold mb-2">⚠️ Important Legal and Ethical Considerations:</p>
              <ul className="space-y-2 list-disc list-inside ml-4">
                <li><strong>Robots.txt Compliance:</strong> Always check and respect the robots.txt file</li>
                <li><strong>Rate Limiting:</strong> Implement delays between requests to avoid overloading servers</li>
                <li><strong>Terms of Service:</strong> Review and comply with the website's terms of service</li>
                <li><strong>Copyright & Data Rights:</strong> Respect intellectual property and data ownership</li>
                <li><strong>Personal Data:</strong> Be mindful of privacy laws (GDPR, CCPA) when handling personal data</li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-4 rounded border-l-4 border-blue-500">
            <h3 className="font-semibold mb-2">Technical Implementation Best Practices:</h3>
            <ul className="space-y-1 list-disc list-inside text-xs">
              <li>Use proper User-Agent headers to identify your scraper</li>
              <li>Implement exponential backoff for failed requests</li>
              <li>Cache responses when appropriate to minimize requests</li>
              <li>Use headless browsers for JavaScript-heavy sites</li>
              <li>Monitor for changes in website structure</li>
              <li>Handle errors gracefully and log appropriately</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded border-l-4 border-green-500">
            <h3 className="font-semibold mb-2">Alternative Approaches to Consider:</h3>
            <ul className="space-y-1 list-disc list-inside text-xs">
              <li>Check if the website provides an official API</li>
              <li>Contact the website owners for data partnerships</li>
              <li>Use publicly available datasets when possible</li>
              <li>Consider RSS feeds or other structured data formats</li>
            </ul>
          </div>

          <p className="text-xs italic">
            This tool is for educational purposes. Always ensure your scraping activities are legal and ethical 
            in your jurisdiction and comply with the target website's terms of service.
          </p>
        </div>
      )}
    </div>
  );
};

export default EthicalGuidelines;