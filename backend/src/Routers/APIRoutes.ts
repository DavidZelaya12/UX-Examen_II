import { restaurant_aviability, restaurants } from "../database";
import { Router } from "express";
import { Op } from "sequelize";

const restaurantsRouter = Router();

restaurantsRouter.get("/", async (req, res) => {
    const allRestaurants = await restaurants.findAll();
    res.json(allRestaurants);
});

restaurantsRouter.get("availability/", async (req, res) => {
    const ActualDate = new Date();
    const futureReservations = await restaurant_aviability.findAll({
        where: {
            date: {
                [Op.gte]: ActualDate
            },
            reserved: 0
        },
        order: [['date', 'ASC']]
    });
    res.json(futureReservations);
});

restaurantsRouter.put("reserve/", async (req, res) => {
    const { personName, schedule_time, restaurant_id } = req.body;
    const reservation = await restaurant_aviability.create(
        {
            restaurant_id: restaurant_id,
            schedule_time: schedule_time,
            reserved_by: personName
        }
    )
    res.json(reservation);
});

export default restaurantsRouter;