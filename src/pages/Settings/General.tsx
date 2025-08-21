import React, { useState, useEffect } from 'react';
import commonStyles from "./layout/SettingsCommon.module.css";
import styles from './layout/General.module.css'

const generalSettingsData = {
  hostName: 'https://cloud.langfuse.com',
  projectName: 'wowproject',
  debugInfo: {
    project: {
      name: 'wowproject',
      id: 'prj-sdn65537829dsad87sdpgf89hz',
    },
    org: {
      name: 'wow',
      id: 'org-sd8sng8sgsg87sdg8sdg',
    }
  }
};

const General: React.FC = () => {
    const [originalProjectName, setOriginalProjectName] = useState(generalSettingsData.projectName);
    const [projectName, setProjectName] = useState(generalSettingsData.projectName);
    const [isSaveDisabled, setIsSaveDisabled] = useState(true);
    const [isPristine, setIsPristine] = useState(true);

    useEffect(() => {
        setIsSaveDisabled(projectName.trim() === '' || projectName === originalProjectName);
    }, [projectName, originalProjectName]);

    const handleSave = () => {
        alert(`Project name changed to: ${ projectName }`);
        setOriginalProjectName(projectName);
    }

    const handleFocus = () => {
        if (isPristine) {
            setProjectName('');
        }
    };

    const handleBlur = () => {
        if (projectName.trim() === '') {
            setProjectName(originalProjectName);
            setIsPristine(true);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isPristine) {
            setIsPristine(false);
        }
        setProjectName(e.target.value);
    };

    return (
        <div className = { commonStyles.container }>
            { /* Host Name Section */ }
            <h3 className = { commonStyles.title }>Host Name</h3>
            <section className = { commonStyles.section }>
                <p className = { commonStyles.p }>When connecting to Langfuse, use this hostname / baseurl.</p>
                <input type = "text" value = { generalSettingsData.hostName } readOnly className={ commonStyles.input } />
            </section>

            { /* Project Name Section */ }
            <h3 className = { commonStyles.title }>Project Name</h3>
            <section className={ commonStyles.section }>
                <p className = { commonStyles.p }>Your Project is currently '{ originalProjectName }'.</p>
                <input
                    type = "text"
                    value = { projectName }
                    onChange = { handleChange }
                    onFocus = { handleFocus }
                    onBlur = { handleBlur }
                    className = { `${ commonStyles.input } ${ isPristine ? styles.inputPristine : ''}` }
                />
                <button className = { commonStyles.button } onClick = { handleSave } disabled = { isSaveDisabled }>Save</button>
            </section>

            { /* Debug Information Section */ }
            <h3 className = { commonStyles.title }>Debug Information</h3>
            <section className = { commonStyles.section }>
                <div className = { styles.codeBlock }>
                    { JSON.stringify(generalSettingsData.debugInfo, null, 2) }
                </div>
            </section>

            { /* Danger Zone Section */ }
            <h3 className = { styles.title }>Danger Zone</h3>
            <section className = { `${ commonStyles.section } ${ styles.dangerZone }` }>
                <div className = { styles.flexBetween }>
                    <div>
                        <h4>Transfer ownership</h4>
                        <p className = { commonStyles.p }>Transfer this project to another organization where you have the ability to create projects.</p>
                    </div>
                    <button className = { `${ commonStyles.button } ${ styles.dangerButton }` }>Transfer Project</button>
                </div>
                <div className = { styles.flexBetween }>
                    <div>
                        <h4>Delete this project</h4>
                        <p className = { commonStyles.p }>Once you delete a project, there is no going back. Please be certain.</p>
                    </div>
                    <button className = { `${ commonStyles.button } ${ styles.dangerButton }` }>Delete Project</button>
                </div>
            </section>
        </div>
    );
};

export default General;