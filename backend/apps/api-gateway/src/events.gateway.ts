import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

export enum SocketRooms {
  TEAM_OVERVIEW = 'team:overview',
  NOTIFICATIONS = 'notifications',
  USER_PREFIX = 'user:',
  DEPT_PREFIX = 'dept:',
}

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/',
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);
  private onlineUsers = new Map<string, string>(); // socketId -> userId

  afterInit(server: Server) {
    this.logger.log('⚡ [Socket.IO Gateway] Initialized and listening for connections');
  }

  handleConnection(client: Socket) {
    this.logger.log(`🔌 Client Connected: ${client.id}`);
    // Default join global notifications room
    client.join(SocketRooms.NOTIFICATIONS);
    this.broadcastOnlineCount();
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`❌ Client Disconnected: ${client.id}`);
    this.onlineUsers.delete(client.id);
    this.broadcastOnlineCount();
  }

  // --- Room Management ---
  @SubscribeMessage('join_room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string; userId?: string },
  ) {
    if (!data || !data.room) return;
    client.join(data.room);
    if (data.userId) {
      this.onlineUsers.set(client.id, data.userId);
      client.join(`${SocketRooms.USER_PREFIX}${data.userId}`);
    }
    this.logger.log(`🚪 Client ${client.id} joined room: ${data.room}`);
    this.broadcastOnlineCount();
    return { status: 'joined', room: data.room };
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string },
  ) {
    if (!data || !data.room) return;
    client.leave(data.room);
    this.logger.log(`🚪 Client ${client.id} left room: ${data.room}`);
    return { status: 'left', room: data.room };
  }

  // --- Real-time Broadcasting Helpers ---

  /**
   * Broadcast task changes across target rooms (Team Overview, Notifications, Personal Room, Department Room)
   */
  broadcastTaskEvent(eventName: 'task:created' | 'task:updated' | 'task:deleted', task: any) {
    if (!this.server) return;

    const targetRooms: string[] = [SocketRooms.TEAM_OVERVIEW];

    // If urgent or high priority -> broadcast to global notifications room
    if (task.category === 'urgent' || task.priority === 'high') {
      targetRooms.push(SocketRooms.NOTIFICATIONS);
    }

    // Target specific user's personal room if available
    if (task.userId) {
      targetRooms.push(`${SocketRooms.USER_PREFIX}${task.userId}`);
    }

    // Target department room if available
    if (task.department) {
      targetRooms.push(`${SocketRooms.DEPT_PREFIX}${task.department}`);
    }

    this.logger.log(`📢 Broadcasting ${eventName} to rooms: [${targetRooms.join(', ')}]`);
    this.server.to(targetRooms).emit(eventName, task);
  }

  /**
   * Broadcast urgent toast alert
   */
  broadcastUrgentAlert(alert: { title: string; message: string; taskId?: string }) {
    if (!this.server) return;
    this.server.to(SocketRooms.NOTIFICATIONS).emit('urgent_alert', alert);
  }

  /**
   * Broadcast live connected count
   */
  broadcastOnlineCount() {
    if (!this.server) return;
    const count = this.server.sockets?.sockets?.size || 0;
    this.server.emit('online_count', { count });
  }
}
