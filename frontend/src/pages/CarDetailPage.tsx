import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useShortlistStore } from '../store/shortlistStore';
import { Car } from '../types/car';

const galleryFallbacks = [
  'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1100&q=80',
  'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1100&q=80',
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1100&q=80',
  'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1100&q=80'
];

const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);

const priceInLakh = (value: number) => `${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 2)} Lakh`;

const titleCase = (value: string) => value.replace(/\b\w/g, (letter) => letter.toUpperCase());

const DetailStat = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-4 last:border-b-0">
    <span className="text-slate-500">{label}</span>
    <strong className="text-right text-ink">{value}</strong>
  </div>
);

type SpecValue = string | boolean;

interface SpecSection {
  title: string;
  rows: Array<[string, SpecValue]>;
}

const renderSpecValue = (value: SpecValue) => {
  if (typeof value === 'boolean') {
    return value ? <span className="font-bold text-emerald-600">✓</span> : <span className="font-bold text-red-500">✕</span>;
  }
  return <span>{value}</span>;
};

const OfferStrip = () => (
  <div className="my-4 flex flex-col gap-3 rounded-md border border-orange-100 bg-orange-50 p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
    <span className="font-medium text-slate-600">Don&apos;t miss out on the best offers for this Month</span>
    <button type="button" className="rounded-md border border-coral bg-white px-4 py-2 font-bold text-coral">
      View July Offers
    </button>
  </div>
);

const SpecTable = ({ section }: { section: SpecSection }) => (
  <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-200 px-5 py-4">
      <h3 className="text-xl font-bold text-ink">{section.title}</h3>
    </div>
    <div className="divide-y divide-slate-100 px-5">
      {section.rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[1fr_auto] gap-4 py-3 text-sm">
          <span className="text-slate-500">{label}</span>
          <strong className="max-w-48 text-right text-ink sm:max-w-none">{renderSpecValue(value)}</strong>
        </div>
      ))}
    </div>
    <div className="px-5 pb-1 pt-2 text-right text-xs font-semibold text-blue-600">Report Incorrect Specs</div>
    <OfferStrip />
  </section>
);

const buildSpecSections = (car: Car): SpecSection[] => {
  const isElectric = car.fuelType === 'electric';
  const engineValue = isElectric ? `${car.batteryKwh ?? 35} kWh battery` : `${car.engineCc ?? 1199} cc`;
  const fuelCapacity = car.fuelType === 'cng' ? '60 Litres' : car.fuelType === 'electric' ? `${car.rangeKm ?? 421} km range` : '37 Litres';
  const powerValue = `${car.powerBhp} bhp`;
  const torqueValue = car.powerBhp >= 140 ? '170 Nm' : car.fuelType === 'electric' ? '190 Nm' : '103 Nm';
  const gearbox = car.transmission === 'automatic' ? '5-Speed AMT / DCT' : '5-Speed Manual';

  return [
    {
      title: 'Engine & Transmission',
      rows: [
        ['Engine Type', isElectric ? 'Permanent magnet motor' : '1.2 l Revotron'],
        ['Displacement', engineValue],
        ['Max Power', powerValue],
        ['Max Torque', torqueValue],
        ['No. of Cylinders', isElectric ? 'Not Applicable' : '3'],
        ['Valves Per Cylinder', isElectric ? 'Not Applicable' : '4'],
        ['Turbo Charger', car.powerBhp > 120],
        ['Transmission Type', titleCase(car.transmission)],
        ['Gearbox', gearbox],
        ['Drive Type', 'FWD']
      ]
    },
    {
      title: 'Fuel & Performance',
      rows: [
        ['Fuel Type', titleCase(car.fuelType)],
        [car.fuelType === 'electric' ? 'Driving Range' : 'Fuel Tank Capacity', fuelCapacity],
        ['Mileage / Range', car.fuelType === 'electric' ? `${car.rangeKm} km` : `${car.mileageKmpl} kmpl`],
        ['Emission Norm Compliance', isElectric ? 'Zero Tailpipe Emissions' : 'BS VI 2.0']
      ]
    },
    {
      title: 'Suspension, Steering & Brakes',
      rows: [
        ['Front Suspension', 'MacPherson Strut suspension'],
        ['Rear Suspension', 'Rear twist beam'],
        ['Steering Type', 'Electric'],
        ['Steering Column', 'Tilt'],
        ['Front Brake Type', 'Disc'],
        ['Rear Brake Type', 'Drum']
      ]
    },
    {
      title: 'Dimensions & Capacity',
      rows: [
        ['Length', car.bodyType === 'muv' ? '4395 mm' : '3876 mm'],
        ['Width', car.bodyType === 'muv' ? '1735 mm' : '1742 mm'],
        ['Height', car.bodyType === 'sedan' ? '1507 mm' : '1615 mm'],
        ['Boot Space', car.bodyType === 'muv' ? '209 Litres' : '210 Litres'],
        ['Seating Capacity', `${car.seatingCapacity}`],
        ['Ground Clearance Unladen', car.bodyType === 'suv' ? '193 mm' : '165 mm'],
        ['Wheel Base', car.bodyType === 'muv' ? '2740 mm' : '2445 mm']
      ]
    },
    {
      title: 'Comfort & Convenience',
      rows: [
        ['Power Steering', true],
        ['Air Conditioner', true],
        ['Heater', true],
        ['Adjustable Steering', 'Height only'],
        ['Height Adjustable Driver Seat', true],
        ['Automatic Climate Control', car.priceMax > 1000000],
        ['Air Quality Control', car.priceMax > 1200000],
        ['Accessory Power Outlet', true],
        ['Rear Seat Headrest', 'Adjustable'],
        ['Rear Seat Centre Arm Rest', car.seatingCapacity >= 7],
        ['Rear AC Vents', car.bodyType === 'muv' || car.priceMax > 1200000],
        ['Cruise Control', car.priceMax > 1000000],
        ['Parking Sensors', 'Rear'],
        ['Real-Time Vehicle Tracking', car.priceMax > 1200000],
        ['KeyLess Entry', true],
        ['Engine Start/Stop Button', car.transmission === 'automatic'],
        ['USB Charger', 'Front & Rear'],
        ['Central Console Armrest', true],
        ['Drive Modes', car.fuelType === 'electric' ? '3' : '2'],
        ['Idle Start-Stop System', car.fuelType !== 'electric'],
        ['Power Windows', 'Front & Rear']
      ]
    },
    {
      title: 'Interior',
      rows: [
        ['Leather Wrapped Steering Wheel', car.priceMax > 1000000],
        ['Leather wrap gear-shift selector', car.priceMax > 1000000],
        ['Glove Box', true],
        ['Lighting', 'Ambient light'],
        ['Additional Features', 'Parcel Tray'],
        ['Digital Cluster', true],
        ['Digital Cluster Size', car.priceMax > 1400000 ? '10.25 inch' : '7 inch']
      ]
    },
    {
      title: 'Exterior',
      rows: [
        ['Adjustable Headlamps', true],
        ['Rain Sensing Wiper', car.priceMax > 1200000],
        ['Rear Window Wiper', car.bodyType !== 'sedan'],
        ['Rear Window Washer', car.bodyType !== 'sedan'],
        ['Rear Window Defogger', true],
        ['Wheel Covers', car.priceMax <= 900000],
        ['Alloy Wheels', car.priceMax > 900000],
        ['Rear Spoiler', car.bodyType !== 'sedan'],
        ['Outside Rear View Mirror Turn Indicators', true],
        ['Cornering Foglamps', car.priceMax > 1000000],
        ['Roof Rails', car.bodyType === 'suv' || car.bodyType === 'muv'],
        ['Automatic Headlamps', car.priceMax > 1200000],
        ['Antenna', 'Shark Fin'],
        ['Sunroof', car.priceMax > 1400000 ? 'Single Pane' : false],
        ['Outside Rear View Mirror (ORVM)', 'Powered & Folding'],
        ['Tyre Size', car.bodyType === 'suv' ? '195/60 R16' : '185/65 R15'],
        ['Tyre Type', 'Radial Tubeless'],
        ['LED DRLs', true],
        ['LED Headlamps', car.priceMax > 900000],
        ['LED Taillights', true],
        ['LED Fog Lamps', car.priceMax > 1000000]
      ]
    },
    {
      title: 'Safety',
      rows: [
        ['Anti-lock Braking System (ABS)', true],
        ['Central Locking', true],
        ['Child Safety Locks', true],
        ['No. of Airbags', car.safetyRating >= 5 ? '6' : '2'],
        ['Driver Airbag', true],
        ['Passenger Airbag', true],
        ['Side Airbag', car.safetyRating >= 5],
        ['Day & Night Rear View Mirror', true],
        ['Electronic Brakeforce Distribution (EBD)', true],
        ['Tyre Pressure Monitoring System (TPMS)', true],
        ['Engine Immobilizer', true],
        ['Electronic Stability Control (ESC)', car.safetyRating >= 4],
        ['Rear Camera', 'With Guidelines'],
        ['ISOFIX Child Seat Mounts', car.safetyRating >= 4],
        ['Hill Descent Control', car.bodyType === 'suv' && car.priceMax > 1300000],
        ['Hill Assist', car.bodyType === 'suv'],
        ['360 View Camera', car.priceMax > 1500000],
        ['Bharat NCAP Safety Rating', `${Math.round(car.safetyRating)} Star`],
        ['Bharat NCAP Child Safety Rating', car.safetyRating >= 5 ? '5 Star' : '3 Star']
      ]
    },
    {
      title: 'Entertainment & Communication',
      rows: [
        ['Radio', true],
        ['Wireless Phone Charging', car.priceMax > 1400000],
        ['Bluetooth Connectivity', true],
        ['Touchscreen', true],
        ['Touchscreen Size', car.priceMax > 1200000 ? '10.24 inch' : '8 inch'],
        ['Android Auto', true],
        ['Apple CarPlay', true],
        ['No. of Speakers', car.priceMax > 1200000 ? '6' : '4'],
        ['Usb Ports', true],
        ['Tweeters', car.priceMax > 1200000 ? '4' : '2'],
        ['Additional Features', 'Wireless Android Auto and Apple Carplay'],
        ['Speakers', 'Front & Rear']
      ]
    },
    {
      title: 'ADAS Feature',
      rows: [['Blind Spot Monitor', car.priceMax > 1400000]]
    },
    {
      title: 'Advance Internet Feature',
      rows: [
        ['Live Location', true],
        ['Remote Immobiliser', car.priceMax > 1200000],
        ['Unauthorised Vehicle entry', true],
        ['Engine Start Alarm', true],
        ['Remote Vehicle Status Check', true],
        ['PUC Expiry', true],
        ['Navigation with Live Traffic', true],
        ['E-Call & I-Call', car.priceMax > 1200000],
        ['Over the Air (OTA) Updates', car.fuelType === 'electric'],
        ['Google / Alexa Connectivity', car.priceMax > 1200000],
        ['Crash Notification', true],
        ['SOS Button', true],
        ['RSA', true],
        ['Over Speeding Alert', true],
        ['In Car Remote Control App', car.priceMax > 1200000],
        ['Remote AC On/Off', car.fuelType === 'electric'],
        ['Remote Door Lock/Unlock', car.priceMax > 1200000],
        ['Remote Vehicle Ignition Start/Stop', car.priceMax > 1400000]
      ]
    }
  ];
};

export const CarDetailPage = () => {
  const { id } = useParams();
  const shortlist = useShortlistStore();
  const [car, setCar] = useState<Car | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    shortlist.load().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .getCar(id)
      .then((response) => setCar(response.data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const gallery = useMemo(() => {
    if (!car) return [];
    return [car.imageUrl, ...galleryFallbacks].slice(0, 5);
  }, [car]);

  if (loading) return <p className="text-slate-600">Loading car details...</p>;
  if (error) return <p className="rounded-md bg-red-50 p-4 text-red-700">{error}</p>;
  if (!car) return <p className="rounded-md bg-white p-6 text-slate-600">Car not found.</p>;

  const isShortlisted = shortlist.isShortlisted(car.id);
  const emi = Math.round(car.priceMin * 0.019);
  const efficiency = car.fuelType === 'electric' ? `${car.rangeKm} km range` : `${car.mileageKmpl} kmpl`;
  const specSections = buildSpecSections(car);
  const keyFeatures = [
    'Power Steering',
    'Anti-lock Braking System (ABS)',
    'Air Conditioner',
    'Driver Airbag',
    'Passenger Airbag',
    'Automatic Climate Control',
    'Alloy Wheels',
    'Multi-function Steering Wheel',
    'Engine Start Stop Button'
  ];

  return (
    <div className="space-y-7">
      <nav className="-mx-4 overflow-x-auto border-y border-slate-200 bg-white px-4">
        <div className="flex min-w-max gap-8 text-sm font-semibold uppercase text-slate-500">
          {['Overview', 'Price', 'Images', 'Specs', 'Variants', 'Compare'].map((item, index) => (
            <a
              key={item}
              href={index === 0 ? '#overview' : `#${item.toLowerCase()}`}
              className={`border-b-2 py-4 ${index === 0 ? 'border-coral text-coral' : 'border-transparent hover:text-ink'}`}
            >
              {item}
            </a>
          ))}
        </div>
      </nav>

      <section id="overview" className="grid gap-7 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white">
            <img src={gallery[activeImage]} alt={`${car.make} ${car.model}`} className="h-72 w-full object-cover sm:h-96" />
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
              <span className="rounded-md bg-white px-3 py-2 text-sm font-bold shadow">▦ {gallery.length * 28} Photos</span>
              <span className="rounded-md bg-white px-3 py-2 text-sm font-bold shadow">▶ Shorts</span>
              <span className="rounded-md bg-white px-3 py-2 text-sm font-bold shadow">◉ {car.fuelType}</span>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2" id="images">
            {gallery.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveImage(index)}
                className={`overflow-hidden rounded-md border-2 ${activeImage === index ? 'border-coral' : 'border-white'}`}
                aria-label={`View photo ${index + 1}`}
              >
                <img src={image} alt="" className="h-16 w-full object-cover sm:h-20" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="font-semibold uppercase tracking-wide text-coral">{car.make}</p>
            <h1 className="text-3xl font-bold text-ink md:text-4xl">
              {car.make} {car.model}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              <span className="font-bold text-ink">{car.safetyRating} ★</span>
              <span className="text-slate-500">Safety rating</span>
              <span className="rounded-md border border-slate-200 px-2 py-1 font-semibold">{car.variant}</span>
            </div>
          </div>

          <p className="max-w-3xl leading-7 text-slate-600">
            The {car.make} {car.model} is a {titleCase(car.bodyType)} focused on {car.seatingCapacity}-seat practicality,
            {` ${efficiency}`}, and {car.powerBhp} bhp performance. This detail page brings the photo gallery, price,
            specs, and shortlist action into one responsive view.
          </p>

          <div id="price">
            <h2 className="text-2xl font-bold text-ink">
              {priceInLakh(car.priceMin)} - {priceInLakh(car.priceMax)}*
            </h2>
            <p className="text-sm text-slate-500">*Estimated ex-showroom price range</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => shortlist.add(car.id)}
              disabled={isShortlisted}
              className="rounded-md bg-coral px-6 py-3 font-bold text-white disabled:bg-slate-400"
            >
              {isShortlisted ? 'Added to shortlist' : 'Add to shortlist'}
            </button>
            <Link to="/shortlist" className="rounded-md border border-slate-300 bg-white px-6 py-3 font-bold text-slate-700">
              Compare shortlist
            </Link>
          </div>

          <p className="text-sm font-medium text-slate-600">◇ Hurry up to lock festive offers!</p>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div id="specs" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-bold text-ink">{car.make} {car.model} specs & features</h2>
          <div className="mt-5 flex gap-8 border-b border-slate-200 text-sm font-semibold">
            <span className="border-b-2 border-coral pb-3 text-ink">Key Specifications</span>
            <span className="pb-3 text-slate-500">Highlights</span>
          </div>
          <div className="grid gap-x-12 md:grid-cols-2">
            <DetailStat label={car.fuelType === 'electric' ? 'Battery' : 'Engine'} value={car.fuelType === 'electric' ? `${car.batteryKwh} kWh` : `${car.engineCc} cc`} />
            <DetailStat label="Mileage / Range" value={efficiency} />
            <DetailStat label="Power" value={`${car.powerBhp} bhp`} />
            <DetailStat label="Safety Rating" value={`${car.safetyRating}/5`} />
            <DetailStat label="Transmission" value={titleCase(car.transmission)} />
            <DetailStat label="Seating Capacity" value={`${car.seatingCapacity} seats`} />
            <DetailStat label="Body Type" value={titleCase(car.bodyType)} />
            <DetailStat label="Fuel Type" value={titleCase(car.fuelType)} />
          </div>
          <Link to="/browse" className="mt-5 inline-block font-bold text-coral">
            View all cars and compare →
          </Link>
        </div>

        <aside className="space-y-5">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-ink">Calculate EMI</h2>
            <p className="mt-3 text-sm text-slate-500">Your monthly EMI</p>
            <p className="text-2xl font-bold text-ink">{formatPrice(emi)}</p>
            <p className="mt-2 text-sm text-slate-500">Interest calculated at 9.8% for 48 months</p>
            <button type="button" className="mt-5 w-full rounded-md border border-coral px-4 py-3 font-bold text-coral">
              View EMI Offers
            </button>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-ink">{car.make} {car.model} brochure</h2>
            <p className="mt-2 text-sm text-slate-500">Download the key details before you compare.</p>
            <button type="button" className="mt-5 w-full rounded-md bg-ink px-4 py-3 font-bold text-white">
              Download PDF
            </button>
          </div>
        </aside>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-bold text-ink">Key specifications of {car.make} {car.model}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ['Fuel Type', titleCase(car.fuelType)],
                ['Engine / Battery', car.fuelType === 'electric' ? `${car.batteryKwh} kWh` : `${car.engineCc} cc`],
                ['Max Power', `${car.powerBhp} bhp`],
                ['Seating Capacity', `${car.seatingCapacity}`],
                ['Transmission Type', titleCase(car.transmission)],
                ['Body Type', titleCase(car.bodyType)],
                ['Mileage / Range', efficiency],
                ['Ground Clearance', car.bodyType === 'suv' ? '193 mm' : '165 mm'],
                ['Safety Rating', `${car.safetyRating}/5`]
              ].map(([label, value]) => (
                <div key={label} className="rounded-md border border-slate-100 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-1 font-bold text-ink">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-bold text-ink">Key features of {car.make} {car.model}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {keyFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-3 rounded-md border border-slate-100 bg-white p-3 text-sm font-semibold text-ink">
                  <span className="text-emerald-600">✓</span>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-ink">{car.make} {car.model} specifications</h2>
            {specSections.map((section) => (
              <SpecTable key={section.title} section={section} />
            ))}
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-5 lg:self-start">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-ink">Specs index</h2>
            <div className="mt-4 space-y-2 text-sm">
              {specSections.map((section) => (
                <a key={section.title} href="#specs" className="block rounded-md px-3 py-2 font-semibold text-slate-600 hover:bg-slate-50 hover:text-coral">
                  {section.title}
                </a>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-orange-100 bg-orange-50 p-5 shadow-sm">
            <h2 className="text-xl font-bold text-ink">View latest offers</h2>
            <p className="mt-2 text-sm text-slate-600">Check city-wise offers and EMI choices before you shortlist.</p>
            <button type="button" className="mt-5 w-full rounded-md bg-coral px-4 py-3 font-bold text-white">
              View July Offers
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
};
