import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class RoutesGateway {
  @SubscribeMessage('new-direction')
  handleMessage(client: any, payload: any) {
    console.log(payload);
  }
}
