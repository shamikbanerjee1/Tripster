import React, { useState, useEffect, useRef } from "react";
import { Chip, Tooltip } from "@mui/material";

const CustomChip = ({ label, ...props }) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    // Check if the text is truncated
    const checkTruncation = () => {
      const element = textRef.current;
      if (element) {
        // Compare the scrollWidth (actual width of the text) with the clientWidth (element's width)
        setIsTruncated(element.scrollWidth > element.clientWidth);
      }
    };

    checkTruncation();

    // Optionally, listen for window resize if you need to re-check truncation
    window.addEventListener("resize", checkTruncation);
    return () => window.removeEventListener("resize", checkTruncation);
  }, [label]); // Re-run when the label changes

  return (
    <Tooltip
      title={isTruncated ? label : ""}
      disableHoverListener={!isTruncated}
    >
      <Chip
        label={
          <div
            ref={textRef}
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </div>
        }
        {...props}
        sx={{
          maxWidth: "87%", //79 % seems perfect to avoid overflow, was 100%
          //minWidth: '120px', // Set the minimum width for the Chip here
          "& .MuiChip-label": {
            display: "flex",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          },
        }}
      />
    </Tooltip>
  );
};

export default CustomChip;
