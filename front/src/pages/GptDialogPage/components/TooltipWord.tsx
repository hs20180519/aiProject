import { Tooltip, Text } from "@chakra-ui/react";

const TooltipWord = ({
  word,
  meaning,
  index,
  isMobile,
  openTooltip,
  handleTooltipClick,
  tooltipRef,
}) => {
  return (
    <span ref={tooltipRef}>
      <Tooltip
        label={meaning}
        key={index}
        isOpen={isMobile ? openTooltip === index : undefined}
        shouldWrapChildren
      >
        <Text
          as="span"
          onClick={() => handleTooltipClick(index)}
          fontStyle="italic"
          fontWeight="600"
          style={{
            backgroundImage: "linear-gradient(transparent 60%, #F8CD07 40%)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 15px",
            backgroundPosition: "0 100%",
          }}
        >
          {word}
        </Text>
      </Tooltip>
    </span>
  );
};

export default TooltipWord;
