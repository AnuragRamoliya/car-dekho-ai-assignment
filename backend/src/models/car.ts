import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './database';

export type BodyType = 'hatchback' | 'sedan' | 'suv' | 'muv' | 'coupe';
export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng';
export type Transmission = 'manual' | 'automatic';

export interface CarAttributes {
  id: number;
  make: string;
  model: string;
  variant: string;
  bodyType: BodyType;
  fuelType: FuelType;
  transmission: Transmission;
  priceMin: number;
  priceMax: number;
  mileageKmpl: number | null;
  rangeKm: number | null;
  seatingCapacity: number;
  safetyRating: number;
  engineCc: number | null;
  batteryKwh: number | null;
  powerBhp: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

type CarCreation = Optional<
  CarAttributes,
  'id' | 'mileageKmpl' | 'rangeKm' | 'engineCc' | 'batteryKwh' | 'createdAt' | 'updatedAt'
>;

export class Car extends Model<CarAttributes, CarCreation> implements CarAttributes {
  declare id: number;
  declare make: string;
  declare model: string;
  declare variant: string;
  declare bodyType: BodyType;
  declare fuelType: FuelType;
  declare transmission: Transmission;
  declare priceMin: number;
  declare priceMax: number;
  declare mileageKmpl: number | null;
  declare rangeKm: number | null;
  declare seatingCapacity: number;
  declare safetyRating: number;
  declare engineCc: number | null;
  declare batteryKwh: number | null;
  declare powerBhp: number;
  declare imageUrl: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Car.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    make: { type: DataTypes.STRING(80), allowNull: false },
    model: { type: DataTypes.STRING(120), allowNull: false },
    variant: { type: DataTypes.STRING(120), allowNull: false },
    bodyType: {
      field: 'body_type',
      type: DataTypes.ENUM('hatchback', 'sedan', 'suv', 'muv', 'coupe'),
      allowNull: false
    },
    fuelType: {
      field: 'fuel_type',
      type: DataTypes.ENUM('petrol', 'diesel', 'electric', 'hybrid', 'cng'),
      allowNull: false
    },
    transmission: { type: DataTypes.ENUM('manual', 'automatic'), allowNull: false },
    priceMin: { field: 'price_min', type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    priceMax: { field: 'price_max', type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    mileageKmpl: { field: 'mileage_kmpl', type: DataTypes.FLOAT, allowNull: true },
    rangeKm: { field: 'range_km', type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    seatingCapacity: { field: 'seating_capacity', type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    safetyRating: { field: 'safety_rating', type: DataTypes.FLOAT, allowNull: false },
    engineCc: { field: 'engine_cc', type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    batteryKwh: { field: 'battery_kwh', type: DataTypes.FLOAT, allowNull: true },
    powerBhp: { field: 'power_bhp', type: DataTypes.FLOAT, allowNull: false },
    imageUrl: { field: 'image_url', type: DataTypes.STRING(500), allowNull: false },
    createdAt: { field: 'created_at', type: DataTypes.DATE, allowNull: false },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE, allowNull: false }
  },
  {
    sequelize,
    tableName: 'cars',
    underscored: true
  }
);
