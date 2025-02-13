import React from "react";
import styles from "../styles/bubble.module.css";

const Example = () => {
    return (<div className="grid h-screen place-content-center bg-black">
            <BubbleText/>
        </div>);
};

const BubbleText = () => {
    return (<h1 className="text-center text-5xl font-thin text-indigo-300">
            {"Moin, i am Marten".split("").map((child, idx) => (<span className={styles.hoverText} key={idx}>
          {child}
        </span>))}
        </h1>);
};

export default Example;