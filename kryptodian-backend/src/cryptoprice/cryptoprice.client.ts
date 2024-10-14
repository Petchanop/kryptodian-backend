import { Injectable, OnModuleInit } from "@nestjs/common"
import { io, Socket } from 'socket.io-client'

@Injectable()
export class CryptoPriceClient implements OnModuleInit {
    public socketClient: Socket;

    constructor() {
        this.socketClient = io('ws://ws.coinapi.io/v1/', {
            auth : {
                apikey: 'CAC98DEB-05E1-4B01-AF86-A1E70D78D743',
            }
        })
}

onModuleInit() {
    this.socketClient.on('connect', () => {
        console.log('Connect to coinapi')
        })
    this.socketClient.on('error', (error) => {
        console.log("error ", error)
        })
    }
}
