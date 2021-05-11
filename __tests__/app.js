import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../pages/index";

import { shortToLong, longToShort } from "../lib/fetchData";

jest.mock("../lib/fetchData");

const shortWord = "shortVersion";
const originalWord = "originalversion"; //note that it is lowercase

test("Cannot enter an invalid value in 'original' field. Only lowercase letters a-z allowed", () => {
  render(<App />);
  const input = screen.getByLabelText(/original/i);
  userEvent.type(input, "UPPERCASE");
  expect(screen.getByRole("alert")).toHaveTextContent(
    /String can only have lowercase letters \(a-z\)/i
  );
});

test("Cannot enter an invalid value in 'shorter' field. Only alphanumeric characters a-zA-Z0-9 allowed", () => {
  render(<App />);
  const input = screen.getByLabelText(/shorter/i);
  userEvent.type(input, "$$$#");
  expect(screen.getByRole("alert")).toHaveTextContent(
    /String can only have alphanumeric characters \(a-z, A-Z, 0-9\)/i
  );
});

test("UI and app is working with data received from the server", async () => {
  shortToLong.mockResolvedValue(originalWord);
  longToShort.mockResolvedValue(shortWord);

  render(<App />);
  const originalInput = screen.getByLabelText(/original/i);
  const shorterInput = screen.getByLabelText(/shorter/i);
  userEvent.type(originalInput, originalWord);
  expect(originalInput).toHaveValue(originalWord);
  userEvent.click(screen.getByRole("button", { name: /get short string/i }));

  await waitFor(() => {
    expect(shorterInput).toHaveValue(shortWord);
  });

  expect(longToShort).toHaveBeenCalledTimes(1);
  expect(longToShort).toHaveBeenCalledWith(originalWord);

  //resetting originalWordInput to an empty string
  userEvent.clear(originalInput);
  userEvent.click(screen.getByRole("button", { name: /get original string/i }));

  await waitFor(() => {
    expect(originalInput).toHaveValue(originalWord);
  });

  expect(shortToLong).toHaveBeenCalledTimes(1);
  expect(shortToLong).toHaveBeenCalledWith(shortWord);
});
