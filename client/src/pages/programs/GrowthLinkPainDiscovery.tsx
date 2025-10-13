import React, { useState } from 'react';

type FormState = {
  orgName: string;
  industry: string;
  size: string;
  role: string;
  source: string;
  problem: string;
  impact: string[];
  duration: string;
  tried: string;
  affected: string;
  urgency: number;
  financialImpact: string;
  transformation: string;
  solutionType: string[];
  goal: string[];
  successDef: string;
  buildType: string;
  engagement: string;
  timeline: string;
  budget: string;
  techTeam: string;
  collabStyle: string;
  constraints: string;
  globalCollab: string;
  trustLedger: string;
  docs: File | null;
  consent: boolean;
};

const initialState: FormState = {
  orgName: '',
  industry: '',
  size: '',
  role: '',
  source: '',
  problem: '',
  impact: [],
  duration: '',
  tried: '',
  affected: '',
  urgency: 5,
  financialImpact: '',
  transformation: '',
  solutionType: [],
  goal: [],
  successDef: '',
  buildType: '',
  engagement: '',
  timeline: '',
  budget: '',
  techTeam: '',
  collabStyle: '',
  constraints: '',
  globalCollab: '',
  trustLedger: '',
  docs: null,
  consent: false,
};

const impactOptions = [
  'Revenue loss',
  'Productivity issues',
  'Customer attrition',
  'Compliance risk',
  'Employee burnout',
  'Reputation damage',
  'Other',
];
const solutionOptions = [
  'AI / ML model development',
  'Automation / Workflow',
  'Analytics / Dashboarding',
  'App / Platform build',
  'IoT / Hardware integration',
  'Data Engineering',
  'Consulting / Strategy',
  'Other',
];
const goalOptions = [
  'Reduce cost',
  'Increase efficiency',
  'Enhance customer experience',
  'Enable new revenue',
  'Ensure compliance',
  'Improve employee well-being',
];

const GrowthLinkPainDiscovery: React.FC = () => {
  const [form, setForm] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      if (e.target instanceof HTMLInputElement) {
        setForm({ ...form, [name]: e.target.checked });
      }
    } else if (type === 'file') {
      if (e.target instanceof HTMLInputElement && e.target.files && e.target.files[0]) {
        setForm({ ...form, [name]: e.target.files[0] });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleMultiSelect = (name: keyof Pick<FormState, 'impact' | 'solutionType' | 'goal'>, value: string) => {
    setForm((prev) => {
      const arr = prev[name];
      if (arr.includes(value)) {
        return { ...prev, [name]: arr.filter((v) => v !== value) };
      } else {
        return { ...prev, [name]: [...arr, value] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // TODO: API integration
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };
  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <section className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-xl p-8 md:p-12 text-white relative overflow-hidden mb-8 shadow-lg">
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-400 mb-4 tracking-tight" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>
            WinGrox AI Growth Link — Seeker Intelligence Questionnaire
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-6">
            Decode your problem, context, constraints, and expected outcomes so WinGrox’s Pain Intelligence Hub can auto-map the most relevant AI / tech providers.
          </p>
        </div>
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl"></div>
      </section>
  <div className="w-full px-2 md:px-8 lg:px-16 xl:px-32">
        {submitted ? (
          <div className="bg-white p-8 rounded-2xl shadow text-center mt-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Thank you!</h2>
            <p className="text-gray-700">Your responses have been submitted. Our team will reach out soon with your Pain Signature and next steps.</p>
          </div>
        ) : (
          <form className="bg-white p-4 md:p-8 rounded-2xl shadow mt-8" onSubmit={handleSubmit}>
            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-8">
              {[1,2,3,4].map((s) => (
                <div key={s} className={`flex items-center ${s < totalSteps ? 'mr-4' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg ${step === s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>{s}</div>
                  {s < totalSteps && <div className="w-8 h-1 bg-gray-300 mx-1 rounded-full"></div>}
                </div>
              ))}
            </div>
            {/* Step Content */}
            {step === 1 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Section 1 — Context & Identity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name / Startup / Institution / Individual</label>
                    <input name="orgName" value={form.orgName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry / Sector</label>
                    <select name="industry" value={form.industry} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required>
                      <option value="">Select</option>
                      <option value="Health">Health</option>
                      <option value="Retail">Retail</option>
                      <option value="Agri">Agri</option>
                      <option value="Education">Education</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Public Sector">Public Sector</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Size of Organization</label>
                    <input name="size" value={form.size} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Role / Decision Maker Level</label>
                    <input name="role" value={form.role} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">How did you hear about WinGrox AI Connect?</label>
                    <input name="source" value={form.source} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                  </div>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Section 2 — Pain Diagnosis</h3>
                <label className="block text-sm font-medium text-gray-700 mb-1">Describe the main problem you are trying to solve</label>
                <textarea name="problem" value={form.problem} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Impact of this problem today</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {impactOptions.map((opt) => (
                    <label key={opt} className="flex items-center gap-2">
                      <input type="checkbox" checked={form.impact.includes(opt)} onChange={() => handleMultiSelect('impact', opt)} />
                      <span className="text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
                <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">How long has this problem been persisting?</label>
                <select name="duration" value={form.duration} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required>
                  <option value="">Select</option>
                  <option value="<3 months">&lt;3 months</option>
                  <option value="3–12 months">3–12 months</option>
                  <option value=">1 year">&gt;1 year</option>
                </select>
                <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">What solutions have you already tried? What worked / didn’t?</label>
                <textarea name="tried" value={form.tried} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Who is most affected by this pain?</label>
                <input name="affected" value={form.affected} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">How urgent is the problem? (1–10)</label>
                <input type="number" name="urgency" value={form.urgency} min={1} max={10} onChange={handleChange} className="w-32 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Financial impact per month / quarter (approximate)</label>
                <input name="financialImpact" value={form.financialImpact} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Short-term fix or long-term transformation?</label>
                <select name="transformation" value={form.transformation} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required>
                  <option value="">Select</option>
                  <option value="Short">Short</option>
                  <option value="Medium">Medium</option>
                  <option value="Long">Long</option>
                </select>
              </div>
            )}
            {step === 3 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Section 3 — Desired Solution Profile</h3>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type of solution you are looking for</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {solutionOptions.map((opt) => (
                    <label key={opt} className="flex items-center gap-2">
                      <input type="checkbox" checked={form.solutionType.includes(opt)} onChange={() => handleMultiSelect('solutionType', opt)} />
                      <span className="text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
                <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Primary goal</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {goalOptions.map((opt) => (
                    <label key={opt} className="flex items-center gap-2">
                      <input type="checkbox" checked={form.goal.includes(opt)} onChange={() => handleMultiSelect('goal', opt)} />
                      <span className="text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
                <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">How do you define success?</label>
                <input name="successDef" value={form.successDef} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Build from scratch or customize existing systems?</label>
                <input name="buildType" value={form.buildType} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Preferred engagement model</label>
                <input name="engagement" value={form.engagement} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Expected timeline for implementation</label>
                <input name="timeline" value={form.timeline} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Budget range available for initial phase</label>
                <input name="budget" value={form.budget} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
              </div>
            )}
            {step === 4 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Section 4 — Organizational Fit & Readiness</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Do you already have internal tech or data teams?</label>
                    <input name="techTeam" value={form.techTeam} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred collaboration style</label>
                    <input name="collabStyle" value={form.collabStyle} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Constraints the solution must respect</label>
                    <input name="constraints" value={form.constraints} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Local providers only or open to global collaboration?</label>
                    <input name="globalCollab" value={form.globalCollab} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Would you prefer WinGrox AI to verify and govern the project through the Trust Ledger?</label>
                    <input name="trustLedger" value={form.trustLedger} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Add any supporting documents</label>
                    <input type="file" name="docs" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2 mt-2">
                    <input type="checkbox" name="consent" checked={form.consent} onChange={handleChange} />
                    <span className="text-gray-700">Consent for data use and matching</span>
                  </div>
                </div>
              </div>
            )}
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button type="button" onClick={handlePrev} disabled={step === 1} className={`px-6 py-2 rounded-full font-semibold shadow ${step === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Previous</button>
              {step < totalSteps ? (
                <button type="button" onClick={handleNext} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow">Next</button>
              ) : (
                <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow">Submit</button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default GrowthLinkPainDiscovery;
