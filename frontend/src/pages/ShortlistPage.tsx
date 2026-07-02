import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CarComparisonTable } from '../components/CarComparisonTable';
import { useShortlistStore } from '../store/shortlistStore';

export const ShortlistPage = () => {
  const shortlist = useShortlistStore();

  useEffect(() => {
    shortlist.load().catch(() => undefined);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-semibold uppercase tracking-wide text-coral">Comparison</p>
          <h1 className="text-3xl font-bold text-ink">Your shortlisted cars</h1>
        </div>
        <Link to="/browse" className="rounded-md bg-reef px-4 py-2 font-semibold text-white">
          Add more cars
        </Link>
      </div>
      <CarComparisonTable cars={shortlist.cars} onRemove={shortlist.remove} />
    </div>
  );
};
