import React from 'react';
import styles from './FormPageLayout.module.css';

interface FormPageLayoutProps {
  breadcrumbs: React.ReactNode;
  children: React.ReactNode;
  onSave: () => void;
  onCancel: () => void;
  isSaveDisabled?: boolean;
}

const FormPageLayout: React.FC<FormPageLayoutProps> = ({
  breadcrumbs,
  children,
  onSave,
  onCancel,
  isSaveDisabled = false,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>{breadcrumbs}</div>
      <div className={styles.form}>{children}</div>
      <div className={styles.actions}>
        <button className={styles.cancelButton} onClick={onCancel}>
          Cancel
        </button>
        <button className={styles.saveButton} onClick={onSave} disabled={isSaveDisabled}>
          Save
        </button>
      </div>
    </div>
  );
};

export default FormPageLayout;