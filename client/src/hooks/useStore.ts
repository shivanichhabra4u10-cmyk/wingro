import { create } from 'zustand';
import { growthPlans, goals } from '../services/api';

type Plan = {
  id: string;
  title: string;
  description: string;
};

type Goal = {
  id: string;
  title: string;
  description: string;
  planId: string;
  status: "pending" | "in-progress" | "completed";
  deadline: Date;
};

type Store = {
  plans: Plan[];
  currentPlan: Plan | null;
  goals: Goal[];
  loading: boolean;
  error: string | null;
  fetchPlans: () => Promise<void>;
  fetchPlan: (id: string) => Promise<void>;
  createPlan: (plan: { title: string; description: string }) => Promise<void>;
  updatePlan: (id: string, updates: Partial<Plan>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  createGoal: (goal: { title: string; description: string; planId: string; deadline: Date }) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
};

const useStore = create<Store>((set, get) => ({
  plans: [],
  currentPlan: null,
  goals: [],
  loading: false,
  error: null,

  fetchPlans: async () => {
    set({ loading: true, error: null });
    try {
      const response = await growthPlans.getAll();
      set({ plans: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch plans', loading: false });
    }
  },

  fetchPlan: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await growthPlans.getById(id);
      set({ currentPlan: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch plan', loading: false });
    }
  },

  createPlan: async (plan: { title: string; description: string }) => {
    set({ loading: true, error: null });
    try {
      const response = await growthPlans.create(plan);
      set((state) => ({ plans: [...state.plans, response.data], loading: false }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to create plan', loading: false });
    }
  },

  updatePlan: async (id: string, updates: Partial<Plan>) => {
    set({ loading: true, error: null });
    try {
      const existingPlan = get().plans.find((plan) => plan.id === id);
      if (!existingPlan) {
        throw new Error('Plan not found');
      }

      const updatedPlanData = {
        ...existingPlan,
        ...updates,
      };

      const response = await growthPlans.update(id, updatedPlanData);
      set((state) => ({
        plans: state.plans.map((plan) => (plan.id === id ? response.data : plan)),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to update plan', loading: false });
    }
  },

  deletePlan: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await growthPlans.delete(id);
      set((state) => ({
        plans: state.plans.filter((plan) => plan.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete plan', loading: false });
    }
  },

  createGoal: async (goal: { title: string; description: string; planId: string; deadline: Date }) => {
    set({ loading: true, error: null });
    try {
      const response = await goals.create(goal);
      set((state) => ({ goals: [...state.goals, response.data], loading: false }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to create goal', loading: false });
    }
  },

  updateGoal: async (id: string, updates: Partial<Goal>) => {
    set({ loading: true, error: null });
    try {
      const existingGoal = get().goals.find((goal) => goal.id === id);
      if (!existingGoal) {
        throw new Error('Goal not found');
      }

      const updatedGoalData = {
        ...existingGoal,
        ...updates,
      };

      const response = await goals.update(id, updatedGoalData);
      set((state) => ({
        goals: state.goals.map((goal) => (goal.id === id ? response.data : goal)),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to update goal', loading: false });
    }
  },

  deleteGoal: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await goals.delete(id);
      set((state) => ({
        goals: state.goals.filter((goal) => goal.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete goal', loading: false });
    }
  },
})); // Ensure this closing bracket and parenthesis are present

export default useStore;