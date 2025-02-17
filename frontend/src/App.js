import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Questionnaire from "./components/Questionnaire";
import Results from "./components/Results";

function App() {
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
