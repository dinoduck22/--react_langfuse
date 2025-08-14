export type Session = {
  id: string;
  isFavorited: boolean;
  createdAt: string;
  duration: string;
  environment: string;
  userIds: string;
  traces: number;
  totalCost: number;
  usage: {
    input: number;
    output: number;
  };
};

export const DUMMY_SESSIONS: Session[] = [
    { id: 'if.docs.conversation.RcZENJ', isFavorited: false, createdAt: '2025-08-14 10:40:57', duration: '8.00s', environment: 'default', userIds: 'u-TxxkpkWQ', traces: 1, totalCost: 0.000030, usage: { input: 929, output: 1222 } },
    { id: 'if.docs.conversation.z3UxmUI', isFavorited: true, createdAt: '2025-08-14 10:41:07', duration: '4.00s', environment: 'default', userIds: 'u-gX8HKmUh', traces: 1, totalCost: 0.000038, usage: { input: 94, output: 114 } },
    { id: 'if.docs.conversation.GZTmiP', isFavorited: false, createdAt: '2025-08-14 05:19:52', duration: '2.00s', environment: 'default', userIds: 'u-Pve8Hvz', traces: 1, totalCost: 0.000035, usage: { input: 92, output: 108 } },
    { id: 'if.docs.conversation.J2080Yg', isFavorited: false, createdAt: '2025-08-14 05:01:37', duration: '2.00s', environment: 'default', userIds: 'u-xviijmGG', traces: 1, totalCost: 0.000022, usage: { input: 92, output: 114 } },
    { id: 'if.docs.conversation.ahm.kw3', isFavorited: true, createdAt: '2025-08-14 03:40:13', duration: '6.00s', environment: 'default', userIds: 'u-qchGZnvD', traces: 1, totalCost: 0.000078, usage: { input: 1288, output: 1587 } },
    { id: 'if.docs.conversation.RJTmng', isFavorited: false, createdAt: '2025-08-14 03:17:31', duration: '4.00s', environment: 'default', userIds: 'u-RZXM8eJB', traces: 1, totalCost: 0.000043, usage: { input: 96, output: 144 } },
    { id: 'if.docs.conversation.1L9WkZnp', isFavorited: false, createdAt: '2025-08-14 03:16:30', duration: '4.00s', environment: 'default', userIds: 'u-PmeTjuMr', traces: 1, totalCost: 0.000030, usage: { input: 344, output: 397 } },
    { id: 'if.docs.conversation.6V9SGqr', isFavorited: false, createdAt: '2025-08-14 03:14:51', duration: '2.00s', environment: 'default', userIds: 'u-bMGJep', traces: 1, totalCost: 0.000002, usage: { input: 93, output: 104 } },
    { id: 'if.docs.conversation.6mDYONQ', isFavorited: false, createdAt: '2025-08-14 02:49:48', duration: '35.00s', environment: 'default', userIds: 'u-xstaLwm', traces: 3, totalCost: 0.000568, usage: { input: 2829, output: 3872 } },
];