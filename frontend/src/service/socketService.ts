import { io, Socket } from 'socket.io-client';

export const SocketRooms = {
  TEAM_OVERVIEW: 'team:overview',
  NOTIFICATIONS: 'notifications',
  USER_PREFIX: 'user:',
  DEPT_PREFIX: 'dept:',
} as const;

export type SocketRoomType = typeof SocketRooms[keyof typeof SocketRooms];

const getSocketUrl = (): string => {
  if (typeof window !== 'undefined') {
    if (window.location.port === '5173') {
      return 'http://localhost:3000';
    }
    return window.location.origin;
  }
  return 'http://localhost:3000';
};

class SocketService {
  private socket: Socket | null = null;

  init(): Socket {
    if (this.socket) return this.socket;

    const url = getSocketUrl();
    this.socket = io(url, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    this.socket.on('connect', () => {
      console.log('⚡ [Socket.IO] Connected to server (ID: ' + this.socket?.id + ')');
      this.joinRoom(SocketRooms.NOTIFICATIONS);

      const currentUserId = localStorage.getItem('current_user_id');
      if (currentUserId) {
        this.joinRoom(`${SocketRooms.USER_PREFIX}${currentUserId}`, currentUserId);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('❌ [Socket.IO] Disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.warn('⚠️ [Socket.IO] Connection error:', error.message);
    });

    return this.socket;
  }

  getSocket(): Socket | null {
    if (!this.socket) {
      return this.init();
    }
    return this.socket;
  }

  joinRoom(room: string, userId?: string) {
    const s = this.getSocket();
    if (s?.connected) {
      s.emit('join_room', { room, userId });
    } else {
      s?.once('connect', () => {
        s.emit('join_room', { room, userId });
      });
    }
  }

  leaveRoom(room: string) {
    const s = this.getSocket();
    if (s?.connected) {
      s.emit('leave_room', { room });
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    const s = this.getSocket();
    s?.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    const s = this.getSocket();
    if (callback) {
      s?.off(event, callback);
    } else {
      s?.off(event);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
