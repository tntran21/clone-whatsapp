import { ProgessContext } from "@/contexts/progessContext";
import { useContext } from "react";

const ProgessStatus = () => {
  // context
  const { lastTime } = useContext(ProgessContext);

  return (
    <>
      <div>Progess status: {lastTime}</div>
    </>
  );
};

export default ProgessStatus;
