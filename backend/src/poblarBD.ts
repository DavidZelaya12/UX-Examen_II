import { restaurants, restaurant_aviability } from "./database";


export const poblarBD = async () => {

    await restaurants.create({
        Name: 'La Casca',
        Description: 'Consumo en el lugar · Terraza o mesas al aire libre · Retiro desde el coche'
    });

    await restaurants.create({
        Name: 'Portal de las carnes',
        Description: 'Disfrute de las mejores carnes y vinos en un ambiente único de la ciudad de San Pedro Sula.\n'
    });

    await restaurants.create({
        Name: 'Factory Steak & Lobster\n',
        Description: 'Experience the best steak and lobster in San Pedro Sula at Factory Steak and Lobster'
    });

    await restaurant_aviability.create({
        IDRestaurant: 1,
        scheduled_time: '2023-06-20 08:00:00',
        reserved: 0,
        reserved_by: null
    });

    await restaurant_aviability.create({

        IDRestaurant: 1,
        scheduled_time: '2023-06-20 09:00:00',
        reserved: 0,
        reserved_by: null
    });

    await restaurant_aviability.create({
        IDRestaurant: 2,
        scheduled_time: '2023-06-21 10:00:00',
        reserved: 0,
        reserved_by: null
    });

    await restaurant_aviability.create({
        IDRestaurant: 2,
        scheduled_time: '2023-06-21 11:00:00',
        reserved: 0,
        reserved_by: null
    });

    await restaurant_aviability.create({
        IDRestaurant: 3,
        scheduled_time: '2023-06-22 07:00:00',
        reserved: 0,
        reserved_by: null
    });

    await restaurant_aviability.create({
        IDRestaurant: 3,
        scheduled_time: '2023-06-22 09:00:00',
        reserved: 0,
        reserved_by: null
    });

    await restaurant_aviability.create({
        IDRestaurant: 1,
        scheduled_time: '2021-06-20 08:00:00',
        reserved: 0,
        reserved_by: null
    });

    console.log('Base de datos poblada');

}

