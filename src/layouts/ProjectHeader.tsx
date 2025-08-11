import React from 'react';
import { PanelLeft, ChevronDown } from 'lucide-react'
import styles from './ProjectHeader.module.css'

interface ProjectHeaderProps {
    onToggleSidebar: () => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ onToggleSidebar }) => {
    return (
        <div className = { styles.projectHeader }>
            <div className = { styles.leftSection }>
                <button className = { styles.toggleButton } onClick = { onToggleSidebar }>
                    <PanelLeft size = { 18 }/>
                </button>
                <div className = { styles.breadcrumbs }>
                    <span>Organization</span>
                    <span className = { styles.tag }>Hobby</span>
                    <ChevronDown size = { 14 } />
                    <span className = { styles.separator }>/</span>
                    <div className = { styles.dropdown }>
                        <span>Project</span>
                        <ChevronDown size = { 14 } />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectHeader;