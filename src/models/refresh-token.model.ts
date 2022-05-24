import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User} from '.';
@model()
export class RefreshToken extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  refreshTokenId: number;

  @property({
    type: 'string',
    required: true,
  })
  refreshToken: string;

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<RefreshToken>) {
    super(data);
  }
}

export interface RefreshTokenRelations {
  // describe navigational properties here
}

export type RefreshTokenWithRelations = RefreshToken & RefreshTokenRelations;
