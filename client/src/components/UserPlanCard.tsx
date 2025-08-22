import React, { useEffect, useState } from 'react';
import { getUserPlan } from '../services/userPlanService';
import growthPlans from '../data/growthPlans.json';

interface UserPlanCardProps {
  userId: string;
}

const UserPlanCard: React.FC<UserPlanCardProps> = ({ userId }) => {
  const [userPlan, setUserPlan] = useState<any>(null);
  const [planDetails, setPlanDetails] = useState<any>(null);

  useEffect(() => {
    async function fetchPlan() {
      const res = await getUserPlan(userId);
      if (res.data && res.data.userPlan) {
        setUserPlan(res.data.userPlan);
        const details = growthPlans.find(p => p.id === res.data.userPlan.planId);
        setPlanDetails(details);
      }
    }
    fetchPlan();
  }, [userId]);

  if (!userPlan || !planDetails) return <div>No plan selected.</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-2">Your Growth Plan</h2>
      <h3 className="text-xl font-semibold mb-2">{planDetails.name}</h3>
      <p className="mb-4">{planDetails.description}</p>
      <ul className="mb-4 list-disc list-inside">
        {planDetails.features.map((f: string, i: number) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
      <div className="font-bold">Assessment: {userPlan.assessmentType}</div>
      <div className="mt-2">Purchased At: {new Date(userPlan.purchasedAt).toLocaleString()}</div>
    </div>
  );
};

export default UserPlanCard;
