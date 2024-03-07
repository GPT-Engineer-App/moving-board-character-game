import React, { useState, useEffect } from "react";
import { Box, Flex, IconButton, useBoolean, useInterval } from "@chakra-ui/react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const Index = () => {
  const [birdPosition, setBirdPosition] = useState(50);
  const [isAutoMoving, setIsAutoMoving] = useState(false);
  const [gameWidth, setGameWidth] = useState(100);
  const [obstacles, setObstacles] = useState([{ id: 1, width: 100 }]);
  const [isPlaying, { toggle }] = useBoolean(false);

  // Handle automatic bird movement
  const toggleAutoMove = () => {
    setIsAutoMoving(!isAutoMoving);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        toggleAutoMove();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    let boardInterval;
    if (isPlaying) {
      // Move the obstacles leftwards and add new obstacles periodically
      boardInterval = setInterval(() => {
        setGameWidth((prevWidth) => (prevWidth === 0 ? 100 : prevWidth - 1));
        setObstacles((prevObstacles) => {
          let newObstacles = prevObstacles
            .map((obstacle) => {
              return { ...obstacle, width: obstacle.width - 1 };
            })
            .filter((obstacle) => obstacle.width > 0);

          if (gameWidth % 30 === 0) {
            newObstacles.push({ id: prevObstacles.length + 1, width: 100 });
          }

          return newObstacles;
        });
      }, 100);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(boardInterval);
    };
  }, [isPlaying, isAutoMoving]);

  const [gravity, setGravity] = useState(0);

  useInterval(
    () => {
      if (isAutoMoving) {
        setBirdPosition((prevPosition) => Math.max(0, prevPosition - 5));
      }
    },
    isAutoMoving ? 50 : null,
  );

  useInterval(() => {
    if (isAutoMoving && birdPosition < 100) {
      setGravity((prevGravity) => prevGravity + 0.5);
      setBirdPosition((prevPosition) => Math.min(100, prevPosition + gravity));
    } else {
      setGravity(0);
    }
  }, 50);

  // Funções para mover o pássaro para cima e para baixo
  const moveBirdUp = () => setBirdPosition(birdPosition - 10);
  const moveBirdDown = () => setBirdPosition(birdPosition + 10);

  return (
    <Flex direction="column" align="center" justify="center" h="100vh">
      // Render the game board with multiple obstacles
      <Box position="relative" h="300px" w="100%" bg="blue.200" overflow="hidden">
        {obstacles.map((obstacle) => (
          <Box key={obstacle.id} position="absolute" left={`${obstacle.width}%`} top="0" bottom="0" bg="green.400" w="50px" />
        ))}
        <Box position="absolute" left="50%" top={`${birdPosition}%`} transform="translateX(-50%)" w="30px" h="30px" bg="red.500" borderRadius="50%" />
      </Box>
      <Flex justify="center" mt="4">
        <IconButton aria-label="Move up" icon={<FaArrowUp />} onClick={moveBirdUp} isDisabled={!isPlaying} />
        <IconButton aria-label="Move down" icon={<FaArrowDown />} onClick={moveBirdDown} isDisabled={!isPlaying} ml="2" />
        <IconButton aria-label="Start game" onClick={toggle} ml="2">
          {isPlaying ? "Pause" : "Start"}
        </IconButton>
        <IconButton aria-label="Restart game" icon={<FaArrowUp />} onClick={restartGame} ml="2" />
      </Flex>
    </Flex>
  );

  // Update the restartGame function to reset obstacles
  function restartGame() {
    setBirdPosition(50);
    setIsAutoMoving(false);
    setGameWidth(100);
    setObstacles([{ id: 1, width: 100 }]);
    toggle(false);
    setGravity(0);
  }
};

export default Index;
