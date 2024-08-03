import { Link } from "react-router-dom";
import PageNav from "./PageNav";
import styles from "./Homepage.module.css";

export default function Homepage() {
  return (
    <main className={styles.homepage}>
      <PageNav />

      <section>
        <h1>
          Keep Exploring.
          <br />
          Tripster
        </h1>
        <h2>
          A world map that helps you explore the world. Never forget your
          wonderful experiences, and get reviews of different places in the
          world.
        </h2>
        <Link to="/login" className="cta">
          Explore Now
        </Link>
      </section>
    </main>
  );
}
