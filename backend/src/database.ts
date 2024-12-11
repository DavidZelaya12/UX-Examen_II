import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        logging: false,
        dialectOptions: process.env.NODE_ENV === 'production' ? {
            ssl: {
                require: true,
                rejectUnauthorized: false, // Esto permite conexiones con certificados no verificados (necesario para Heroku).
            },
        } : {},
    })
    : new Sequelize(
        process.env.PGDATABASE || '',
        process.env.PGUSER || '',
        process.env.PGPASSWORD || '',
        {
            host: process.env.PGHOST || 'localhost',
            dialect: 'postgres',
            port: parseInt(process.env.PGPORT || '5433', 10),
            dialectOptions: process.env.NODE_ENV === 'production' ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            } : {},
        }
    );


export const restaurants = sequelize.define('restaurants', {
    IDRestaurant: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: null,
        unique: true
    },
    Description: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: null,
        unique: true
    }
}, {
    freezeTableName: true,
}
);

export const restaurant_aviability = sequelize.define('restaurant_aviability', {
    ID_Aviability: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    IDRestaurant: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: restaurants,
            key: 'IDRestaurant'
        }
    },
    scheduled_time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: null,
    },
    reserved: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: false,
    },
    reserved_by: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    }

}, {
    freezeTableName: true,
}
);

restaurants.hasMany(restaurant_aviability, { foreignKey: 'IDRestaurant' });
restaurant_aviability.belongsTo(restaurants, { foreignKey: 'IDRestaurant' });


