import React from 'react';
import styles from './Header.module.css'

interface HeaderProps {
    title: string;
    actions?: React.ReactNode; // 'actions'는 있든 말든 상관없음
    className?: string;
}

const Header: React.FC<HeaderProps> = ( { title, actions, className }) => {
    const headerClassName = `${ styles.header } ${ className || '' }`;
    return (
        <header className = { styles.header }>
            <h1 className = { styles.title }>{title}</h1>
            <div className = { styles.actions }>
                {actions}
            </div>
        </header>
    );
};

export default Header;