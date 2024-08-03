import React,{ useState,useRef, useEffect } from 'react';
import PageNav from "./PageNav";
import styles from "./Product.module.css";

export default function Product() {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { rootMargin: "-300px" }
    );
    console.log(isIntersecting);
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [isIntersecting]);

  useEffect(() => {
    if (isIntersecting) {
      ref.current.querySelectorAll("div").forEach((el) => {
        el.classList.add("slide-in");
      });
    } else {
      ref.current.querySelectorAll("div").forEach((el) => {
        el.classList.remove("slide-in");
      });
    }
  }, [isIntersecting]);
  return (
    <main ref={ref} className={styles.product}>
      <PageNav />

      <section className={styles.heroSection}>
        <img
          className={styles.featuredImage}
          src="earth.jpg"
        />
        <div className={styles.introText}>
          <h2>About Tripster.</h2>
          <p>
            Explore the beauty of the world with our curated travel experiences. From
            mountain retreats to city escapes, discover your next adventure with WorldWide.
          </p>
          <p>
            Our personalized itineraries and local insights help you immerse fully in
            the culture and beauty of each destination.
          </p>
        </div>
      </section>

        <section className={`${styles.subscriptionBox} ${styles.sectionHidden}`}>
          <div className={styles.subscriptionBoxContent}>
            <h3>Book Itineraries</h3>
            <p>Embark on a journey tailored to your desires with our custom itineraries, guiding you to both iconic landmarks and secret spots. Streamline your travel plans with a detailed itinerary that promises a balance of adventure and relaxation. Let us handle the details, from transportation to accommodation, ensuring your voyage is seamless and unforgettable.</p>
          </div>
          <img
          className={styles.featuredImage}
          src="Itinerary.jpg"
          alt="Itinerary"
          />
        
        </section>
        <section className={`${styles.travelGear} ${styles.sectionHidden}`}>
          <img 
          src="Discover.jpg"
          alt="Discover"
          />
          <div className={styles.subscriptionBoxContent}>
          <h3>Discover New Places</h3>
          <p>Embark on a journey to any corner of the globe with just a tap. From the historic streets of Europe to the vibrant landscapes of South America, every destination is within reach. Unlock the world's treasures and weave your own tapestry of travel memories, one place at a time.</p>
          </div>
        </section>

        <section className={`${styles.localExperience} ${styles.sectionHidden}`}>
          <div className={styles.subscriptionBoxContent}>
            <h3>Local Experiences</h3>
            <p>Dive into the heart of each destination with experiences crafted by those who call it home. Engage with local traditions, feast on authentic cuisine, and create lasting connections that go beyond the typical tourist path. Embrace the unique charm and hidden gems of every locale through the eyes of its residents.</p>
          </div>
          <img  
          className={styles.featuredImage2}
          src="Local.jpg"
          alt="Local"
          />
        </section>
    </main>
  );
}
