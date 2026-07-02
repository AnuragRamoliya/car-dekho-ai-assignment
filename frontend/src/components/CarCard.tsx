import { Link } from 'react-router-dom';
import { Car } from '../types/car';
import { MatchReasonBadge } from './MatchReasonBadge';

const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

interface CarCardProps {
  car: Car;
  matchScore?: number;
  matchReason?: string;
  shortlisted?: boolean;
  onAdd?: (carId: number) => void;
}

export const CarCard = ({ car, matchScore, matchReason, shortlisted, onAdd }: CarCardProps) => (
  <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <Link to={`/cars/${car.id}`} className="block">
      <img src={car.imageUrl} alt={`${car.make} ${car.model}`} className="h-44 w-full object-cover" />
    </Link>
    <div className="space-y-4 p-4">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-coral">{car.make}</p>
        <Link to={`/cars/${car.id}`} className="block">
          <h3 className="text-xl font-bold text-ink hover:text-reef">
            {car.model} <span className="text-base font-medium text-slate-500">{car.variant}</span>
          </h3>
        </Link>
      </div>
      {matchScore !== undefined && matchReason ? <MatchReasonBadge score={matchScore} reason={matchReason} /> : null}
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-slate-500">Price</dt>
          <dd className="font-semibold">{formatPrice(car.priceMin)} - {formatPrice(car.priceMax)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Efficiency</dt>
          <dd className="font-semibold">{car.fuelType === 'electric' ? `${car.rangeKm} km` : `${car.mileageKmpl} kmpl`}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Safety</dt>
          <dd className="font-semibold">{car.safetyRating}/5</dd>
        </div>
        <div>
          <dt className="text-slate-500">Power</dt>
          <dd className="font-semibold">{car.powerBhp} bhp</dd>
        </div>
      </dl>
      <div className="flex gap-3">
        <Link to={`/cars/${car.id}`} className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">
          View details
        </Link>
        {onAdd ? (
          <button
            type="button"
            disabled={shortlisted}
            onClick={() => onAdd(car.id)}
            className="rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white disabled:bg-slate-400"
          >
            {shortlisted ? 'Shortlisted' : 'Add to shortlist'}
          </button>
        ) : null}
      </div>
    </div>
  </article>
);
