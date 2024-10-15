import { Body, OnModuleInit } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(11111,{ cors: true, transports:['websocket'] })
export class CryptopriceGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit(){
    this.server.on('connection', (socket) => {
      console.log(socket.id, " connect to server");
    });
  }
  @SubscribeMessage('message')
  handleMessage(@MessageBody() msg: string){
    console.log(msg)
    this.server.emit('onMessage', {
      message: msg,
      content: Body,
    })
  }
}
