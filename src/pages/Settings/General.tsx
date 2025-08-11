import React from 'react';
//import { Outlet } from 'react-router-dom';
import styles from './General.module.css'

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
    const [projectName, setProjectName] = React.useState(generalSettingsData.projectName);

    return (
        <div className = { styles.container }>
            { /* Host Name Section */ }
            <h3 className = { styles.h3 }>Host Name</h3>
            <section className = { styles.section }>
                <p className = { styles.p }>When connecting to Langfuse, use this hostname / baseurl.</p>
                <input type = "text" value = { generalSettingsData.hostName } readOnly className={ styles.input } />
            </section>

            { /* Project Name Section */ }
            <h3 className = { styles.h3 }>Project Name</h3>
            <section className={ styles.section }>
                <p className = { styles.p }>Your Project is currently named '{generalSettingsData.projectName}'.</p>
                <input
                    type = "text"
                    value = { projectName }
                    onChange = { (e) => setProjectName(e.target.value) }
                    className = { styles.input }
                />
                <button className = { styles.button }>Save</button>
            </section>

            { /* Debug Information Section */ }
            <h3 className = { styles.h3 }>Debug Information</h3>
            <section className = { styles.section }>
                <div className = { styles.codeBlock }>
                    { JSON.stringify(generalSettingsData.debugInfo, null, 2) }
                </div>
            </section>

            { /* Danger Zone Section */ }
            <h3 className = { styles.h3 }>Danger Zone</h3>
            <section className = { `${ styles.section } ${ styles.dangerZone }` }>
                <div className = { styles.flexBetween }>
                    <div>
                        <h4>Transfer ownership</h4>
                        <p className = { styles.p }>Transfer this project to another organization where you have the ability to create projects.</p>
                    </div>
                    <button className = { `${ styles.button } ${ styles.dangerButton }` }>Transfer Project</button>
                </div>
                <div className = { styles.flexBetween }>
                    <div>
                        <h4>Delete this project</h4>
                        <p className = { styles.p }>Once you delete a project, there is no going back. Please be certain.</p>
                    </div>
                    <button className = { `${ styles.button } ${ styles.dangerButton }` }>Delete Project</button>
                </div>
            </section>
        </div>
    );
};

export default General;