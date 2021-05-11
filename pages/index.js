import Head from "next/head";
import { useState } from "react";

import { shortToLong, longToShort } from "../lib/fetchData";

const lowercaseRegex = new RegExp(/[a-z]*/);
const alphanumericRegex = new RegExp(/[a-zA-Z0-9]*/);

export default function Home() {
  const [original, setOriginal] = useState("");
  const [shorter, setShorter] = useState("");
  const [originalLength, setOriginalLength] = useState(0);
  const [shorterLength, setShorterLength] = useState(0);
  const [error, setError] = useState(null);

  const handleOriginal = (event) => {
    const value = event.currentTarget.value;
    const stringMatch = value.match(lowercaseRegex);
    if (stringMatch && stringMatch[0] === value) {
      setOriginal(value);
      setOriginalLength(value.length);
      setError(null);
      return;
    }
    setError("String can only have lowercase letters (a-z)");
    return;
  };

  const handleShort = (event) => {
    const value = event.currentTarget.value;
    const stringMatch = value.match(alphanumericRegex);
    if (stringMatch && stringMatch[0] === value) {
      setShorter(value);
      setShorterLength(value.length);
      setError(null);
      return;
    }
    setError("String can only have alphanumeric characters (a-z, A-Z, 0-9)");
  };

  const handleShortToLong = async () => {
    if (shorter === "") {
      return;
    }
    const long = await shortToLong(shorter);
    setOriginal(long);
    setOriginalLength(long.length);
  };

  const handleLongToShort = async () => {
    if (original === "") {
      return;
    }
    const short = await longToShort(original);
    setShorter(short);
    setShorterLength(short.length);
  };

  const onEnterKey = (event, callback) => {
    if (event.keyCode === 13) {
      callback();
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="original">Original</label>
        <input
          value={original}
          onChange={handleOriginal}
          id="original"
          onKeyDown={(e) => {
            onEnterKey(e, handleLongToShort);
          }}
        />
        {<p>length={originalLength}</p>}
        <label htmlFor="shorter">Shorter</label>
        <input
          value={shorter}
          onChange={handleShort}
          id="shorter"
          onKeyDown={(e) => {
            onEnterKey(e, handleShortToLong);
          }}
        />
        {<p>length={shorterLength}</p>}
      </div>

      <div>
        <button onClick={handleLongToShort}>Get Short String</button>
        <button onClick={handleShortToLong}>Get Original String</button>
      </div>
      {error && (
        <div role="alert" style={{ color: "red" }}>
          {error}
        </div>
      )}
    </div>
  );
}
