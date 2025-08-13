import React from 'react';
import styles from './PlaygroundPanel.module.css';

interface PlaygroundPanelProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const PlaygroundPanel: React.FC<PlaygroundPanelProps> = ({ title, description, children }) => {
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>{title}</div>
      <p className={styles.panelDescription}>{description}</p>
      {children}
    </div>
  );
};

export default PlaygroundPanel;