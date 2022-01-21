import { LayoutContainer } from "../components/layout";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { t } from "../constants/constants";
import { bestSpot } from "../api/jenosizeApi";
import Link from "next/link";

const BoardGame = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-items: stretch;
  align-items: stretch;
  column-gap: 0px;
  row-gap: 0px;
  width: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -150px;
  margin-top: -150px;
`;

const CellOfBoard = styled.div`
  width: 100px;
  height: 100px;
  color: #242424;
  font-weight: 600;
  text-align: center;
  box-sizing: border-box;
  padding: 10px;
  display: grid;
  align-items: center;
  cursor: pointer;

  border: 2px solid #333;
  &:nth-child(1) {
    border: 0;
  }
  &:nth-child(2) {
    border-top: 0;
    border-bottom: 0;
  }
  &:nth-child(3) {
    border: 0;
  }
  &:nth-child(4) {
    border-left: 0;
    border-right: 0;
  }
  &:nth-child(6) {
    border-left: 0;
    border-right: 0;
  }
  &:nth-child(7) {
    border: 0;
  }
  &:nth-child(8) {
    border-top: 0;
    border-bottom: 0;
  }
  &:nth-child(9) {
    border: 0;
  }
`;

const Declare = styled.div`
  width: 250px;
  background-color: #8acfff;
  position: absolute;
  left: 25px;
  padding-top: 100px;
  padding-bottom: 100px;
  text-align: center;
  border-radius: 5px;
  color: white;
  font-size: 2em;
  z-index: 2;
`;

const Button = styled.button`
  background: palevioletred;
  color: white;
  font-size: 0.5em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

const Home = () => {
  const wonCondition = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const humanPlayer = "x";
  const aiPlayer = "o";
  const initBoard = Array.from(Array(9).keys());
  const [myBoard, setMyBoard] = useState({
    board: initBoard,
    player: humanPlayer,
  });
  const [declareWinner, setDeclareWinner] = useState({
    status: false,
    message: "",
  });

  const handelClickCell = (squareId) => {
    if (
      typeof myBoard.board[squareId] == "number" &&
      myBoard.player == humanPlayer
    ) {
      turn(squareId, myBoard.player);
    }
  };

  const turn = (squareId, player) => {
    const updateBoard = myBoard.board;
    updateBoard[squareId] = player;
    const nextPlayer = player == aiPlayer ? humanPlayer : aiPlayer;
    setMyBoard({ board: updateBoard, player: nextPlayer });
    nextPlayer === aiPlayer && aiTurn();
  };

  const checkWin = () => {
    const checkPlayerWon = myBoard.player === aiPlayer ? humanPlayer : aiPlayer;
    let plays = myBoard.board.reduce(
      (a, e, i) => (e === checkPlayerWon ? a.concat(i) : a),
      []
    );
    let gameWon = null;
    for (let [index, win] of wonCondition.entries()) {
      if (win.every((elem) => plays.indexOf(elem) > -1)) {
        gameWon = { index: index, player: checkPlayerWon };
        break;
      }
    }
    return gameWon;
  };

  const gameOver = (gameWon) => {
    const msg = gameWon.player == humanPlayer ? t.xo.won : t.xo.lose;
    setDeclareWinner({
      status: true,
      message: msg,
    });
  };

  const checkDraw = () => {
    const emptySquares = myBoard.board.filter((s) => typeof s == "number");
    if (emptySquares.length == 0) {
      setDeclareWinner({ status: true, message: t.xo.draw });
      return true;
    }
    return false;
  };

  const aiTurn = async () => {
    if (!checkDraw()) {
      const { data } = await bestSpot(myBoard.board, aiPlayer);
      turn(data.index, aiPlayer);
    }
  };

  const gameReset = () => {
    setMyBoard({
      board: initBoard,
      player: humanPlayer,
    });
    setDeclareWinner({ status: false, message: "" });
  };

  useEffect(() => {
    const gameWon = checkWin();
    gameWon && gameOver(gameWon);
  }, [myBoard]);

  return (
    <LayoutContainer>
      <BoardGame>
        {myBoard.board.map((s, i) => (
          <CellOfBoard key={i} onClick={(e) => handelClickCell(i)}>
            {typeof s != "number" && s}
          </CellOfBoard>
        ))}
        {declareWinner.status && (
          <Declare>
            {declareWinner.message}
            <Button onClick={(e) => gameReset()}>Play Again</Button>
          </Declare>
        )}
      </BoardGame>
    </LayoutContainer>
  );
};

export default Home;
