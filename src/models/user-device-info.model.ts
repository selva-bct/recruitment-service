import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User} from './user.model';

@model()
export class UserDeviceInfo extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  userDeviceId?: number;

  @property({
    type: 'string',
    required: true,
  })
  os: string;

  @property({
    type: 'string',
    required: true,
  })
  osVersion: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      transform: ['toLowerCase'],
    },
  })
  deviceType: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      transform: ['toLowerCase'],
    },
  })
  deviceName: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      transform: ['toLowerCase'],
    },
  })
  deviceCategory?: string;

  @belongsTo(() => User)
  userId: number;

  constructor(data?: Partial<UserDeviceInfo>) {
    super(data);
  }
}

export interface UserDeviceInfoRelations {
  // describe navigational properties here
}

export type UserDeviceInfoWithRelations = UserDeviceInfo &
  UserDeviceInfoRelations;
