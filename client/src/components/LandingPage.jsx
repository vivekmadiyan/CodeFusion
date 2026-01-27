import React from "react";
import { Link } from "react-router-dom";
import styles from "./LandingPage.module.css";

function LandingPage() {
  return (
    <div className={styles.page}>
      {/* ================= NAVBAR ================= */}
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <div className={styles.logoBox}>
            <img src="/logo.png" alt="CodeFusion Logo" />
            <span>CodeFusion</span>
          </div>

          <ul className={styles.navLinks}>
            <li><a href="#home">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>

          <Link to="/login">
            <button className={styles.loginBtn}>Login / Register</button>
          </Link>
        </nav>
      </header>

      {/* ================= HERO ================= */}
      <section id="home" className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>
            Build Code <span>Together</span>. Faster.
          </h1>
          <p>
            CodeFusion is a modern real-time collaborative code editor for
            developers, teams, and interviews.
          </p>

          <div className={styles.heroActions}>
            <Link to="/login">
              <button className={styles.primaryBtn}>Get Started</button>
            </Link>
            <a href="#features" className={styles.secondaryBtn}>
              Learn More
            </a>
          </div>

          <div className={styles.techStack}>
            <img src="/logos/javascript.png" alt="JavaScript" />
            <img src="/logos/python.png" alt="Python" />
            <img src="/logos/java.png" alt="Java" />
            <img src="/logos/cpp.png" alt="C++" />
            <img src="/logos/html.png" alt="HTML" />
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className={styles.features}>
        <h2 className={styles.sectionTitle}>Why CodeFusion?</h2>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <h3>🚀 Real-Time Collaboration</h3>
            <p>
              Code together with your team in real time. See changes instantly,
              just like Google Docs — but for code.
            </p>
          </div>

          <div className={styles.featureCard}>
            <h3>🎨 Syntax Highlighting</h3>
            <p>
              Support for multiple programming languages with intelligent
              highlighting for better readability.
            </p>
          </div>

          <div className={styles.featureCard}>
            <h3>🌙 Custom Themes</h3>
            <p>
              Switch between dark and light themes and customize your editor
              experience your way.
            </p>
          </div>

          <div className={styles.featureCard}>
            <h3>💾 Session Persistence</h3>
            <p>
              Never lose your work. Resume your sessions anytime without losing
              progress.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className={styles.contact}>
        <h2 className={styles.sectionTitle}>Contact Us</h2>

        <form className={styles.contactForm}>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" rows="4" required />
          <button type="submit">Send Message</button>
        </form>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div>
            <h3>CodeFusion</h3>
            <p>
              A next-generation collaborative coding platform built for
              developers.
            </p>
          </div>

          <div>
            <h4>Legal</h4>
            <p>Privacy Policy</p>
            <p>Terms of Service</p>
          </div>

          <div>
            <h4>Follow Us</h4>
            <div className={styles.socialIcons}>
              <img src="/logos/facebook.png" alt="Facebook" />
              <img src="/logos/twitter.png" alt="Twitter" />
              <img src="/logos/linkedin.png" alt="LinkedIn" />
            </div>
          </div>
        </div>

        <p className={styles.copyright}>
          © {new Date().getFullYear()} CodeFusion. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
