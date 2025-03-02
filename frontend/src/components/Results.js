import React from "react";
import { useLocation } from "react-router-dom";
import '../questionnaire.css';

// The page that displays the prediction
function Results() {
    // Gets the route and extracts the prediction
    const location = useLocation();
    const { predictedGrade } = location.state || {};

    // The HTML of the result page
    return (
        <div className="wrapper">
            <div className="container">
                <h2 className="predicted">Your Predicted Grade:</h2>
                <h1 className="grade">{predictedGrade}%</h1>
            </div>
        </div>
    ); 
}

export default Results;
