import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './database';
import { Car } from './car';

interface ShortlistAttributes {
  id: number;
  sessionId: string;
  carId: number;
  createdAt: Date;
}

type ShortlistCreation = Optional<ShortlistAttributes, 'id' | 'createdAt'>;

export class ShortlistItem extends Model<ShortlistAttributes, ShortlistCreation> implements ShortlistAttributes {
  declare id: number;
  declare sessionId: string;
  declare carId: number;
  declare createdAt: Date;
  declare car?: Car;
}

ShortlistItem.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    sessionId: { field: 'session_id', type: DataTypes.STRING(120), allowNull: false },
    carId: { field: 'car_id', type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    createdAt: { field: 'created_at', type: DataTypes.DATE, allowNull: false }
  },
  {
    sequelize,
    tableName: 'shortlist_items',
    updatedAt: false,
    underscored: true,
    indexes: [{ unique: true, fields: ['session_id', 'car_id'] }]
  }
);

ShortlistItem.belongsTo(Car, { foreignKey: 'carId', as: 'car' });
Car.hasMany(ShortlistItem, { foreignKey: 'carId', as: 'shortlistItems' });
