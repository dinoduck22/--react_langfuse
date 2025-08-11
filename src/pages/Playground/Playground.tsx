import {
  Info,
  Play,
  RotateCcw,
  Plus,
  Copy,
  Save,
  Wrench,
  BookText,
  Variable,
  GripVertical,
  X,
  MessageSquarePlus,
  PlusSquare,
} from "lucide-react";
import styles from "./Playground.module.css";

export default function Playground() {
  return (
    <div className={styles.container}>
      {/* 1. Header */}
      <div className={styles.header}>
        <div className={styles.title}>
          Playground <Info size={16} />
        </div>
        <div className={styles.actions}>
          <span className={styles.windowInfo}>1 window</span>
          <button className={styles.actionBtn}>
            <Play size={16} /> Run All (Ctrl + Enter)
          </button>
          <button className={styles.actionBtn}>
            <RotateCcw size={16} /> Reset playground
          </button>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className={styles.mainGrid}>
        {/* 2a. Left Panel (Settings & Inputs) */}
        <div className={styles.leftPanel}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span>Model</span>
              <div className={styles.cardActions}>
                <Copy size={16} />
                <Save size={16} />
              </div>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.noApiKeyText}>
                No LLM API key set in project.
              </p>
              <button className={styles.addLlmBtn}>
                <Plus size={16} /> Add LLM Connection
              </button>
            </div>
          </div>

          <div className={styles.controlsBar}>
            <button className={styles.controlBtn}>
              <Wrench size={14} /> Tools
            </button>
            <button className={styles.controlBtn}>
              <BookText size={14} /> Schema
            </button>
            <button className={styles.controlBtn}>
              <Variable size={14} /> Variables
            </button>
          </div>

          {/* Message Inputs */}
          <div className={styles.messageList}>
            <div className={styles.messageRow}>
              <GripVertical className={styles.dragHandle} size={18} />
              <span className={styles.messageRole}>System</span>
              <input
                type="text"
                className={styles.messageInput}
                placeholder="Enter a system message here."
              />
              <X className={styles.removeBtn} size={18} />
            </div>
            <div className={styles.messageRow}>
              <GripVertical className={styles.dragHandle} size={18} />
              <span className={styles.messageRole}>User</span>
              <input
                type="text"
                className={styles.messageInput}
                placeholder="Enter a user message here."
              />
              <X className={styles.removeBtn} size={18} />
            </div>
          </div>

          <div className={styles.addButtons}>
            <button className={styles.addBtn}>
              <MessageSquarePlus size={16} /> Message
            </button>
            <button className={styles.addBtn}>
              <PlusSquare size={16} /> Placeholder
            </button>
          </div>
        </div>

        {/* 2b. Right Panel (Output) */}
        <div className={styles.rightPanel}>
          <div className={styles.outputCard}>
            <div className={styles.cardHeader}>
              <span>Output</span>
            </div>
            <div className={styles.outputBody}>
              {/* Output content would go here */}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Footer */}
      <div className={styles.footer}>
        <button className={styles.submitBtn}>Submit</button>
      </div>
    </div>
  );
}