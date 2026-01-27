import React from "react";
import { Link } from "react-router-dom";
import {
  Code2,
  Users,
  Palette,
  Save,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Braces,
  Cpu,
  FileCode,
} from "lucide-react";
import styles from "./LandingPage.module.css";

function LandingPage() {
  return (
    <div className={styles.page}>
      {/* ===== NAVBAR ===== */}
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <div className={styles.logoBox}>
            <Code2 size={32} />
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

      {/* ===== HERO ===== */}
      <section id="home" className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>
            Build Code <span>Together</span>. Faster.
          </h1>
          <p>
            A modern real-time collaborative code editor built for developers,
            teams, and interviews.
          </p>

          <div className={styles.heroActions}>
            <Link to="/login">
              <button className={styles.primaryBtn}>Get Started</button>
            </Link>
            <a href="#features" className={styles.secondaryBtn}>
              Learn More
            </a>
          </div>

          {/* Tech icons */}
          <div className={styles.techStack}>
            <Braces />
            <Cpu />
            <FileCode />
            <Code2 />
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className={styles.features}>
        <h2 className={styles.sectionTitle}>Why CodeFusion?</h2>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <Users size={28} />
            <h3>Real-Time Collaboration</h3>
            <p>
              Collaborate with your team live and see updates instantly,
              just like Google Docs for code.
            </p>
          </div>

          <div className={styles.featureCard}>
            <Palette size={28} />
            <h3>Custom Themes</h3>
            <p>
              Switch between themes and personalize your coding
              experience with ease.
            </p>
          </div>

          <div className={styles.featureCard}>
            <Code2 size={28} />
            <h3>Multi-Language Support</h3>
            <p>
              Syntax highlighting for popular programming
              languages out of the box.
            </p>
          </div>

          <div className={styles.featureCard}>
            <Save size={28} />
            <h3>Session Persistence</h3>
            <p>
              Resume your work anytime without losing
              progress or context.
            </p>
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className={styles.contact}>
        <h2 className={styles.sectionTitle}>Contact Us</h2>

        <form className={styles.contactForm}>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" rows="4" required />
          <button type="submit">
            <Mail size={18} /> Send Message
          </button>
        </form>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div>
            <h3>CodeFusion</h3>
            <p>
              A next-generation collaborative coding platform
              built for developers.
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
              <Facebook />
              <Twitter />
              <Linkedin />
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
