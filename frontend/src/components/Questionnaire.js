import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import '../questionnaire.css';

// All of the questions are used to get all the data in the original dataset
const questions = [
    { question: "How many hours do you study per week?", short: "study", type: "number" },
    { question: "What is your current attendance?", short: "attendance", type: "number" },
    { question: "How would you rate your access to educational resources (e.g., books, internet, tutoring, study materials)?", short: "resources", type: "buttons", options: ["Low", "Medium", "High"] },
    { question: "How involved are your parents in your education?", short: "parents", type: "buttons", options: ["Low", "Medium", "High"] },
    { question: "Do you currently participate in any extracurricular activities", short: "extra", type: "buttons", options: ["No", "Yes"] },
    { question: "On average, how many hours of sleep do you get per night?", short: "sleep", type: "number" },
    { question: "What score did you get on your last exam?", short: "exam", type: "number" },
    { question: "How would you rate your motivation towards your education?", short: "motivation", type: "buttons", options: ["Low", "Medium", "High"] },
    { question: "Do you have access to the internet?", type: "buttons", short: "internet", options: ["No", "Yes"] },
    { question: "How many Tutoring sessions do you have per month?", short: "tutor", type: "number" },
    { question: "What is your families income level?", type: "buttons", short: "income", options: ["Low", "Medium", "High"] },
    { question: "How would you rate the teaching quality of your school?", short: "teaching", type: "buttons", options: ["Low", "Medium", "High"] },
    { question: "Is your school public or private?", type: "buttons", short: "school", options: ["Public", "Private"] },
    { question: "How would you assess the influence of your peers?", short: "peers", type: "buttons", options: ["Negative", "Neutral", "Positive"] },
    { question: "What is the average number of hours of physical activity per week?", short: "physical", type: "number" },
    { question: "Do you have a learning disability?", type: "buttons", short: "disability", options: ["No", "Yes"] },
    { question: "What is the highest education level between your parents?", short: "level", type: "buttons", options: ["High School", "College", "Postgraduate"] },
    { question: "How far from your school do you live?", type: "buttons", short: "far", options: ["Near", "Moderate", "Far"] },
    { question: "What is your gender?", type: "buttons", short: "gender", options: ["Male", "Female"] }
];

// The page that displays the questions
function Questionnaire() {
    // Allows navigation between pages
    const navigate = useNavigate();
    // Tracks the index of the current question, then stores the anwsers in key value pairs
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    // Tracks if the answers are being submitted
    const [isSubmitting, setIsSubmitting] = useState(false);

    // When answers changes it checks if it is ready to be submitted
    useEffect(() => {
        if (isSubmitting) {
            handleSubmit();
            setIsSubmitting(false);
        }
    }, [answers]);

    
    const handleAnswer = (answer) => {
        setAnswers((prevAnswers) => {
            // Updates answers for the given anwser and the short question as the key
            const updatedAnswers = { ...prevAnswers, [questions[currentQuestionIndex].short]: answer };

            // If there are more questions, increase the index to the next question
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            // If there are no more questions it can be submitted
            } else {
                setIsSubmitting(true);
            }

            return updatedAnswers;
        });
    };

    // Handles the submitting of data to the backend
    const handleSubmit = async () => {
        try {
            // Sends the answers too the backend so that The prediction can be made
            const response = await fetch("https://gradepredictor.onrender.com/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(answers),
            });

            // The response (grade prediction) is stored and rounded, ready to be displayed on the result page
            const data = await response.json();
            const prediction = Math.round(data.predicted_grade)
            
            // Navigates to the result page sending the prediction
            navigate("/results", { state: { predictedGrade: prediction } });
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const currentQuestion = questions[currentQuestionIndex];

    // The HTML of the question page
    return (
        <div className="wrapper">
            <div className="container">
                <h2 className="question">{currentQuestion.question}</h2>
                
                {/* if the question takes a number as input displays a textbox */}
                {currentQuestion.type === "number" ? (
                    <input
                        type="text"
                        className="textbox"
                        onKeyDown={(e) => {
                            // Only accepts a integer from the user, anything else is cleared and requires resubmission
                            if (e.key === "Enter") {
                                if (!isNaN(Number(e.target.value))) {
                                    handleAnswer(parseInt(e.target.value));
                                    e.target.value = "";
                                } else {
                                    e.target.value = "Enter a number";
                                    setTimeout(() => {
                                        e.target.value = "";
                                    }, 700);
                                }
                            }
                        }}
                    />
                // Rest of the questions are buttons that contain the possible options
                ) : currentQuestion.type === "buttons" ? (
                    <div className="buttons">
                        {currentQuestion.options.map((option) => (
                            <button
                                key={option}
                                className="answer_button"
                                onClick={() => {
                                        if (["No", "Public", "Male", "Low", "High School", "Moderate", "Neutral"].includes(option)) {
                                            handleAnswer(0);
                                        } else if (["Yes", "Private", "Female", "Medium", "College", "Near", "Positive"].includes(option)) {
                                            handleAnswer(1);
                                        } else {
                                            handleAnswer(2);
                                        }
                                    }
                                }
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default Questionnaire;
