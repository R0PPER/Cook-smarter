import { async } from "regenerator-runtime";
import { API_URL } from "./config.js";

export const state = {};

export const loadSearch = async function (query) {
  try {
    console.log(query);
  } catch (err) {
    console.log(err);
  }
};
