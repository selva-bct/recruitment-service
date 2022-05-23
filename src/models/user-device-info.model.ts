import {Entity, model, property} from '@loopback/repository';

@model()
export class UserDeviceInfo extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  userDeviceId?: string;

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
  })
  deviceType: string;

  @property({
    type: 'string',
    required: true,
  })
  deviceName: string;

  @property({
    type: 'string',
    required: true,
  })
  deviceCategory?: string;

  constructor(data?: Partial<UserDeviceInfo>) {
    super(data);
  }
}

export interface UserDeviceInfoRelations {
  // describe navigational properties here
}

export type UserDeviceInfoWithRelations = UserDeviceInfo &
  UserDeviceInfoRelations;
