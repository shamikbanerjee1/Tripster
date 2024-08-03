import { Link } from "react-router-dom";
import styles from "./Logo.module.css";
import AlignVerticalTopIcon from "@mui/icons-material/AlignVerticalTop";

function Logo() {
  return (
    <Link to="/">
      {/* <img src="/logo.png" alt="Tripster logo" className={styles.logo} /> */}
      <div className={styles.container}>
        <AlignVerticalTopIcon className={styles.logo} />
        <span className={styles.tripsterText}> Tripster</span>
      </div>
    </Link>
  );
}

export default Logo;
