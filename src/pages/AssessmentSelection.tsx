import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// file deleted
type CategoryType = 'individual' | 'organization' | null;

const AssessmentSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(null);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const handleCategoryChange = (category: CategoryType) => {
    if (category === null) {
      setIsAnimatingOut(true);
      setTimeout(() => {
        setSelectedCategory(category);
        setIsAnimatingOut(false);
      }, 300);
    } else {
      setSelectedCategory(category);
    }
  };

  const handleAssessmentSelection = (category: string) => {
    localStorage.setItem("category", category);
    navigate(`/${category}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Select Assessment</h1>
        
        {!selectedCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
            <button onClick={() => handleCategoryChange("individual")}>
              Individual Assessment
            </button>
            <button onClick={() => handleCategoryChange("organization")}>
              Organization Assessment
            </button>
          </div>
        )}
        
        {selectedCategory === "individual" && (
          <div>
            <h2>Individual Assessments</h2>
            <button onClick={() => handleAssessmentSelection("student-9-10")}>
              9-10 Grade Assessment
            </button>
            <button onClick={() => handleAssessmentSelection("student-11-12")}>
              11-12 Grade Assessment
            </button>
            <button onClick={() => handleAssessmentSelection("professional")}>
              Professional Assessment
            </button>
            <button onClick={() => handleCategoryChange(null)}>
              Back
            </button>
          </div>
        )}
        
        {selectedCategory === "organization" && (
          <div>
            <h2>Organization Assessments</h2>
            <button onClick={() => handleAssessmentSelection("organization?type=early-startup")}>
              Early-Stage Assessment
            </button>
            <button onClick={() => handleAssessmentSelection("organization?type=established")}>
              Established Business Assessment
            </button>
            <button onClick={() => handleCategoryChange(null)}>
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentSelection;
