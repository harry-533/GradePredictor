import React from "react";
import { useLocation } from "react-router-dom";
import '../questionnaire.css';

function Results() {
    const location = useLocation();
    const { predictedGrade } = location.state || {};

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