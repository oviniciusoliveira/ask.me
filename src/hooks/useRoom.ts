import { useEffect, useState } from "react";

import { database } from "../services/firebase";

// type FirebaseQuestions = Record<
//   string,
//   {
//     author: {
//       name: string;
//       avatar: string;
//     };
//     content: string;
//     isAnswered: boolean;
//     isHighlighted: boolean;
//   }
// >;

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
};

export function useRoom(roomId: string) {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const roomRef = database.ref(`/rooms/${roomId}`);
    roomRef.once("value", (room) => {
      const databaseRoom = room.val();

      // const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      // const parsedQuestions = Object.entries(firebaseQuestions).map(
      //   ([key, value]) => {
      //     return {
      //       id: key,
      //       ...value,
      //     };
      //   }
      // );
      setTitle(databaseRoom.title);
      // setQuestions(parsedQuestions);
    });

    const questionsRef = database.ref(`/rooms/${roomId}/questions`);

    questionsRef.on("child_added", (question) => {
      const parsedQuestion = { id: question.key, ...question.val() };
      setQuestions((prevState) => prevState.concat(parsedQuestion));
    });

    questionsRef.on("child_removed", (question) => {
      setQuestions((prevState) =>
        prevState.filter((questionSaved) => {
          return questionSaved.id !== question.key;
        })
      );
    });

    return () => {
      questionsRef.off();
      setQuestions([]);
    };
  }, [roomId]);

  return { questions, title };
}
