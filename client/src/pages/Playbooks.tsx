import React from 'react';

const Playbooks: React.FC = () => (
  <div className="container mx-auto px-4 py-12 max-w-4xl">
    <h1 className="text-3xl font-bold mb-6 text-blue-800">Digital Playbooks</h1>
    <p className="mb-8 text-gray-600 text-lg">Unlock step-by-step guides and proven frameworks to accelerate your business and career growth. Our digital playbooks are designed by experts and tailored for real-world results.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
        <h2 className="text-xl font-semibold mb-2 text-blue-700">Startup Launch Playbook</h2>
        <p className="text-gray-600 mb-4">A comprehensive guide to take your idea from concept to launch, including market validation, MVP building, and go-to-market strategies.</p>
        <button className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">View Playbook</button>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
        <h2 className="text-xl font-semibold mb-2 text-blue-700">Personal Branding Blueprint</h2>
        <p className="text-gray-600 mb-4">Build a powerful personal brand online and offline. Includes actionable steps for LinkedIn, content, and networking.</p>
        <button className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">View Playbook</button>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
        <h2 className="text-xl font-semibold mb-2 text-blue-700">Growth Marketing Toolkit</h2>
        <p className="text-gray-600 mb-4">Master digital marketing with templates, checklists, and campaign frameworks for rapid growth.</p>
        <button className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">View Playbook</button>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
        <h2 className="text-xl font-semibold mb-2 text-blue-700">Leadership Essentials</h2>
        <p className="text-gray-600 mb-4">Essential skills and frameworks for new and aspiring leaders. Includes feedback, delegation, and team building guides.</p>
        <button className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">View Playbook</button>
      </div>
    </div>
  </div>
);

export default Playbooks;
