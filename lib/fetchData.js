export const longToShort = async (word) => {
  const shortWord = await fetch("/api/longToShort", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ word }),
  });
  const result = await shortWord.json();
  return result.word;
};

export const shortToLong = async (word) => {
  const longWord = await fetch("/api/shortToLong", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ word }),
  });
  const result = await longWord.json();
  return result.word;
};
