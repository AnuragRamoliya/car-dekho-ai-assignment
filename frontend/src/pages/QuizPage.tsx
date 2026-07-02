import { useNavigate } from 'react-router-dom';
import { QuizStep } from '../components/QuizStep';
import { useQuizStore } from '../store/quizStore';
import { BodyType, FuelType, Priority, UseCase } from '../types/car';

const budgetOptions = [
  { label: 'Under 8 lakh', min: 500000, max: 800000 },
  { label: '8-15 lakh', min: 800000, max: 1500000 },
  { label: '15-25 lakh', min: 1500000, max: 2500000 },
  { label: '25 lakh+', min: 2500000, max: 3500000 }
];

const useCases: { label: string; value: UseCase }[] = [
  { label: 'City commute', value: 'city' },
  { label: 'Family comfort', value: 'family' },
  { label: 'Highway trips', value: 'highway' },
  { label: 'Performance', value: 'performance' },
  { label: 'Low running cost', value: 'eco' }
];

const fuels: { label: string; value: FuelType | 'any' }[] = [
  { label: 'No preference', value: 'any' },
  { label: 'Petrol', value: 'petrol' },
  { label: 'Diesel', value: 'diesel' },
  { label: 'Electric', value: 'electric' },
  { label: 'Hybrid', value: 'hybrid' },
  { label: 'CNG', value: 'cng' }
];

const bodies: { label: string; value: BodyType | 'any' }[] = [
  { label: 'No preference', value: 'any' },
  { label: 'Hatchback', value: 'hatchback' },
  { label: 'Sedan', value: 'sedan' },
  { label: 'SUV', value: 'suv' },
  { label: 'MUV', value: 'muv' }
];

const priorities: { label: string; value: Priority }[] = [
  { label: 'Safety', value: 'safety' },
  { label: 'Mileage', value: 'mileage' },
  { label: 'Space', value: 'space' },
  { label: 'Performance', value: 'performance' },
  { label: 'Value', value: 'value' },
  { label: 'Automatic', value: 'automatic' }
];

export const QuizPage = () => {
  const navigate = useNavigate();
  const { step, setStep, answers, updateAnswers, togglePriority } = useQuizStore();
  const totalSteps = 5;

  const next = () => {
    if (step === totalSteps - 1) navigate('/recommendations');
    else setStep(step + 1);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="h-2 rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-reef transition-all" style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
      </div>

      {step === 0 ? (
        <QuizStep title="What is your budget?">
          <div className="grid gap-3 sm:grid-cols-2">
            {budgetOptions.map((option) => (
              <button key={option.label} type="button" onClick={() => updateAnswers({ budgetMin: option.min, budgetMax: option.max })} className={`rounded-md border p-4 text-left font-semibold ${answers.budgetMin === option.min ? 'border-reef bg-reef/10 text-reef' : 'border-slate-200'}`}>
                {option.label}
              </button>
            ))}
          </div>
        </QuizStep>
      ) : null}

      {step === 1 ? (
        <QuizStep title="How will you use the car most?">
          <div className="grid gap-3 sm:grid-cols-2">
            {useCases.map((option) => (
              <button key={option.value} type="button" onClick={() => updateAnswers({ useCase: option.value })} className={`rounded-md border p-4 text-left font-semibold ${answers.useCase === option.value ? 'border-reef bg-reef/10 text-reef' : 'border-slate-200'}`}>
                {option.label}
              </button>
            ))}
          </div>
        </QuizStep>
      ) : null}

      {step === 2 ? (
        <QuizStep title="Any fuel preference?">
          <div className="grid gap-3 sm:grid-cols-3">
            {fuels.map((option) => (
              <button key={option.value} type="button" onClick={() => updateAnswers({ fuelPreference: option.value })} className={`rounded-md border p-4 text-left font-semibold ${answers.fuelPreference === option.value ? 'border-reef bg-reef/10 text-reef' : 'border-slate-200'}`}>
                {option.label}
              </button>
            ))}
          </div>
        </QuizStep>
      ) : null}

      {step === 3 ? (
        <QuizStep title="Pick a body style">
          <div className="grid gap-3 sm:grid-cols-3">
            {bodies.map((option) => (
              <button key={option.value} type="button" onClick={() => updateAnswers({ bodyTypePreference: option.value })} className={`rounded-md border p-4 text-left font-semibold ${answers.bodyTypePreference === option.value ? 'border-reef bg-reef/10 text-reef' : 'border-slate-200'}`}>
                {option.label}
              </button>
            ))}
          </div>
        </QuizStep>
      ) : null}

      {step === 4 ? (
        <QuizStep title="What matters most?">
          <div className="grid gap-3 sm:grid-cols-3">
            {priorities.map((option) => (
              <button key={option.value} type="button" onClick={() => togglePriority(option.value)} className={`rounded-md border p-4 text-left font-semibold ${answers.priorities.includes(option.value) ? 'border-reef bg-reef/10 text-reef' : 'border-slate-200'}`}>
                {option.label}
              </button>
            ))}
          </div>
        </QuizStep>
      ) : null}

      <div className="flex justify-between">
        <button type="button" disabled={step === 0} onClick={() => setStep(step - 1)} className="rounded-md border border-slate-300 bg-white px-4 py-2 font-semibold disabled:opacity-40">
          Back
        </button>
        <button type="button" onClick={next} className="rounded-md bg-ink px-4 py-2 font-semibold text-white">
          {step === totalSteps - 1 ? 'See recommendations' : 'Next'}
        </button>
      </div>
    </div>
  );
};
