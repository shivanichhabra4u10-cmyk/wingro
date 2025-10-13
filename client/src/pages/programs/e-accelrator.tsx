
import React from 'react';
import { useNavigate } from 'react-router-dom';

const EAccelerator: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white min-h-screen py-10 px-4 md:px-12 lg:px-32 flex flex-col gap-12">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-blue-700 mb-2">Wingrox AI e-Growth Accelerator™</h1>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">From Momentum → Mastery → Market Leadership → Legacy</h2>
          <p className="text-lg text-gray-600">“Don’t just grow fast—grow intelligently.”</p>
          <p className="text-md text-gray-500">We’re Intelligence-First Growth Accelerator. We blend human mentors + AI growth engines to remove your bottlenecks, create measurable momentum, and turn promising ventures into scalable, investable, globally admired businesses.</p>
          <div className="flex gap-4 mt-4">
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow">Assess My Growth Readiness</button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow" onClick={() => navigate('/programs/e-accelrator/screening')}>Apply to the Accelerator</button>
          </div>
        </div>
        {/* Visual Idea */}
        <div className="flex-1 flex items-center justify-center relative min-h-[300px]">
          <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-br from-gray-200 via-blue-100 to-white animate-pulse rounded-l-2xl z-0"></div>
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-bl from-yellow-100 via-indigo-100 to-white animate-pulse rounded-r-2xl z-0"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
            <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-400 rounded-full p-8 shadow-xl animate-pulse">
              <span className="text-white text-2xl font-bold">e-Growth Accelerator<br/>Powered by Wingrox AI</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why it Exists & Delivers */}
      <section className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Why it Exists?</h3>
          <p className="text-md text-gray-600 mb-2">Build the world’s first accelerator where intelligence leads growth—so companies scale smart, ethical, and strong.</p>
          <h3 className="text-2xl font-bold text-blue-800 mt-6 mb-2">What it Delivers?</h3>
          <p className="text-md text-gray-600 mb-2">We map your pains, design a clear growth path, run focused sprints, and prove outcomes—using the Pain Intelligence Hub™ and Growth Navigator Engine™.</p>
          <p className="text-md text-gray-500 mb-2">In short: We find what’s stuck → we fix it → we prove it works.</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow mt-4">Learn how it works →</button>
        </div>
      </section>

      {/* Why Most Accelerators Fall Short */}
      <section className="flex flex-col gap-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Why Most Accelerators Fall Short (and you feel it)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200 rounded-xl">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2">Common Issue</th>
                <th className="px-4 py-2">What You Feel</th>
                <th className="px-4 py-2">What Happens</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2">One-size-fits-all classes</td>
                <td className="px-4 py-2">“This doesn’t fit my business.”</td>
                <td className="px-4 py-2">Time wasted</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">Funding obsession</td>
                <td className="px-4 py-2">“Great pitch… but where’s the system?”</td>
                <td className="px-4 py-2">Spikes, then plateau</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">Advice without data</td>
                <td className="px-4 py-2">“Whose opinion should I trust?”</td>
                <td className="px-4 py-2">Random execution</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">Tech-only bias</td>
                <td className="px-4 py-2">“I’m an SME—do I belong?”</td>
                <td className="px-4 py-2">Great founders left out</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">No proof tracking</td>
                <td className="px-4 py-2">“We did work… where’s the evidence?”</td>
                <td className="px-4 py-2">Hard to convince investors</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">No post-program help</td>
                <td className="px-4 py-2">“After demo, we’re alone.”</td>
                <td className="px-4 py-2">Momentum drops</td>
              </tr>
              <tr>
                <td className="px-4 py-2">Result</td>
                <td className="px-4 py-2">Many “graduates,”</td>
                <td className="px-4 py-2">few predictable growth engines.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow mt-4">See our side-by-side comparison →</button>
      </section>

      {/* The Wingrox Solution: Intelligent Acceleration */}
      <section className="flex flex-col gap-6">
        <h3 className="text-xl font-bold text-blue-700 mb-2">The Wingrox Solution: Intelligent Acceleration</h3>
        <ol className="list-decimal ml-6 text-gray-700 mb-2">
          <li>Growth Readiness Navigator™ checks: bottlenecks, psychology, market, revenue, discipline</li>
          <li>Join a Pod: guided by Program Lead (human) + AI Co-Mentor (Wingrox GPT)</li>
          <li>Run custom sprints with proof at every step</li>
        </ol>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow mt-4">Meet our Pods →</button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow mt-2">See Sprint Flow →</button>
      </section>

      {/* Core Principles */}
      <section className="flex flex-col gap-6">
        <h3 className="text-xl font-bold text-blue-700 mb-2">Core Principles we live by</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200 rounded-xl">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-2">Principle</th>
                <th className="px-4 py-2">Plain-English Promise to You</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2">Growth-centric personalization</td>
                <td className="px-4 py-2">Your roadmap is custom-built from your data.</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">Data before decisions</td>
                <td className="px-4 py-2">We diagnose before spending time or money.</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">Human + AI collaboration</td>
                <td className="px-4 py-2">Real mentors + smart AI = double power.</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">Pitstop-verified progress</td>
                <td className="px-4 py-2">Every sprint ends with Go / Pivot / Scale on the Trust Ledger™.</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">Ethics & impact</td>
                <td className="px-4 py-2">ESG and ethical AI checks are built-in.</td>
              </tr>
              <tr>
                <td className="px-4 py-2">Network as a loop</td>
                <td className="px-4 py-2">Alumni + partners + investors = lifelong growth.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Program Outcomes */}
      <section className="flex flex-col gap-6">
        <h3 className="text-xl font-bold text-blue-700 mb-2">What You’ll Achieve (Program Outcomes)</h3>
        <ul className="list-disc ml-6 text-gray-700 mb-2">
          <li>✅ Pain → Progress → Profit → Legacy Roadmap™</li>
          <li>✅ A Trust Ledger™ trail of verified traction</li>
          <li>✅ A Growth Operating System (repeatable, scalable)</li>
          <li>✅ Access to Wingrox e-Investor Network (CSR funds + VCs + corporates)</li>
          <li>✅ A Leadership Playbook aligned to your persona</li>
          <li>✅ Auto-listing on GrowthLink™ for enterprise & global partnerships</li>
        </ul>
      </section>

      {/* Journey Section */}
      <section className="flex flex-col gap-6">
        <h3 className="text-xl font-bold text-blue-700 mb-2">Your Journey (10–16 Weeks)</h3>
        <ul className="list-disc ml-6 text-gray-700 mb-2">
          <li>8 Sprints + 3 Pitstops + Demo Week</li>
          <li>Phase 0: Readiness & Pod Setup</li>
          <li>S1–S3: Diagnosis → Blueprint → Acceleration</li>
          <li>S4–S5: Revenue Reinvention → Customer Flywheel</li>
          <li>S6–S7: Funding & Partnerships → Demo Week</li>
          <li>Post: GrowthLink™ + Alumni Guild</li>
        </ul>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow mt-4">See full architecture →</button>
      </section>

      {/* Who Should Join */}
      <section className="flex flex-col gap-6">
        <h3 className="text-xl font-bold text-blue-700 mb-2">Who Should Join?</h3>
        <ul className="list-disc ml-6 text-gray-700 mb-2">
          <li>⚡ Fast-growing startups needing structured expansion</li>
          <li>🧱 SMEs modernizing sales, ops, or digital funnels</li>
          <li>🌱 Impact/CSR ventures aligning to SDGs</li>
          <li>🧪 DeepTech/AI teams seeking market traction</li>
          <li>🔁 Second-time founders wanting systems, not noise</li>
        </ul>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow mt-4">Check pod types →</button>
      </section>

      {/* Why Wingrox Outperforms */}
      <section className="flex flex-col gap-6">
        <h3 className="text-xl font-bold text-blue-700 mb-2">Why Wingrox Outperforms</h3>
        <ul className="list-disc ml-6 text-gray-700 mb-2">
          <li>Personalized sprints (not generic classes)</li>
          <li>Human + AI mentors (not advice roulette)</li>
          <li>Trust Ledger™ proof (not claims)</li>
          <li>Funding ladder beyond Demo Day (not one shot)</li>
          <li>SME-friendly & impact-aligned by design</li>
        </ul>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow mt-4">See the detailed comparison →</button>
      </section>

      {/* Quick CTAs */}
      <section className="flex flex-col md:flex-row gap-4 justify-center mt-8">
        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full shadow">Assess My Growth Readiness</button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow">Apply to e-Growth Accelerator</button>
        <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-full shadow">Become a Sponsor/Investor</button>
      </section>

      {/* Footer Tagline */}
      <section className="mt-12 text-center">
        <p className="mt-6 text-xs text-gray-400">Wingrox AI — Engineering a World Where Growth Is Measured by Impact, Not Noise.</p>
      </section>
    </div>
  );
};

export default EAccelerator;
