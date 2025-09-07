import { useEffect, useState } from "react";
import roboWelcome from "../assets/RoboHi.png";
import { motion } from "motion/react"

const RoboMsg = ({ msg , delay}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [delay]);

  if (!show) return null;

  return (
    <div className="relative">
      {msg && (
        <motion.div
          className="relative z-10"
          animate={{ opacity: [0, 1], y: [30, 0] }}
          transition={{ delay: 1 }}
        >
          <p className="msg p-2 pr-1 w-60 md:w-80">{msg}</p>
        </motion.div>
      )}

      <motion.div
        className="relative top-[-1rem] left-[9rem] md:left-[12rem]"
        animate={{ scale: [0, 1] }}
        transition={{
          duration: 0.7,
          type:"spring",
          damping: 10,
        }}
      >
        <img
          src={roboWelcome}
          alt="Robot waving hi"
          className="h-[12rem] w-[10rem] md:h-[18rem] md:w-[15rem]"
        />
      </motion.div>
    </div>
  );
};

export default RoboMsg;
