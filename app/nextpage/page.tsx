"use client";

import "./next.css";
import { useState } from "react";
import {
  Plus,
  Paperclip,
  Sparkles,
  Settings,
  FileText,
  Menu,
} from "lucide-react";

export default function GeneratePage() {
  const [figmaLink, setFigmaLink] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const projects = [
    "E-Commerce Landing",
    "Portfolio Website",
    "Dashboard UI",
    "SaaS Homepage",
  ];

  return (
    <div className="gen-page">
      {/* Sidebar Toggle Button */}
      

      {/* Sidebar */}
      <aside
  className={`gen-sidebar ${
    sidebarOpen ? "open" : "closed"
  }`}
>
  <button
    className="gen-menu-btn"
    onClick={() => setSidebarOpen(!sidebarOpen)}
  >
    <Menu size={20} />
  </button>

  {sidebarOpen && (
    <div className="gen-sidebar-content">
      <div className="gen-brand">
        <div className="gen-brand-title">
          Mosaic
        </div>

        <div className="gen-brand-subtitle">
          Design → Code
        </div>
      </div>

      <button className="gen-new-btn">
        <Plus size={18} />
        <span>New Project</span>
      </button>

      <div className="gen-divider" />

      <div className="gen-project-heading">
        Previous Projects
      </div>

      <div className="gen-project-list">
        {projects.map((project) => (
          <div
            key={project}
            className="gen-project-card"
          >
            <FileText size={16} />

            <div>
              <div className="gen-project-name">
                {project}
              </div>

              <div className="gen-project-time">
                Last opened recently
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}

  <div className="gen-sidebar-bottom">
    <button className="gen-icon-btn">
      <Settings size={18} />
    </button>

    <div className="gen-avatar">
      D
    </div>
  </div>
</aside>

      {/* Main */}
      <section className="gen-main">
        <div className="gen-content">
          <h1 className="gen-title">
            Turn your Figma designs into
            production-ready code.
          </h1>

          <p className="gen-description">
            Paste your Figma link, optionally attach
            reference images, and generate your
            application instantly.
          </p>

          <div className="gen-input-card">
            <textarea
              placeholder="Paste your Figma file URL here..."
              value={figmaLink}
              onChange={(e) =>
                setFigmaLink(e.target.value)
              }
            />

            <div className="gen-toolbar">
              <label className="gen-upload-btn">
                <Paperclip size={18} />
                <input
                  type="file"
                  hidden
                />
              </label>
              

              <button className="gen-run-btn">
                Run
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}