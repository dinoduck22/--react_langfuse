import React from 'react';
import { Info, Plus, Clipboard, Trash2 } from 'lucide-react';
import styles from "./ApiKeys.module.css";

const DUMMY_API_KEYS = [
    {
        id: '1',
        created: '2025. 8. 7',
        note: 'Click to add note',
        publicKey: 'pkey',
        secretKey: 'skey',
    },
    {
        id: '2',
        created: '2025. 8. 1',
        note: 'Click to add note',
        publicKey: 'pkey',
        secretKey: 'skey',
    },
    {
        id: '3',
        created: '2025. 8. 27',
        note: 'Click to add note',
        publicKey: 'pkey',
        secretKey: 'skey',
    },
];

const ApiKeys: React.FC = () => {
    return (
        <div className = { styles.container }>
            { /* Host Name Section */ }
            <h3 className = { styles.h3 }>Project API Keys <Info size = { 16 } className = { styles.infoIcon } /></h3>

            <div className = { styles.keyList }>
                <div className = { `${ styles.keyRow } ${ styles.keyHeader }` }>
                    <div>Created</div>
                    <div>Note</div>
                    <div>Public Key</div>
                    <div>Secret Key</div>
                </div>

                { DUMMY_API_KEYS.map(apiKey => (
                    <div key = { apiKey.id } className = { styles.keyRow }>
                        <div>{ apiKey.created }</div>
                        <div>{ apiKey.note }</div>
                        <div className = { styles.keyBox }>
                            <span><code>{ `${ styles.key } ${ apiKey.publicKey }` }</code></span>
                            <Clipboard size = { 14 } className = { styles.copyIcon } />
                        </div>
                        <div className = { styles.key }>
                            <code>{ apiKey.secretKey }</code>
                        </div>
                        <div>
                            <Trash2 size = { 16 } className = { styles.deleteIcon } />
                        </div>
                    </div>
                ))}
            </div>
            <button className = { styles.createbutton }>
                <Plus size = { 16 } /> Create new API keys
            </button>
        </div>
    );
};

export default ApiKeys;