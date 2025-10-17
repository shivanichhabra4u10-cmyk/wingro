import React, { useState } from 'react';

const steps: string[] = [
  "Identity & Core Details",
  "Solution Expertise",
  "Capability & Capacity", 
  "Trust, Ethics & Compliance",
  "Imaginative Intelligence & Purpose",
  "Engagement Preferences",
  "AI Evaluation Layer",
  "Marketplace Visibility",
  "Upload Zone",
];

const ProviderIntelligence: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState({
    // Section 1 - Identity & Core Details
    orgName: '',
    website: '',
    countryCity: '',
    teamSize: '',
    yearsExperience: '',
    contactName: '',
    contactRole: '',
    contactEmail: '',
    contactPhone: '',
    collaborationModel: [] as string[],
    
    // Section 2 - Solution Expertise
    coreExpertise: [] as string[],
    project1Name: '',
    project1Industry: '',
    project1Problem: '',
    project1Outcome: '',
    project2Name: '',
    project2Industry: '',
    project2Problem: '',
    project2Outcome: '',
    project3Name: '',
    project3Industry: '',
    project3Problem: '',
    project3Outcome: '',
    projectValueRange: '',
    industriesServed: [] as string[],
    uniqueDifferentiator: '',
    techStack: '',
    solutionType: '',
    
    // Section 3 - Capability & Capacity
    currentProjects: '',
    maxParallelProjects: '',
    avgDeliveryTime: '',
    deploymentSupport: [] as string[],
    preferredClientSize: [] as string[],
    geographicalReach: [] as string[],
    
    // Section 4 - Trust, Ethics & Compliance
    dataCertifications: '',
    ethicsPolicy: '',
    trustLedgerConsent: '',
    customerReferences: '',
    partnerships: '',
    
    // Section 5 - Imaginative Intelligence & Purpose
    inspiration: '',
    problemsExcite: [] as string[],
    sdgAlignment: '',
    coCreationWillingness: '',
    multilingualCapability: '',
    
    // Section 6 - Engagement Preferences
    projectDuration: '',
    budgetRange: '',
    engagementType: '',
    pilotAvailability: '',
    collaborationTools: '',
    
    // Section 8 - Consent & Marketplace Visibility
    publicProfileConsent: '',
    feedbackConsent: '',
    verifiedProviderConsent: '',
    
    // Section 9 - Upload Zone
    pitchDeck: null as File | null,
    caseStudies: null as File | null,
    teamVideo: null as File | null,
    certifications: null as File | null,
  });
  
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (name: string, value: string | string[] | File | null) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name: string, option: string) => {
    const currentValues = formData[name as keyof typeof formData] as string[];
    const newValues = currentValues.includes(option)
      ? currentValues.filter(item => item !== option)
      : [...currentValues, option];
    handleInputChange(name, newValues);
  };

  const handleFileChange = (name: string, file: File | null) => {
    handleInputChange(name, file);
  };


  const handlePrev = () => setCurrentStep(s => Math.max(s - 1, 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 8) {
      setSubmitted(true);
    }
  };

  const InputField = ({ label, name, type = "text", required = false, placeholder = "" }: {
    label: string;
    name: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name as keyof typeof formData] as string}
        onChange={(e) => handleInputChange(name, e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        required={required}
        placeholder={placeholder}
      />
    </div>
  );

  const TextAreaField = ({ label, name, required = false, placeholder = "" }: {
    label: string;
    name: string;
    required?: boolean;
    placeholder?: string;
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        name={name}
        value={formData[name as keyof typeof formData] as string}
        onChange={(e) => handleInputChange(name, e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-24"
        required={required}
        placeholder={placeholder}
      />
    </div>
  );

  const CheckboxGroup = ({ label, name, options }: {
    label: string;
    name: string;
    options: string[];
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="grid md:grid-cols-2 gap-2">
        {options.map(option => (
          <label key={option} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={(formData[name as keyof typeof formData] as string[]).includes(option)}
              onChange={() => handleCheckboxChange(name, option)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const RadioGroup = ({ label, name, options }: {
    label: string;
    name: string;
    options: string[];
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="grid md:grid-cols-2 gap-2">
        {options.map(option => (
          <label key={option} className="flex items-center space-x-2">
            <input
              type="radio"
              name={name}
              value={option}
              checked={formData[name as keyof typeof formData] === option}
              onChange={(e) => handleInputChange(name, e.target.value)}
              className="border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const FileUpload = ({ label, name, accept = "*/*" }: {
    label: string;
    name: string;
    accept?: string;
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="file"
        accept={accept}
        onChange={(e) => handleFileChange(name, e.target.files?.[0] || null)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Identity & Core Details
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Section 1 — Identity & Core Details</h3>
            <p className="text-gray-600 mb-6 italic">"Let's know who you are and what you stand for."</p>
            
            <InputField label="Organization / Startup Name" name="orgName" required />
            <InputField label="Website / Portfolio / Demo Link" name="website" type="url" />
            <InputField label="Country / City of Operation" name="countryCity" required />
            <InputField label="Team Size" name="teamSize" required />
            <InputField label="Years of Experience in AI / Tech Development" name="yearsExperience" required />
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <InputField label="Contact Person Name" name="contactName" required />
              <InputField label="Contact Role" name="contactRole" required />
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <InputField label="Contact Email" name="contactEmail" type="email" required />
              <InputField label="Contact Phone" name="contactPhone" type="tel" required />
            </div>
            
            <CheckboxGroup 
              label="Preferred Collaboration Model"
              name="collaborationModel"
              options={["Service provider", "Co-creation partner", "Research lab", "Freelancer / Boutique team"]}
            />
          </div>
        );

      case 1: // Solution Expertise
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Section 2 — Solution Expertise</h3>
            <p className="text-gray-600 mb-6 italic">"Describe what you are great at."</p>
            
            <CheckboxGroup 
              label="Core Areas of Expertise"
              name="coreExpertise"
              options={["AI / ML", "NLP / Chatbots", "Data Analytics", "Automation / RPA", "IoT / Edge Tech", "Cloud / DevOps", "App / Web Development", "AR / VR", "UI/UX Design", "Consulting / Strategy", "Other"]}
            />
            
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-700 mb-4">List your top 3 solutions / projects delivered:</h4>
              
              <div className="border border-gray-200 rounded-lg p-4 mb-4">
                <h5 className="font-medium text-gray-700 mb-3">Project 1</h5>
                <div className="grid md:grid-cols-2 gap-4">
                  <InputField label="Project Name" name="project1Name" />
                  <InputField label="Industry" name="project1Industry" />
                </div>
                <TextAreaField label="Problem solved" name="project1Problem" />
                <TextAreaField label="Outcome achieved" name="project1Outcome" />
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 mb-4">
                <h5 className="font-medium text-gray-700 mb-3">Project 2</h5>
                <div className="grid md:grid-cols-2 gap-4">
                  <InputField label="Project Name" name="project2Name" />
                  <InputField label="Industry" name="project2Industry" />
                </div>
                <TextAreaField label="Problem solved" name="project2Problem" />
                <TextAreaField label="Outcome achieved" name="project2Outcome" />
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 mb-4">
                <h5 className="font-medium text-gray-700 mb-3">Project 3</h5>
                <div className="grid md:grid-cols-2 gap-4">
                  <InputField label="Project Name" name="project3Name" />
                  <InputField label="Industry" name="project3Industry" />
                </div>
                <TextAreaField label="Problem solved" name="project3Problem" />
                <TextAreaField label="Outcome achieved" name="project3Outcome" />
              </div>
            </div>
            
            <RadioGroup 
              label="Typical project value range (₹ / USD)"
              name="projectValueRange"
              options={["<5L", "5–25L", "25–100L", ">100L"]}
            />
            
            <CheckboxGroup 
              label="Industries you have served"
              name="industriesServed"
              options={["Health", "Retail", "Education", "Agriculture", "Finance", "Manufacturing", "Climate", "Other"]}
            />
            
            <TextAreaField label="Unique differentiator: What makes your solution / approach stand out?" name="uniqueDifferentiator" />
            
            <TextAreaField 
              label="Technology stack used most frequently" 
              name="techStack" 
              placeholder="e.g., Python, TensorFlow, Azure, AWS, LangChain, Flutter, Node.js"
            />
            
            <RadioGroup 
              label="Are your solutions modular or customizable?"
              name="solutionType"
              options={["Modular (plug & play)", "Custom-built", "Hybrid"]}
            />
          </div>
        );

      case 2: // Capability & Capacity
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Section 3 — Capability & Capacity</h3>
            <p className="text-gray-600 mb-6 italic">"Can you deliver the solution effectively and at scale?"</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <InputField label="Current active projects (number)" name="currentProjects" type="number" />
              <InputField label="Maximum number of parallel projects your team can handle" name="maxParallelProjects" type="number" />
            </div>
            
            <InputField label="Average delivery time for a project (in weeks)" name="avgDeliveryTime" type="number" />
            
            <CheckboxGroup 
              label="Deployment support offered"
              name="deploymentSupport"
              options={["Development only", "Full deployment", "Maintenance", "Training / Documentation"]}
            />
            
            <CheckboxGroup 
              label="Preferred client size"
              name="preferredClientSize"
              options={["Startup", "SME", "Large Enterprise", "Government / NGO"]}
            />
            
            <CheckboxGroup 
              label="Current geographical service reach"
              name="geographicalReach"
              options={["India", "MENA", "APAC", "Europe", "Global"]}
            />
          </div>
        );

      case 3: // Trust, Ethics & Compliance
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Section 4 — Trust, Ethics & Compliance</h3>
            <p className="text-gray-600 mb-6 italic">"We value ethical and responsible innovation."</p>
            
            <TextAreaField 
              label="Do you have data privacy / security certifications (ISO, GDPR, HIPAA, etc.)?" 
              name="dataCertifications" 
              placeholder="List your certifications and compliance standards"
            />
            
            <RadioGroup 
              label="Do you have an internal Ethics or Responsible AI policy?"
              name="ethicsPolicy"
              options={["Yes, documented and implemented", "Yes, informal guidelines", "In development", "No, but interested", "No"]}
            />
            
            <RadioGroup 
              label="Would you consent to WinGrox Trust Ledger verification (project & feedback transparency)?"
              name="trustLedgerConsent"
              options={["Yes, fully transparent", "Yes, with conditions", "Need more information", "No"]}
            />
            
            <RadioGroup 
              label="Customer references available?"
              name="customerReferences"
              options={["Yes, multiple references", "Yes, limited references", "Yes, but confidential", "No references yet"]}
            />
            
            <TextAreaField 
              label="Any existing partnerships with IITs / research centers / corporates?" 
              name="partnerships" 
              placeholder="List your key partnerships and collaborations"
            />
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-800">
                <span className="font-medium">💡 Note:</span> WinGrox will generate an Ethical Intelligence Score (EIQ) based on these responses.
              </p>
            </div>
          </div>
        );

      case 4: // Imaginative Intelligence & Purpose
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Section 5 — Imaginative Intelligence & Purpose</h3>
            <p className="text-gray-600 mb-6 italic">"Your creativity and purpose matter as much as your code."</p>
            
            <TextAreaField 
              label="What inspired you to build AI / tech solutions?" 
              name="inspiration" 
              placeholder="Share your story and motivation"
            />
            
            <CheckboxGroup 
              label="What kind of problems excite your team most?"
              name="problemsExcite"
              options={["Human behavior", "Climate", "Healthcare", "Productivity", "Education", "Governance", "Other"]}
            />
            
            <TextAreaField 
              label="Which UN SDG or impact area do your solutions align with (if any)?" 
              name="sdgAlignment" 
              placeholder="e.g., SDG 3 (Good Health), SDG 4 (Quality Education), etc."
            />
            
            <RadioGroup 
              label="Would you be open to co-creating with startups from the WinGrox Incubator Pods?"
              name="coCreationWillingness"
              options={["Yes, very interested", "Yes, case by case", "Maybe, need more info", "No"]}
            />
            
            <RadioGroup 
              label="Do you have multilingual capability (to localize solutions in regional languages)?"
              name="multilingualCapability"
              options={["Yes, multiple Indian languages", "Yes, international languages", "Limited capability", "English only", "Planning to add"]}
            />
          </div>
        );

      case 5: // Engagement Preferences
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Section 6 — Engagement Preferences</h3>
            <p className="text-gray-600 mb-6 italic">"Let's make matching frictionless."</p>
            
            <RadioGroup 
              label="Preferred project duration"
              name="projectDuration"
              options={["<3 months", "3–6 months", ">6 months"]}
            />
            
            <RadioGroup 
              label="Budget range you typically serve"
              name="budgetRange"
              options={["<₹5L", "₹5–25L", "₹25–100L", "₹100L+"]}
            />
            
            <CheckboxGroup 
              label="Engagement Type"
              name="engagementType"
              options={["Fixed cost", "Time & material", "Revenue share", "Equity partnership"]}
            />
            
            <RadioGroup 
              label="Availability for pilot projects / PoCs?"
              name="pilotAvailability"
              options={["Yes, immediately", "Yes, with scheduling", "Case by case", "No"]}
            />
            
            <TextAreaField 
              label="Preferred collaboration tools" 
              name="collaborationTools" 
              placeholder="e.g., Teams, Slack, Zoom, Asana, Notion, Other"
            />
          </div>
        );

      case 6: // AI Evaluation Layer
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Section 7 — WinGrox AI Evaluation Layer</h3>
            <p className="text-gray-600 mb-4 italic">(Calculated automatically — not visible to user but used by the AI Matchmaker)</p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-2 font-semibold text-gray-700">Metric</th>
                      <th className="text-left py-2 font-semibold text-gray-700">Source</th>
                      <th className="text-left py-2 font-semibold text-gray-700">Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-gray-200">
                      <td className="py-2">Provider Capability Index (PCI)</td>
                      <td className="py-2">Based on domain expertise + project record</td>
                      <td className="py-2">Technical & delivery maturity</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2">Ethical Intelligence Score (EIQ)</td>
                      <td className="py-2">Section 4 inputs</td>
                      <td className="py-2">Ethical & data governance compliance</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2">Imaginative Intelligence Score (ImQ)</td>
                      <td className="py-2">Section 5 inputs</td>
                      <td className="py-2">Creativity, empathy, purpose alignment</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2">Match Readiness Score (MRS)</td>
                      <td className="py-2">Engagement model + capacity</td>
                      <td className="py-2">Delivery readiness</td>
                    </tr>
                    <tr>
                      <td className="py-2">Trust Score (TS)</td>
                      <td className="py-2">Verified references + history</td>
                      <td className="py-2">Reliability for seekers</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 p-4 bg-blue-100 rounded-lg">
                <p className="text-sm font-medium text-blue-800">
                  <strong>Final AI Output:</strong><br />
                  Match Confidence Score = (0.3 × PCI) + (0.2 × EIQ) + (0.2 × ImQ) + (0.2 × MRS) + (0.1 × TS)
                </p>
              </div>
            </div>
          </div>
        );

      case 7: // Marketplace Visibility
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Section 8 — Consent & Marketplace Visibility</h3>
            <p className="text-gray-600 mb-6 italic">"We believe in transparent, verified collaboration."</p>
            
            <RadioGroup 
              label="Do you consent to display your profile publicly on the WinGrox AI Connect Marketplace?"
              name="publicProfileConsent"
              options={["Yes", "No"]}
            />
            
            <RadioGroup 
              label="Do you authorize WinGrox to collect post-project feedback and publish impact metrics?"
              name="feedbackConsent"
              options={["Yes", "No"]}
            />
            
            <RadioGroup 
              label="Would you like to be featured in the 'Verified Provider' category? (subject to audit)"
              name="verifiedProviderConsent"
              options={["Yes", "No"]}
            />
          </div>
        );

      case 8: // Upload Zone
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Section 9 — Upload Zone</h3>
            
            <FileUpload 
              label="Company pitch deck / brochure" 
              name="pitchDeck" 
              accept=".pdf,.ppt,.pptx,.doc,.docx"
            />
            
            <FileUpload 
              label="Client case studies (max 3)" 
              name="caseStudies" 
              accept=".pdf,.doc,.docx"
            />
            
            <FileUpload 
              label="Team intro video (optional but highly engaging)" 
              name="teamVideo" 
              accept=".mp4,.avi,.mov,.wmv"
            />
            
            <FileUpload 
              label="Certifications or compliance documents" 
              name="certifications" 
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <section className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-xl p-8 md:p-12 text-white relative overflow-hidden mb-8 shadow-lg">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-400 mb-4 tracking-tight" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>
            WinGrox AI Connect™ — Provider Intelligence Questionnaire
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-6">
            Decode the provider's capability, credibility, capacity, and compatibility — so the Pain Intelligence Hub can compute a Match Confidence Score and feed it into the Trust Ledger.
          </p>
        </div>
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl"></div>
      </section>

      <div className="w-full px-2 md:px-8 lg:px-16 xl:px-32">
        {submitted ? (
          <div className="bg-white p-8 rounded-2xl shadow text-center mt-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Thank you!</h2>
            <p className="text-gray-700">Your provider profile has been submitted. Our AI system will compute your Match Confidence Score and add you to the Trust Ledger.</p>
          </div>
        ) : (
          <form className="bg-white p-4 md:p-8 rounded-2xl shadow mt-8" onSubmit={handleSubmit} noValidate>
            {/* Step Progress Indicator */}
            <div className="flex items-center justify-center mb-8">
              {steps.map((label, idx) => (
                <div key={label} className="flex items-center">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-white text-sm ${currentStep === idx ? 'bg-blue-600' : currentStep > idx ? 'bg-blue-400' : 'bg-gray-300'}`}>
                    {idx + 1}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`w-12 h-1 mx-2 rounded ${currentStep > idx ? 'bg-blue-400' : 'bg-gray-300'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step Title */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
              </h2>
            </div>

            {/* Step Content */}
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button 
                type="button" 
                onClick={handlePrev} 
                disabled={currentStep === 0}
                className={`px-6 py-2 rounded-full font-semibold shadow ${currentStep === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Previous
              </button>
              
              {currentStep === 8 ? (
                <button 
                  type="submit" 
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg transition-colors duration-200"
                >
                  Submit Provider Intelligence Profile
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow"
                >
                  Next
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProviderIntelligence;