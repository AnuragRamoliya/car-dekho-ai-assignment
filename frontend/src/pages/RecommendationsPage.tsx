import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { CarCard } from '../components/CarCard';
import { useQuizStore } from '../store/quizStore';
import { useShortlistStore } from '../store/shortlistStore';
import { RecommendedCar } from '../types/car';

export const RecommendationsPage = () => {
  const { answers } = useQuizStore();
  const shortlist = useShortlistStore();
  const [results, setResults] = useState<RecommendedCar[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    shortlist.load().catch(() => undefined);
    api
      .getRecommendations(answers)
      .then((response) => setResults(response.data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-600">Finding your best matches...</p>;
  if (error) return <p className="rounded-md bg-red-50 p-4 text-red-700">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-semibold uppercase tracking-wide text-coral">Ranked matches</p>
          <h1 className="text-3xl font-bold text-ink">Your confident shortlist starters</h1>
        </div>
        <Link to="/quiz" className="rounded-md border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700">
          Edit answers
        </Link>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {results.map((item) => (
          <CarCard
            key={item.car.id}
            car={item.car}
            matchScore={item.matchScore}
            matchReason={item.matchReason}
            shortlisted={shortlist.isShortlisted(item.car.id)}
            onAdd={shortlist.add}
          />
        ))}
      </div>
    </div>
  );
};
