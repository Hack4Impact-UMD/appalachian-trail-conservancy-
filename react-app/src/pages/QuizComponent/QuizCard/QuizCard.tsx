import React from "react";
import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import styles from "./QuizCard.module.css";
import { grayRadioButton } from "../../../muiTheme";

interface QuizCardProps {
  currentQuestion: number;
  totalQuestions: number;
  question: string;
  answerOptions: string[];
}

const QuizCard: React.FC<QuizCardProps> = ({
  currentQuestion,
  totalQuestions,
  question,
  answerOptions,
}) => {
  const [selectedValue, setSelectedValue] = React.useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div className={styles.quizCard}>
      <div className={styles.question}>
        <p className={styles.questionNumber}>
          Question {currentQuestion} of {totalQuestions}
        </p>
        <p className={styles.questionText}>{question}</p>
      </div>
      <div>
        <FormControl>
          <RadioGroup value={selectedValue} onChange={handleChange}>
            {answerOptions.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option}
                control={<Radio sx={grayRadioButton} />}
                label={option}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </div>
    </div>
  );
};

export default QuizCard;
