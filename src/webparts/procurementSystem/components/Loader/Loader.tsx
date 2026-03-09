import * as React from "react";
import styles from "./Loader.module.scss";
const Loader = () => {
  return (
    <div className={styles.loaderBody}>
      <div className={styles["loader-overlay"]} id="loader">
        <div className={styles.spinner}></div>
        <p className={styles["loader-text"]}>
          Loading <span>Procurement System</span>…
        </p>
        <div className={styles["progress-bar"]}>
          <div className={styles["progress-fill"]}></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
