import React from 'react';
import { Download, Upload, Menu } from 'lucide-react';
import { Annotation } from '../../types/timeline';

interface MenuBarProps {
  onImport: () => void;
  onExport: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({ onImport, onExport }) => {
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Menu className="h-6 w-6 text-gray-500 mr-2" />
            <h1 className="text-xl font-semibold text-gray-900">Timeline Viewer</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onImport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </button>
            <button
              onClick={onExport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};