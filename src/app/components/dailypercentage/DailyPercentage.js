"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

import c3 from 'c3';
import 'c3/c3.css';

const DailyPercentage = ({ shouldRefresh }) => {
    const [percentage, setPercentage] = useState(0);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/doses/dailypercentage`)
            .then(response => {
                if (response.data !== null) {
                    setPercentage(response.data);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the percentage data: ", error);
                setLoading(false);
            });
    }, [shouldRefresh]);

    useEffect(() => {
        if (!loading) {
            const chart = c3.generate({
                bindto: '#daily-percentage-chart',
                data: {
                    columns: [
                        ['Remaining', 100 - percentage],
                        ['Percentage', percentage]
                    ],
                    type: 'donut',
                    order: null,
                    colors: {
                        Percentage: '#8884d8',
                        Remaining: '#f4f4f4'
                    }
                },
                donut: {
                    title: `${percentage}%`,
                    width: 30,
                    startingAngle: 1.5 * Math.PI
                },
                transition: {
                    duration: 1500
                }
            });

            // Cleanup on unmount
            return () => {
                chart.destroy();
            };
        }
    }, [loading, percentage]);

    return (
        <div id="daily-percentage-chart"></div>
    );
}

export default DailyPercentage;
