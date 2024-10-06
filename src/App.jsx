import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLanguages, translateText } from "./redux/actions/translateActions";
import Select from "react-select";
import Loading from "./assets/Loading";
import { setAnswer } from "./redux/slices/translateSlice";

const App = () => {
  const dispatch = useDispatch();
  const languageSlice = useSelector((store) => store.languageSlice);
  const translateSlice = useSelector((store) => store.translateSlice);

  const [text, setText] = useState("");

  const [sourceLang, setSourceLang] = useState({
    value: "tr",
    label: "Turkish",
  });
  const [targetLang, setTargetLang] = useState({
    value: "en",
    label: "English",
  });

  // Fetch languages on component mount
  useEffect(() => {
    dispatch(getLanguages());
  }, [dispatch]);

  // Generate options for the select components
  const data = useMemo(() => {
    return languageSlice.languages.map((i) => ({
      value: i.code,
      label: i.name,
    }));
  }, [languageSlice.languages]);

  // Function to copy translated text to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(translateSlice.answer);
  };

  // Function to swap source and target languages
  const handleSwap = () => {
    setSourceLang((prev) => targetLang); // Set sourceLang to targetLang
    setTargetLang((prev) => sourceLang); // Set targetLang to previous sourceLang

    //from the disabled area to other area change to data
    setText(translateSlice.answer);

    //to do question textarea answer textarea
    dispatch(setAnswer(text))
  };

  return (
    <div className="main-page">
      <div className="container">
        <h1>Translator</h1>
        {/* Language selection */}
        <div className="upper">
          <Select
            value={sourceLang}
            onChange={setSourceLang}
            className="select"
            options={data}
          />
          <button onClick={handleSwap}>Swap</button>
          <Select
            value={targetLang}
            onChange={setTargetLang}
            className="select"
            options={data}
          />
        </div>
        {/* Text areas for input and output */}
        <div className="middle">
          <div>
            <textarea
            value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to translate" // Placeholder for input textarea
            />
          </div>
          <div style={{ position: "relative" }}>
            <textarea
              disabled
              value={translateSlice.answer}
              placeholder="Translation will appear here" // Placeholder for output textarea
            />
            {translateSlice.isLoading && <Loading/>}

            <button
              style={{
                position: "absolute",
                right: "10px",
                top: "10px",
              }}
              onClick={handleCopy}
            >
              Copy
            </button>
          </div>
        </div>
        {/* Translate button */}
        <button
          onClick={() =>
            dispatch(translateText({ text, sourceLang, targetLang }))
          }
        >
          Translate
        </button>
      </div>
    </div>
  );
};

export default App;
