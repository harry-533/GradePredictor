import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Questionnaire from "./components/Questionnaire";
import Results from "./components/Results";

function App() {
    const [data, setData] = useState("");

    useEffect(() => {
        axios.get("https://gradepredictor.onrender.com/api/data")
            .then(response => setData(response.data.data))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Questionnaire />} />
                <Route path="/results" element={<Results />} />
            </Routes>
        </Router>
    );
}

export default App;
