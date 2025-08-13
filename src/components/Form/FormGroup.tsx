import React from 'react';
import styles from './FormGroup.module.css';

interface FormGroupProps {
  label: string;
  subLabel: string;
  htmlFor: string;
  children: React.ReactNode;
}

const FormGroup: React.FC<FormGroupProps> = ({ label, subLabel, htmlFor, children }) => {
  return (
    <div className={styles.formGroup}>
      <label htmlFor={htmlFor} className={styles.label}>{label}</label>
      <p className={styles.subLabel}>{subLabel}</p>
      {children}
    </div>
  );
};

export default FormGroup;