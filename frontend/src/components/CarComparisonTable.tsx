import { Car } from '../types/car';

const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export const CarComparisonTable = ({ cars, onRemove }: { cars: Car[]; onRemove: (carId: number) => void }) => {
  if (!cars.length) {
    return <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">Your shortlist is empty.</div>;
  }

  const rows = [
    ['Price', (car: Car) => `${formatPrice(car.priceMin)} - ${formatPrice(car.priceMax)}`],
    ['Fuel', (car: Car) => car.fuelType],
    ['Body', (car: Car) => car.bodyType],
    ['Transmission', (car: Car) => car.transmission],
    ['Efficiency', (car: Car) => (car.fuelType === 'electric' ? `${car.rangeKm} km` : `${car.mileageKmpl} kmpl`)],
    ['Seats', (car: Car) => String(car.seatingCapacity)],
    ['Safety', (car: Car) => `${car.safetyRating}/5`],
    ['Power', (car: Car) => `${car.powerBhp} bhp`]
  ] as const;

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 bg-white p-4 text-left text-slate-500">Spec</th>
            {cars.map((car) => (
              <th key={car.id} className="min-w-56 border-l border-slate-200 p-4 text-left">
                <div className="font-bold text-ink">{car.make} {car.model}</div>
                <div className="font-medium text-slate-500">{car.variant}</div>
                <button type="button" onClick={() => onRemove(car.id)} className="mt-3 rounded-md bg-coral px-3 py-2 text-xs font-semibold text-white">
                  Remove
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, render]) => (
            <tr key={label} className="border-t border-slate-200">
              <td className="sticky left-0 bg-white p-4 font-semibold text-slate-600">{label}</td>
              {cars.map((car) => (
                <td key={`${label}-${car.id}`} className="border-l border-slate-200 p-4 capitalize">
                  {render(car)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
