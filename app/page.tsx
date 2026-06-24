"use client";

import { useSession } from "next-auth/react";
import { Suspense, useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AuthForm from "../components/AuthForm";
import UserMenu from "../components/UserMenu";

const heroVideo = "https://framerusercontent.com/assets/iWlVr4qV5BuFxjhc6g7QcPK5o.mp4";

const gradientImages = [
  "https://framerusercontent.com/images/eW5p5p4ByCUrMWJNoLvNUdoOBSM.png",
  "https://framerusercontent.com/images/HAJ6oryEjmZy3Sg5MQzgFBR7i8U.png",
  "https://framerusercontent.com/images/LB9YlzaPgLeQE23v2niIMLhi8c.png",
  "https://framerusercontent.com/images/nz2F1JADzV0oqknhUTE1HXOOE.png",
  "https://framerusercontent.com/images/PuSPK9fNwHImxZIAp2iXhWuyjM.png",
  "https://framerusercontent.com/images/2JQhaxBHmW5sc4O8xOEtc5ogk.png",
];

const navItems = ["About", "FAQs", "Contact", "Generate"];

const coreCards = [
  {
    title: "Figma Import",
    text: "Convert Figma designs into structured frontend layouts automatically. Import frames, components, spacing, and typography without manual setup.",
    icon: "orbit",
  },
  {
    title: "Clean Code Generation",
    text: "Generate responsive React, Next.js, HTML, CSS, and Tailwind code that follows modern development practices and clean component architecture.",
    icon: "data",
  },
  {
    title: "Responsive Conversion",
    text: "Automatically adapt desktop designs for tablet and mobile screens while preserving spacing, alignment, and visual consistency.",
    icon: "layers",
  },
];

// const productSections = [
//   {
//     kicker: "AI chat",
//     title: "Chat experience for fast and smart conversations",
//     text: "A conversational AI assistant that understands your questions, provides intelligent answers, and helps you get things done fast from casual chats to complex tasks.",
//     image: gradientImages[0],
//     tone: "chat",
//   },
//   {
//     kicker: "AI assistant",
//     title: "AI assistant for efficient time management",
//     text: "Let the AI schedule meetings, set reminders, and automatically attach relevant files. Save time and stay better organized with intelligent and context aware planning.",
//     image: gradientImages[1],
//     tone: "assistant",
//   },
//   {
//     kicker: "AI transcription",
//     title: "Audio transcription for fast and accurate text",
//     text: "Automatically convert speech into accurate, editable text in real time. Perfect for meetings, interviews, voice notes, and more, powered by advanced speech recognition technology.",
//     image: gradientImages[2],
//     tone: "audio",
//   },
// ];

const features = [
  ["Voice intelligence", "Convert speech to text, generate realistic audio, and integrate voice commands with seamless AI interaction."],
  ["Video AI", "Analyze, generate, and edit video content with AI-powered tools that save time and unlock creativity."],
  ["Image generation", "Generate high-quality images, graphics, and concepts using cutting-edge generative AI tuned for creativity and speed."],
  ["Text editor", "Generate, analyze, and optimize text with natural language processing designed for clarity, tone, and impact."],
  ["Secure by design", "From encrypted data handling to access controls and model integrity, ensure every action is protected."],
  ["Smart assistant", "Automate workflows, answer questions, and provide real-time support with a conversational AI that learns and adapts."],
];

const nextGen = [
  ["Multilingual AI", "Translate, transcribe, and generate content across global markets."],
  ["Continual Learning", "Your AI improves automatically as it learns from new data."],
  ["Modular Architecture", "Enable or disable components to tailor the platform for your use case."],
  ["Smart Analytics", "Get instant answers from your data with automated dashboards."],
  ["Agent Assist", "Automatically suggest replies and surface relevant documents."],
  ["Workflow Automation", "Automate email replies, data entry, content formatting, and more."],
];

const faqs = [
  {
    question: "Do I need coding experience to use the platform?",
    answer:
      "No. Simply describe what you want in plain English, and the platform generates the frontend for you.",
  },
  {
    question: "Can my team collaborate on projects together?",
    answer:
      "Not yet. The platform is currently designed for individual use. You can download the generated ZIP file and share it with your teammates.",
  },
  {
    question: "How accurate is the generated frontend code?",
    answer:
      "The generated code is highly accurate for most common UI patterns and layouts, though complex designs may need minor adjustments.",
  },
  {
    question: "What happens if the AI generates something incorrect?",
    answer:
      "You can refine your prompt and regenerate the code. Small tweaks can also be made manually in the generated files.",
  },
  {
    question: "Can I customize the generated code manually?",
    answer:
      "Absolutely. You get clean, editable code that you can modify, extend, and integrate into your existing projects.",
  },
];

type ManifestoPart = string | { symbol: string };

const manifestoLines = [
  ["We believe frontend development ", { symbol: "✧" }, " should feel creative - not repetitive."],
  ["By building tools that are fast, intelligent, and intuitive, we help developers ", { symbol: "⌘" }, " transform Figma designs into responsive frontend experiences with less manual effort."],
  ["With AI-assisted workflows ", { symbol: "▣" }, " designed for modern creators, we're simplifying the journey from design to deployment."],
] satisfies ManifestoPart[][];

function Logo() {
  return (
    <a className="brand home-brand" href="#">
      <span className="brand-mark" aria-hidden="true" />
      <span>Mosaic</span>
    </a>
  );
}

function Button({
  children,
  href = "#",
  onClick,
  variant = "primary",
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
}) {
  return (
    <a
      className={`button ${variant}`}
      href={href}
      onClick={(event) => {
        if (onClick) {
          event.preventDefault();
          onClick();
        }
      }}
    >
      {children}
    </a>
  );
}

function Mockup({ tone, image }: { tone: string; image: string }) {
  return (
    <div className="mockup" style={{ backgroundImage: `url(${image})` }}>
      <div className={`floating-ui ${tone}`}>
        {tone === "chat" && (
          <>
            <div className="chips">
              <span>Create image</span>
              <span>Summarize text</span>
            </div>
            <div className="prompt-row">
              <b>+</b>
              <span>Ask anything...</span>
              <i />
            </div>
          </>
        )}
        {tone === "assistant" && (
          <div className="assistant-card">
            <small>AI Assistant</small>
            <p>I&apos;ve just finished creating a document to support your meeting tomorrow.</p>
            <div className="file-row">
              <span />
              <b>Meeting deck</b>
              <i>↓</i>
            </div>
          </div>
        )}
        {tone === "audio" && (
          <div className="audio-card">
            <div className="wave">
              <b>▶</b>
              <span>11:06 AM - Chris</span>
              <i />
            </div>
            <small>Transcription</small>
            <p>Yeah, I did. I think Monday and Wednesday look packed, but Thursday&apos;s pretty open.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AnimatedWords({ parts }: { parts: ManifestoPart[] }) {
  return (
    <>
      {parts.map((part, partIndex) => {
        if (typeof part !== "string") {
          return (
            <span className="manifesto-word" key={`symbol-${partIndex}`}>
              <strong>{part.symbol}</strong>
            </span>
          );
        }

        return part.split(/(\s+)/).map((word, wordIndex) => {
          if (/^\s+$/.test(word)) {
            return word;
          }

          if (!word) {
            return null;
          }

          return (
            <span className="manifesto-word" key={`${partIndex}-${wordIndex}`}>
              {word}
            </span>
          );
        });
      })}
    </>
  );
}


function LineIcon({ type }: { type: string }) {
  if (type === "orbit") {
    return (
      <svg className="line-icon orbit" aria-hidden="true" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r="44" />
        <circle cx="55" cy="55" r="16" />
        <path d="M28 35c23-10 48-6 70 12" />
        <path d="M22 64c22 18 48 22 76 7" />
      </svg>
    );
  }

  if (type === "data") {
    return (
      <svg className="line-icon data" aria-hidden="true" viewBox="0 0 110 110">
        <ellipse cx="55" cy="29" rx="30" ry="11" />
        <ellipse cx="55" cy="50" rx="30" ry="11" />
        <ellipse cx="55" cy="71" rx="30" ry="11" />
      </svg>
    );
  }

  return (
    <svg className="line-icon layers" aria-hidden="true" viewBox="0 0 110 110">
      <rect x="22" y="22" width="38" height="58" rx="11" />
      <rect x="38" y="22" width="38" height="58" rx="11" />
      <rect x="54" y="22" width="38" height="58" rx="11" />
    </svg>
  );
}

export default function Home() {
  const manifestoRef = useRef<HTMLElement>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState("");
  const [feedbackError, setFeedbackError] = useState("");
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);

  const { data: session, status } = useSession();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>(".manifesto-word");
      const iconGroups = gsap.utils.toArray<SVGSVGElement>(".line-icon");

      gsap.fromTo(
        ".hero-load",
        {
          autoAlpha: 0,
          y: 34,
          filter: "blur(14px)",
        },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          stagger: 0.16,
          delay: 0.15,
        },
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: manifestoRef.current,
          start: "top 20%",
          end: "+=400",
          scrub: 2,
          pin: true,
        },
      });

      tl.fromTo(
        words,
        {
          opacity: 0.1,
          filter: "blur(8px)",
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.1,
          ease: "none",
          duration: 1,
        }
      );

      iconGroups.forEach((icon) => {
        const strokes = Array.from(icon.querySelectorAll<SVGGeometryElement>("path, circle, ellipse, rect"));

        gsap.set(strokes, {
          strokeDasharray: (_index, target: SVGGeometryElement) => target.getTotalLength(),
          strokeDashoffset: (_index, target: SVGGeometryElement) => target.getTotalLength(),
        });

        gsap.to(strokes, {
          strokeDashoffset: 0,
          duration: 1.35,
          ease: "power2.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: icon,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        });
      });
    });

    return () => context.revert();
  }, []);

  async function handleFeedbackSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFeedbackError("");
    setFeedbackStatus("");
    setIsSendingFeedback(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: feedbackName,
          email: feedbackEmail,
          message: feedbackMessage,
        }),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "Could not send feedback right now.");
      }

      setFeedbackName("");
      setFeedbackEmail("");
      setFeedbackMessage("");
      setFeedbackStatus("Thanks for the feedback. We really appreciate it.");
    } catch (error) {
      setFeedbackError(error instanceof Error ? error.message : "Could not send feedback right now.");
    } finally {
      setIsSendingFeedback(false);
    }
  }

  return (
    <main>
      <header className="site-header">
        <Logo />
        <nav>
        {navItems.map((item) => (
          <a href={`#${item.toLowerCase()}`} key={item}>
            {item}
          </a>
        ))}
      </nav>
          <div className="header-auth">


            {status === "loading" ? (
              <div style={{ width: "42px", height: "42px" }} />
            ) : session ? (
              <UserMenu />
            ) : (
              <Button href="/signup" onClick={() => setAuthMode("signup")}>
                Get started
              </Button>
            )}
            </div>

          
      </header>

      <section className="hero">
        <video aria-hidden="true" autoPlay muted loop playsInline src={heroVideo} />
        <div className="hero-content">
          {/* <a className="pill" href="#">✦ Announcing API 2.0</a> */}
          <h1 className="hero-load">
            Your Figma deserves <em> better</em> than manual coding. 
          </h1>
          <p className="hero-load">Generate clean, responsive frontend code directly from your Figma designs using AI-powered automation.</p>
          <div className="actions hero-load">
            <Button href="/signup" onClick={() => setAuthMode("signup")}>Get started</Button>
            <Button href="/login" onClick={() => setAuthMode("login")} variant="ghost">Sign in</Button>
          </div>
        </div>
      </section>

 <section className="logos" id="about">
  
  <h4>Powered By</h4>

  <div className="marquee-track">
    <div className="marquee-inner">
      {[
        "Next.js",
        "TypeScript",
        "MongoDB",
        "Gemini 3.5 Flash",
        "Vercel",
        "Lenis",
        "Tailwind CSS",
        "Bcryptjs",
        "Next.js",
        "TypeScript",
        "MongoDB",
        "Gemini 3.5 Flash",
        "Vercel",
        "Lenis",
        "Tailwind CSS",
        "Bcryptjs",
      ].map((logo, i) => (
        <span key={i}>
          {logo}
          <em>✦</em>
        </span>
      ))}
    </div>
  </div>
</section>

      <section className="manifesto" ref={manifestoRef}>
        <div className="manifesto-copy">
          {manifestoLines.map((line, index) => (
            <p key={index}>
              <AnimatedWords parts={line} />
            </p>
          ))}
        </div>
      </section>

      <section className="core" id="workflow">
        <h2>The core of smarter innovation</h2>
        <div className="core-grid">
          {coreCards.map((card) => (
            <article className="core-card" key={card.title}>
              <LineIcon type={card.icon} />
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <Button href="/signup" onClick={() => setAuthMode("signup")} variant="ghost">Get started</Button>
            </article>
          ))}
        </div>
      </section>

      <section className="products">
        {/* {productSections.map((section, index) => (
          <article className="product-row" key={section.title}>
            <div className="product-copy">
              <span className="kicker">✧ {section.kicker}</span>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
              <Button href="/signup" onClick={() => setAuthMode("signup")} variant="ghost">Get started</Button>
            </div>
            <Mockup tone={section.tone} image={section.image} />
          </article>
        ))} */}
      </section>

      {/* <section className="feature-section">
        <h2>Explore the powerful AI features that drive business growth</h2>
        <div className="feature-grid">
          {features.map(([title, text], index) => (
            <article key={title}>
              <span>{["◌", "▻", "✦", "T", "AI", "☊"][index]}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section> */}

      <section className="case-studies">
        <h2>Accelerate Frontend Development</h2>
            <article>
        <div className="case-copy">
          <h3>
            Turn Figma designs into production-ready frontend code.
          </h3>

          <div className="stats">
            <b>5 Min</b>
            <span>Generation Time</span>

            <b>80%</b>
            <span>Less Manual Work</span>
          </div>

          <Button
            href="/signup"
            onClick={() => setAuthMode("signup")}
            variant="ghost"
          >
            Generate Code
          </Button>
        </div>

        <div className="brand-tile blue">
          FIGMA → REACT
        </div>
      </article>

<article className="reverse">
  <div className="brand-tile gold">
    REACT + TAILWIND
  </div>

  <div className="case-copy">
    <h3>
      Responsive components generated automatically.
    </h3>

    <div className="stats">
      <b>100%</b>
      <span>Responsive</span>

      <b>React</b>
      <span>Ready</span>
    </div>

    <Button
      href="/signup"
      onClick={() => setAuthMode("signup")}
      variant="ghost"
    >
      Learn More
    </Button>
  </div>
</article>
      </section>

      {/* <section className="integrations">
        <div>
          <h2>Seamless integrations with your favorite tools</h2>
          <p>Connect our AI with the apps you already use, including calendars, docs, messaging platforms, and more.</p>
          <Button href="/signup" onClick={() => setAuthMode("signup")} variant="ghost">Get started</Button>
        </div>
        <div className="integration-cloud" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i}>{["◆", "✳", "◒", "◈", "▰", "✦"][i % 6]}</span>
          ))}
        </div>
      </section> */}

      {/* <section className="next-gen" id="pricing">
        <div className="section-heading">
          <h2>Next-gen AI features</h2>
          <div className="arrow-buttons"><button>‹</button><button>›</button></div>
        </div>
        <div className="carousel">
          {nextGen.map(([title, text], index) => (
            <article key={title} style={{ backgroundImage: `url(${gradientImages[index % gradientImages.length]})` }}>
              <button aria-label={`Expand ${title}`}>+</button>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section> */}

      <section className="feedback" aria-labelledby="feedback-title">
        <div className="feedback-copy">
          <span>Feedback</span>
          <h2 id="feedback-title">Built because repetitive work is boring.</h2>
          <p>We wanted a tool that feels fast, useful, and simple from the first click. Mosaic is launching today, and your feedback decides what gets better next.</p>
          <div className="feedback-badges" aria-label="Mosaic values">
            <b>No fake testimonials</b>
            <b>Built in public</b>
            <b>Improving daily</b>
          </div>
        </div>

        <form className="feedback-form" onSubmit={handleFeedbackSubmit}>
          <div className="feedback-form-heading">
            <h3>Help us improve Mosaic</h3>
            <p>Found something confusing, broken, or missing? Tell us.</p>
          </div>

          <div className="feedback-row">
            <label>
              Name
              <input
                autoComplete="name"
                name="name"
                onChange={(event) => setFeedbackName(event.target.value)}
                placeholder="Your name"
                required
                type="text"
                value={feedbackName}
              />
            </label>

            <label>
              Email
              <input
                autoComplete="email"
                name="email"
                onChange={(event) => setFeedbackEmail(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={feedbackEmail}
              />
            </label>
          </div>

          <label>
            Feedback
            <textarea
              name="message"
              onChange={(event) => setFeedbackMessage(event.target.value)}
              placeholder="What should we improve, fix, or build next?"
              required
              rows={5}
              value={feedbackMessage}
            />
          </label>

          <button disabled={isSendingFeedback} type="submit">
            {isSendingFeedback ? "Sending..." : "Send feedback →"}
          </button>

          {feedbackStatus && <p className="feedback-success" role="status">{feedbackStatus}</p>}
          {feedbackError && <p className="feedback-error" role="alert">{feedbackError}</p>}
        </form>
      </section>

     <section className="faq" id="faqs">
      <h2>We&apos;ve got answers</h2>

      <div className="faq-list">
        {faqs.map((faq) => (
          <details key={faq.question}>
            <summary>
              {faq.question}
              <span>+</span>
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
<section className="developers" id="contact">
  <h2>Meet the Developers</h2>

  <div className="developers-grid">
    <div className="developer-card">
      <img
        src="/images/diya.jpg"
        alt="Diya Bajoria"
        width={120}
        height={120}
        className="developer-avatar"
      />

      <h3>Diya Bajoria</h3>
      <p className="developer-role">
        <span className="pinky">does the pretty stuff</span>
        <br />
        <span>(Frontend & UI Design)</span>
      </p>

      <div className="developer-links">
        <a
          href="https://www.linkedin.com/in/diya-bajoria-375367335/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/diyabajoria"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
    </div>

    <div className="developer-card">
      <img
        src="/images/vishal-vaibhav-profile.jpeg"
        alt="Vishal Vaibhav"
        width={120}
        height={120}
        className="developer-avatar"
      />

      <h3>Vishal Vaibhav</h3>
      <p className="developer-role">
        <span className="pinky">does the scary stuff</span>
        <br />
        <span className="sub-role">(Backend & Systems Engineering)</span>
      </p>

      <div className="developer-links">
        <a
          href="https://www.linkedin.com/in/vishal-vaibhav01/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/VishalVab01"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
    </div>
  </div>
</section>
      <section className="cta" id="generate">
        <video aria-hidden="true" autoPlay muted loop playsInline src={heroVideo} />
        <h2>Ready to automate everything?</h2>

        <div className="actions">
          <Button href="/signup" onClick={() => setAuthMode("signup")}>Get started</Button>
          <Button variant="ghost">Learn more</Button>
        </div>
      </section>

      <footer>
        <div>
          <Logo 
          />
          <p>Built for modern frontend workflows.</p>
        </div>
        <div>
          <h3>Product</h3>
          {navItems.map((item) => <a href="#" key={item}>{item}</a>)}
        </div>
        <div>
          <h3>Legal</h3>
          {["Terms of service", "Privacy policy", "404"].map((item) => <a href="#" key={item}>{item}</a>)}
        </div>
        <div>
        <h3>Connect</h3>
        
        <a
          href="https://www.linkedin.com/in/diya-bajoria-375367335/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>

        <a
          href="https://github.com/diyabajoria"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
        
        <p className="copyright">They hate us 'cause they ain't us <br/> Peace. </p>
      </footer>
      

      {authMode && (
        <div className="auth-modal" role="dialog" aria-modal="true" aria-label="Authentication">
          <button className="auth-modal-backdrop" aria-label="Close authentication" onClick={() => setAuthMode(null)} />
          <div className="auth-modal-panel">
            <button className="auth-modal-close" type="button" aria-label="Close" onClick={() => setAuthMode(null)}>
              x
            </button>
            <Suspense fallback={null}>
              <AuthForm mode={authMode} onModeChange={setAuthMode} />
            </Suspense>
          </div>
        </div>
      )}
    </main>
  );
}
