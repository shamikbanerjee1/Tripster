import styles from "./Button.module.css";

function Button({ children, onClick, type }) {
  //example of add css based on type(props)
  return (
    <button onClick={onClick} className={`${styles.btn} ${styles[type]}`}>
      {children}
    </button>
  );
}

export default Button;
