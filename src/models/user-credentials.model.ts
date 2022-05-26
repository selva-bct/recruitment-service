import {Entity, model, property} from '@loopback/repository';

@model()
// @model({settings: {strict: false}})
export class UserCredentials extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
  })
  otp: string;

  @property({
    type: 'number',
    required: true,
  })
  userId: number;
  // [prop: string]: any;

  constructor(data?: Partial<UserCredentials>) {
    super(data);
  }
}

export interface UserCredentialsRelations {
  // describe navigational properties here
}

export type UserCredentialsWithRelations = UserCredentials &
  UserCredentialsRelations;
