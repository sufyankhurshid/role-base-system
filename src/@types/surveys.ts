export type SURVEY_QUESTION = {
  id: string;
  question: string;
  answers: [
    {
      id: string;
      answer: string;
    }
  ];
};

export type SURVEY_TYPE = {
  name: string;
  questions?: [SURVEY_QUESTION] | [];
};
