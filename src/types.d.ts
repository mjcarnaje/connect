export interface ServerToClientEvents {
  new_rooms: (publicRooms: string[]) => void;
  welcome: (nickname: string, countActive: number) => void;
  leave_room: (nickname: string, countActive: number) => void;
  new_message: (newMessage: string) => void;
}
export interface ClientToServerEvents {
  nickname: (nickname: string) => void;
  enter_room: (
    nickname: string,
    roomId: string,
    callback: (countActive: number) => void
  ) => void;
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
