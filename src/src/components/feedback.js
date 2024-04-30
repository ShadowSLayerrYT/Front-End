import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './feedback.css';

function Feedback() {
  const [feedback, setFeedback] = useState(Array(4).fill(null));
  const [courseNames, setCourseNames] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourseNames();
  }, []);

  const fetchCourseNames = async () => {
    try {
      const response = await Axios.get('http://localhost:5000/viewcourses');
      if (response.status === 200 && response.data.length > 0) {
        setCourseNames(response.data.map(course => course.courseName)); // Extracting course names
        setSelectedCourse(response.data[0].courseName); // Set the default selected course name
      }
    } catch (error) {
      console.error('Error fetching course names:', error);
      setError('Failed to fetch course names');
    }
  };

  const questions = [
    "How the teacher allowing the hands on executions through examples and applications??",
    "How well is the teacher able to explain and execute the tutorial concepts??",
    "Is the teacher trying to make the Active Learning Methods (ALMs) interesting??",
    "Overall rating of your Course teacher.?"
  ];

  const options = [
    ["Very effectively", "Somewhat effectively", "Neutral", "Not very effectively"],
    ["Very well", "Moderately well", "Adequately", "Poorly"],
    ["Yes, very much", "Yes, to some extent", "Not really", "Not at all"],
    ["Excellent", "Good", "Average", "Poor"]
  ];

  const handleOptionChange = (questionIndex, optionIndex) => {
    const newFeedback = [...feedback];
    newFeedback[questionIndex] = options[questionIndex][optionIndex];
    setFeedback(newFeedback);
  };

  const handleSubmit = async () => {
    try {
      const response = await Axios.post('http://localhost:5000/feedback', { feedback, courseName: selectedCourse });
      if (response.status === 200) {
        alert("Feedback submitted successfully");
      } else {
        alert("Failed to submit feedback. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Feedback submitted successfully");
    }
  };

  return (
    <div className="feedback-container-feedback">
      <h2>Feedback Form</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="feedback-form-feedback">
        <div>
          <label htmlFor="courseSelect">Select Course:</label>
          <select id="courseSelect" onChange={(e) => setSelectedCourse(e.target.value)} value={selectedCourse}>
            {courseNames.map((courseName, index) => (
              <option key={index} value={courseName}>{courseName}</option>
            ))}
          </select>
        </div>
        {questions.map((question, index) => (
          <div key={index} className="question-feedback">
            <p>{question}</p>
            <div className="options-feedback">
              {options[index].map((option, optionIndex) => (
                <label key={optionIndex}>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={feedback[index] === option}
                    onChange={() => handleOptionChange(index, optionIndex)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button className="submit-button" type="button" onClick={handleSubmit}>Submit Feedback</button>
      </form>
    </div>
  );
}

export default Feedback;
