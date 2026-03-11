import * as React from "react";
import styles from "./MainLoader.module.scss";

const MainLoader: React.FC = () => {
  return (
    <div className={styles["loader-wrapper"]}>
      <div className={styles["wifi-loader"]}>
        <svg viewBox="0 0 86 86" className={styles["circle-outer"]}>
          <circle r="40" cy="43" cx="43" className={styles.back} />
          <circle r="40" cy="43" cx="43" className={styles.front} />
          <circle r="40" cy="43" cx="43" />
        </svg>

        <svg viewBox="0 0 60 60" className={styles["circle-middle"]}>
          <circle r="27" cy="30" cx="30" className={styles.back} />
          <circle r="27" cy="30" cx="30" className={styles.front} />
        </svg>

        <div data-text="Loading..." className={styles.text}></div>
      </div>
    </div>
  );
};

export default MainLoader;
