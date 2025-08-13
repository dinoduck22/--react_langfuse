import React from 'react';

const DUMMY_MEMBERS = [
    { id: '1', name: "김인턴", email: 'intern.kim@wini-tech.com', role: 'Admin' },
    { id: '2', name: "이사원", email: 'lee_work@wini-tech.com', role: 'Member' },
    { id: '3', name: "박대리", email: 'park-wini@wini-tech.com', role: 'Member' },
];

const Members: React.FC = () => {
    return (
        <div>
            <h2>Members</h2>
            <p>조직의 멤버를 관리하세요.</p>
            <button>+ Invite Member</button>

            <table style = { { width: '100%', marginTop: '20px', borderCollapse: 'collapse' } }>
                <thead>
                    <tr style = { { borderBottom: '1px solid #ccc', textAlign: 'left' } }>
                        <th style={ { padding: '8px' } }>Name</th>
                        <th style={ { padding: '8px' } }>Email</th>
                        <th style={ { padding: '8px' } }>Role</th>
                    </tr>
                </thead>
                <tbody>
                {DUMMY_MEMBERS.map(member => (
                    <tr key = { member.id } style = { { borderBottom: '1px solid #eee'} }>
                        <td style= { { padding: '8px' } }>{member.name}</td>
                        <td style= { { padding: '8px' } }>{member.email}</td>
                        <td style= { { padding: '8px' } }>{member.role}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Members;