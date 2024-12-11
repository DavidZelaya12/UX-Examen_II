import React from 'react';
import React, { useState } from 'react';

const RestaurantCard = ({ name, description }) => {
    const [showAvailability, setShowAvailability] = useState(false);
    const [selectedTime, setSelectedTime] = useState('');
    const [userName, setUserName] = useState('');

    const handleAvailabilityClick = () => {
        setShowAvailability(!showAvailability);
    };

    const handleReserve = () => {
        fetch('http://localhost:8000/restaurants/reserve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: userName, time: selectedTime }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Reservation successful:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div className="restaurant-card">
            <h2>{name}</h2>
            <p>{description}</p>
            <button onClick={handleAvailabilityClick}>Ver disponibilidad</button>
            {showAvailability && (
                <div>
                    <h3>Horarios disponibles</h3>
                    <label>
                        <input
                            type="checkbox"
                            value="12:00 PM"
                            onChange={(e) => setSelectedTime(e.target.value)}
                        />
                        12:00 PM
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="1:00 PM"
                            onChange={(e) => setSelectedTime(e.target.value)}
                        />
                        1:00 PM
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="2:00 PM"
                            onChange={(e) => setSelectedTime(e.target.value)}
                        />
                        2:00 PM
                    </label>
                    <input
                        type="text"
                        placeholder="Ingrese su nombre"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <button onClick={handleReserve}>Reservar</button>
                </div>
            )}
        </div>
    );
};

export default RestaurantCard;