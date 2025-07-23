import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Copy, Check, QrCode } from 'lucide-react';

const QRGenerator: React.FC = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  const appUrl = window.location.origin;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(appUrl)}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'bellhop-qr-code.png';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Header */}
      <div className="sticky top-0 bg-slate-900/90 backdrop-blur-sm border-b border-blue-700/50 z-10">
        <div className="flex items-center px-6 py-4">
          <button
            onClick={() => navigate('/admin')}
            className="mr-4 p-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">QR Code Generator</h1>
        </div>
      </div>

      <div className="px-6 py-8 max-w-md mx-auto">
        {/* QR Code Display */}
        <div className="text-center mb-8">
          <div className="bg-white p-6 rounded-xl inline-block mb-4">
            <img
              src={qrCodeUrl}
              alt="BellhopNow QR Code"
              className="w-64 h-64 mx-auto"
            />
          </div>
          <p className="text-gray-400 text-sm">
            Scan this QR code to access BellhopNow
          </p>
          <p className="text-blue-200 text-sm">
            Scan this QR code to access BellhopNow
          </p>
        </div>

        {/* URL Display */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-blue-200 mb-3">
            App URL
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-slate-800 border border-blue-600 rounded-xl px-4 py-3 text-white text-sm">
              {appUrl}
            </div>
            <button
              onClick={copyToClipboard}
              className="bg-slate-700 hover:bg-slate-600 p-3 rounded-xl transition-colors"
              title="Copy URL"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
          {copied && (
            <p className="text-green-400 text-sm mt-2">URL copied to clipboard!</p>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={downloadQR}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Download QR Code</span>
          </button>

          <button
            onClick={() => navigate('/admin')}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-slate-800/40 rounded-xl border border-blue-700/30">
          <h3 className="text-white font-medium mb-2">Deployment Instructions:</h3>
          <ul className="text-blue-200 text-sm space-y-1">
            <li>• Print the QR code and place in hotel rooms</li>
            <li>• Display in lobby and common areas</li>
            <li>• Include in welcome packets</li>
            <li>• Guests can scan with any camera app</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;