import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { CarCard } from '../components/CarCard';
import { FilterBar } from '../components/FilterBar';
import { useFilterStore } from '../store/filterStore';
import { useShortlistStore } from '../store/shortlistStore';
import { Car } from '../types/car';

export const BrowsePage = () => {
  const filters = useFilterStore();
  const shortlist = useShortlistStore();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    shortlist.load().catch(() => undefined);
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .listCars(filters)
      .then((response) => setCars(response.data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters.search, filters.bodyType, filters.fuelType, filters.minPrice, filters.maxPrice, filters.sortBy]);

  return (
    <div className="space-y-6">
      <div>
        <p className="font-semibold uppercase tracking-wide text-coral">Full catalog</p>
        <h1 className="text-3xl font-bold text-ink">Browse and filter cars</h1>
      </div>
      <FilterBar />
      {loading ? <p className="text-slate-600">Loading cars...</p> : null}
      {error ? <p className="rounded-md bg-red-50 p-4 text-red-700">{error}</p> : null}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} shortlisted={shortlist.isShortlisted(car.id)} onAdd={shortlist.add} />
        ))}
      </div>
    </div>
  );
};
