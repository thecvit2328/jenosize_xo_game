import axios from "axios";

export const bestSpot = (newBoard, player) => {
  const baseURL = "https://jenozise.herokuapp.com/api/game/xo";
  return axios.post(baseURL, {
    newBoard,
    player,
  });
};
