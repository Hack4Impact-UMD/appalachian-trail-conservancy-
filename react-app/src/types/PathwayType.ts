export interface PathwayID extends Pathway {
  id: string;
}

export interface Pathway {
  name: string;
  shortBlurb: string;
  description: string;
  coverImage: string; // URL
  trainingIDs: string[];
  quiz: Quiz;
  badgeImage: string; // URL
}

export interface Quiz {
  questions: Question[];
  numQuestions: number;
  passingScore: number;
}

export interface Question {
  question: string;
  choices: string[];
  answer: string;
}
