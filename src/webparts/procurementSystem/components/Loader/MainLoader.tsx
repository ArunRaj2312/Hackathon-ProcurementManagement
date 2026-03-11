import * as React from "react";
import styles from "./MainLoader.module.scss";

const MainLoader: React.FC = () => {
  return (
    <div className={styles["loader-wrapper"]}>
      <div className={styles["traffic-loader"]}></div>
    </div>
  );
};

export default MainLoader;
