import React from 'react';
import styles from './ToggleSwitch.module.css';

interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const ToggleSwitch = ({ checked, onChange }: ToggleSwitchProps) => {
    const handleChange = () => {
        onChange(!checked);
    };

    return (
        <label className = { styles.switch }>
            <input type = "checkbox" checked = { checked } onChange = { handleChange } />
            <span className = { `${ styles.slider } ${ styles.round }`}></span>
        </label>
    );
};

export default ToggleSwitch;