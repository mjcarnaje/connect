export interface ServerToClientEvents {
  new_rooms: (publicRooms: string[]) => void;
  joined: (nickname: string) => void;
  bye: (nickname: string) => void;
  new_message: (newMessage: string) => void;
}
export interface ClientToServerEvents {
  nickname: (nickname: string) => void;
  enter_room: (nickname: string, roomId: string, callback: () => void) => void;
  new_message: (
    newMessage: string,
    roomId: string,
    callback: () => void
  ) => void;
}
export interface InterServerEvents {
  ping: () => void;
}
export interface SocketData {
  nickname: string;
}
