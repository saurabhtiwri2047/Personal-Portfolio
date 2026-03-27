import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  // Typing animation
  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData(prev => prev + nextWord);
    }, 40 * index); // faster animation
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setResultData("");
  };

  const onSent = async (prompt) => {

    try {

      setResultData("");
      setLoading(true);
      setShowResult(true);

      let userPrompt = prompt || input;

      setPrevPrompts(prev => [...prev, userPrompt]);
      setRecentPrompt(userPrompt);

      const response = await runChat(userPrompt);

      if (!response) {
        setResultData("No response from AI");
        setLoading(false);
        return;
      }

      // Format response
      let responseArray = response.split("**");
      let newResponse = "";

      for (let i = 0; i < responseArray.length; i++) {

        if (i % 2 === 1) {
          newResponse += "<b>" + responseArray[i] + "</b>";
        } else {
          newResponse += responseArray[i];
        }

      }

      let formattedResponse = newResponse.split("*").join("<br/>");

      let words = formattedResponse.split(" ");

      words.forEach((word, index) => {
        delayPara(index, word + " ");
      });

    } catch (error) {

      console.error("Gemini Error:", error);
      setResultData("Something went wrong. Please try again.");

    }

    setLoading(false);
    setInput("");
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;

  