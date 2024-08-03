import React, { useEffect, useState } from 'react';
import HeaderCommon from "../../components/Header/HeaderCommon";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import { graphQLFetch } from '../../Api';
import ItineraryList from './ItineraryList';

const ItineraryContainer = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const userId = user._id || user.sub;
    const [itineraries, setItineraries] = useState([]);

    useEffect(() => {
        // Fetch itinerary list from database based on userId
        const fetchItineraryList = async () => {
            const query = `
            query GetItineraryByUserId($userId: ID!) {
                getItineraryByUserId(userId: $userId) {
                userId
                _id
                name
                scheduleData
                updatedAt
                createdAt
              }
            }`;

            const data = await graphQLFetch(query, { userId });
            if (data && data.getItineraryByUserId) {
                setItineraries(data.getItineraryByUserId);
            } else {
                console.error("Failed to fetch Itinerary List");
            }
        };

        fetchItineraryList();
    }, [userId]);

    return (
        <>
            <HeaderCommon />
            <ItineraryList itineraries={itineraries} setItineraries={setItineraries} />
        </>
    );
};

export default ItineraryContainer;