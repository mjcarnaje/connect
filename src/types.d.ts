export interface ServerToClientEvents {
  joined: (userNickname: string) => void;
  bye: (userNickname: string) => void;
  new_message: (newMessage: string) => void;
}
export interface ClientToServerEvents {
  nickname: (nickname: string) => void;
  enter_room: (roomName: string, callback: () => void) => void;
  new_message: (
    newMessage: string,
    roomName: string,
    callback: () => void
  ) => void;
}
export interface InterServerEvents {
  ping: () => void;
}
export interface SocketData {
  nickname: string;
}
