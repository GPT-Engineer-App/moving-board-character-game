import React, { useState, useEffect } from "react";
import { Box, Flex, IconButton, useBoolean } from "@chakra-ui/react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const Index = () => {
  const [birdPosition, setBirdPosition] = useState(50); // Posição inicial do pássaro
  const [gameWidth, setGameWidth] = useState(100); // Largura do tabuleiro de jogo
  const [isPlaying, { toggle }] = useBoolean(false);

  // Move o tabuleiro
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setGameWidth((prevWidth) => (prevWidth === 0 ? 100 : prevWidth - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Funções para mover o pássaro para cima e para baixo
  const moveBirdUp = () => setBirdPosition(birdPosition - 10);
  const moveBirdDown = () => setBirdPosition(birdPosition + 10);

  return (
    <Flex direction="column" align="center" justify="center" h="100vh">
      <Box position="relative" h="300px" w="100%" bg="blue.200" overflow="hidden">
        <Box position="absolute" left={`${gameWidth}%`} top="0" bottom="0" bg="green.400" w="50px" />
        <Box position="absolute" left="50%" top={`${birdPosition}%`} transform="translateX(-50%)" w="30px" h="30px" bg="red.500" borderRadius="50%" />
      </Box>

      <Flex justify="center" mt="4">
        <IconButton aria-label="Move up" icon={<FaArrowUp />} onClick={moveBirdUp} isDisabled={!isPlaying} />
        <IconButton aria-label="Move down" icon={<FaArrowDown />} onClick={moveBirdDown} isDisabled={!isPlaying} ml="2" />
        <IconButton aria-label="Start game" onClick={toggle} ml="2">
          {isPlaying ? "Pause" : "Start"}
        </IconButton>
      </Flex>
    </Flex>
  );
};

export default Index;
