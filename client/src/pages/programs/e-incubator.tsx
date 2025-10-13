import React from 'react';

const EIncubator: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-10 px-4 md:px-12 lg:px-32 flex flex-col gap-12">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-indigo-700 mb-2">WinGrox AI e-Incubator</h1>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">From Thought → Idea → MVP → Market → Funding → Legacy</h2>
          <p className="text-lg text-gray-600">Welcome to Intelligence-First e-Incubator</p>
          <p className="text-md text-gray-500">We’re not just an incubator — we’re a growth intelligence engine that helps you turn your spark of an idea into a scalable, ethical, and future-ready business.</p>
          <div className="flex gap-4 mt-4">
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow">Apply Now → Launch Your Idea</button>
          </div>
        </div>
        {/* Visual Idea */}
        <div className="flex-1 flex items-center justify-center relative min-h-[300px]">
          <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-br from-gray-200 via-indigo-100 to-white animate-pulse rounded-l-2xl z-0"></div>
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-bl from-yellow-100 via-blue-100 to-white animate-pulse rounded-r-2xl z-0"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
            <div className="bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 rounded-full p-8 shadow-xl animate-pulse">
              <span className="text-white text-2xl font-bold">e-Incubator<br/>Powered by WinGrox AI</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Exists & Delivers */}
      <section className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Why it Exists?</h3>
          <p className="text-md text-gray-600 mb-2">To redefine how incubation works — by fusing human creativity with artificial intelligence.</p>
          <p className="text-md text-gray-500 mb-2">We transform passionate founders into evidence-based innovators who build ventures that are resilient, ethical, and globally scalable.</p>
          <h3 className="text-2xl font-bold text-indigo-800 mt-6 mb-2">What it Delivers?</h3>
          <p className="text-md text-gray-600 mb-2">To democratize innovation — making it simple, structured, and scientific.</p>
          <p className="text-md text-gray-500 mb-2">We decode every founder’s journey from Pain → Purpose → Progress → Profit → Legacy, accelerating ideas into funded, impactful ventures using data, mentorship, and AI-driven intelligence.</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="flex flex-col gap-6">
        <h3 className="text-2xl font-bold text-indigo-700 mb-2">How It Works?</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200 rounded-xl">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-4 py-2">Step</th>
                <th className="px-4 py-2">Stage</th>
                <th className="px-4 py-2">Outcome</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2">1️⃣</td>
                <td className="px-4 py-2">Discover Yourself</td>
                <td className="px-4 py-2">Decode your Founder Persona & Readiness Score</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">2️⃣</td>
                <td className="px-4 py-2">Validate Your Idea</td>
                <td className="px-4 py-2">Test your problem–solution fit using the Pain Intelligence Hub™</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">3️⃣</td>
                <td className="px-4 py-2">Build Fast</td>
                <td className="px-4 py-2">Create your MVP with help from your AI Co-Mentor</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">4️⃣</td>
                <td className="px-4 py-2">Test & Grow</td>
                <td className="px-4 py-2">Validate traction, users, and revenue</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">5️⃣</td>
                <td className="px-4 py-2">Pitch & Fund</td>
                <td className="px-4 py-2">Present your startup to global investors</td>
              </tr>
              <tr>
                <td className="px-4 py-2">6️⃣</td>
                <td className="px-4 py-2">Scale & Leave a Legacy</td>
                <td className="px-4 py-2">Join our e-Accelerator & GrowthLink™ network</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex gap-4 mt-4">
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow">Explore the Full Journey →</button>
        </div>
      </section>

      {/* Why Most Incubators Fall Short */}
      <section className="flex flex-col gap-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Why Most Incubators Fall Short (and Founders Feel It)?</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200 rounded-xl">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2">Common Issue</th>
                <th className="px-4 py-2">What You Feel as a Founder</th>
                <th className="px-4 py-2">What Actually Happens</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2">Generic Curriculum</td>
                <td className="px-4 py-2">“It feels like a classroom, not my startup.”</td>
                <td className="px-4 py-2">You follow templates, not truths — progress stalls.</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">Mentorship Without Context</td>
                <td className="px-4 py-2">“Different mentors, different advice — who’s right?”</td>
                <td className="px-4 py-2">Confusion replaces conviction.</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">Idea Over Evidence</td>
                <td className="px-4 py-2">“They love my vision but not my validation.”</td>
                <td className="px-4 py-2">You build too soon, pivot too late.</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">Pitch-Centric Focus</td>
                <td className="px-4 py-2">“All about Demo Day… but my product isn’t ready.”</td>
                <td className="px-4 py-2">Funding-first mindset → fragile foundations.</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">No Intelligence Layer</td>
                <td className="px-4 py-2">“They can’t see what data already shows.”</td>
                <td className="px-4 py-2">Decisions made on gut, not insights.</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">One-Size-Fits-All Sprints</td>
                <td className="px-4 py-2">“Our problems aren’t in their checklist.”</td>
                <td className="px-4 py-2">Real pain points go unaddressed.</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">No Proof of Progress</td>
                <td className="px-4 py-2">“We worked hard, but have no credible record.”</td>
                <td className="px-4 py-2">Investors can’t trust your growth story.</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">Short-Term Engagement</td>
                <td className="px-4 py-2">“After the program, we vanish into silence.”</td>
                <td className="px-4 py-2">No alumni linkage, no ecosystem lift.</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">No Ethics or Impact Lens</td>
                <td className="px-4 py-2">“Why does no one ask who we serve or harm?”</td>
                <td className="px-4 py-2">Products scale fast, but not responsibly.</td>
              </tr>
              <tr>
                <td className="px-4 py-2">No Network Intelligence</td>
                <td className="px-4 py-2">“We’re not connected to real problems or partners.”</td>
                <td className="px-4 py-2">You graduate with theory, not traction.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Why Founders Love e-Incubator */}
      <section className="flex flex-col gap-6">
        <h3 className="text-xl font-bold text-indigo-700 mb-2">Why Founders Love e-Incubator™</h3>
        <ul className="list-disc ml-6 text-gray-700 mb-2">
          <li>🧬 A Personalized Pathway — AI adapts the program to your persona.</li>
          <li>⚙️ Human + AI Collaboration — You’re paired with a Growth Architect (human) and AI Co-Mentor (Wingrox GPT).</li>
          <li>📈 Milestone-Verified Growth — Each sprint ends with a transparent “Go / Pivot / Scale” decision recorded in the Trust Ledger™.</li>
          <li>🌍 Network as an Asset — Lifetime access to GrowthLink™, alumni founders, and investors.</li>
          <li>♻️ Ethics & Impact by Design — ESG alignment and social-impact validation built-in.</li>
        </ul>
        <div className="flex gap-4 mt-4">
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow">See Our Design Principles →</button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow">See Our Side-by-Side Comparison →</button>
        </div>
      </section>

      {/* Graduation Benefits */}
      <section className="flex flex-col gap-6">
        <h3 className="text-xl font-bold text-indigo-700 mb-2">By Graduation, You’ll Have</h3>
        <ul className="list-disc ml-6 text-gray-700 mb-2">
          <li>✅ A validated Problem → Solution → Market → Model → MVP → Funding → Legacy story</li>
          <li>✅ Proof of traction & trust in the Trust Ledger™</li>
          <li>✅ Access to investors, grants, and enterprise pilots</li>
          <li>✅ Your own Persona-Aligned Foundership Playbook™</li>
          <li>✅ Entry into the GrowthLink™ ecosystem for scale</li>
        </ul>
      </section>

      {/* Core Philosophy & Design Principles */}
      <section className="flex flex-col gap-6">
        <h3 className="text-xl font-bold text-indigo-700 mb-2">Core Philosophy & Design Principles</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200 rounded-xl">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-4 py-2">Principle</th>
                <th className="px-4 py-2">What It Means for You</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2">Founder-Centric Personalization</td>
                <td className="px-4 py-2">Your journey adapts to your mindset & growth speed.</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">Intelligence Before Action</td>
                <td className="px-4 py-2">Validate the problem before you build anything.</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">Human + AI Collaboration</td>
                <td className="px-4 py-2">Real mentors + AI coaches to double your execution power.</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">Milestone-Verified Growth</td>
                <td className="px-4 py-2">Each sprint ends with proof — Go / Pivot / Scale.</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">Ethics & Impact by Design</td>
                <td className="px-4 py-2">Every startup aligns with ESG goals & responsible AI.</td>
              </tr>
              <tr>
                <td className="px-4 py-2">Network as an Asset</td>
                <td className="px-4 py-2">Your cohort becomes your growth tribe for life.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="mt-12 text-center">
        <h3 className="text-2xl font-bold text-indigo-700 mb-2">Ready to Start Your Founder Journey?</h3>
        <p className="text-md text-gray-600 mb-2">Join the WinGrox AI e-Incubator™ — where ideas become impact in just 12 weeks.</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-4">
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full shadow">Apply Now → Launch Your Idea</button>
        </div>
        <p className="mt-6 text-xs text-gray-400">WinGrox AI — Building the World’s First Intelligence-First Incubator.</p>
      </section>
    </div>
  );
};

export default EIncubator;
