import { useEffect, useRef, useState } from 'react';
import io, { ManagerOptions, Socket, SocketOptions } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL as string;
const SOCKET_PATH = process.env.NEXT_PUBLIC_SOCKET_PATH as string;

const options: Partial<ManagerOptions & SocketOptions> = {
  path: SOCKET_PATH,
  transports: ['websocket', 'xhr-polling'],
  retries: 5,
  reconnection: true,
  reconnectionDelayMax: 5000
};

const useSocket = (
  options: Partial<ManagerOptions & SocketOptions>
): Socket => {
  const socketRef = useRef<Socket | null>(null);

  if (!socketRef.current) {
    socketRef.current = io(SOCKET_URL, options);
  }

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return socketRef.current;
};

export const useSocketHandler = (adminId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionCount, setConnectionCount] = useState(0);

  const socket = useSocket({ ...options, auth: { adminId } });

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      setConnectionCount(prevCount => prevCount + 1);
    };

    const onDisconnect = () => {
      setIsConnected(false);
      setConnectionCount(prevCount => prevCount - 1);
    };

    socket.connect();

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, [socket]);

  const subscribeEvent = (
    event: string,
    callback: <T extends Record<string, any>>(args: T) => void
  ) => {
    if (!isConnected) return;
    socket.on(event, callback);
  };

  const unSubscribeEvent = (
    event: string,
    callback: <T extends Record<string, any>>(args: T) => void
  ) => {
    if (!isConnected) return;
    socket.off(event, callback);
  };

  const emitOnEvent = (event: string, data: any) => {
    if (!isConnected) return;
    socket.emit(event, data);
  };

  const disconnectConnection = () => socket.disconnect();

  return {
    isConnected,
    disconnectConnection,
    subscribeEvent,
    emitOnEvent,
    connectionCount,
    unSubscribeEvent
  };
};
