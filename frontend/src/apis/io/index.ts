import io from 'socket.io-client';

export default io({
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 1000,
    reconnectionAttempts: 1,
    // query: {
    //     EIO: 3,
    //     transport: 'websocket',
    //     sid: 'ZnLiERiLiSkkAJY3ACFT',
    // },
    transports: ['websocket', 'polling'],
    // timeout: 5000,
});
