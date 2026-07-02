import { create } from 'zustand';
import { RecommendationInput } from '../types/car';

const initialAnswers: RecommendationInput = {
  budgetMin: 600000,
  budgetMax: 1500000,
  useCase: 'family',
  fuelPreference: 'any',
  bodyTypePreference: 'any',
  priorities: ['safety', 'mileage']
};

interface QuizState {
  step: number;
  answers: RecommendationInput;
  setStep: (step: number) => void;
  updateAnswers: (answers: Partial<RecommendationInput>) => void;
  togglePriority: (priority: RecommendationInput['priorities'][number]) => void;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  step: 0,
  answers: initialAnswers,
  setStep: (step) => set({ step }),
  updateAnswers: (answers) => set((state) => ({ answers: { ...state.answers, ...answers } })),
  togglePriority: (priority) =>
    set((state) => ({
      answers: {
        ...state.answers,
        priorities: state.answers.priorities.includes(priority)
          ? state.answers.priorities.filter((item) => item !== priority)
          : [...state.answers.priorities, priority]
      }
    })),
  reset: () => set({ step: 0, answers: initialAnswers })
}));
