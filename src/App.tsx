import React from 'react';
import { Timeline } from './components/Timeline';
import { sampleData } from './data/sampleData';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Timeline data={sampleData} />
    </div>
  );
}

export default App;