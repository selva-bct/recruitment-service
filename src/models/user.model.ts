import {Entity, model, property, hasOne} from '@loopback/repository';
import {UserCredentials} from './user-credentials.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  userId: string;

  @property({
    type: 'date',
    required: true,
  })
  dateOfBirth: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
    jsonSchema: {
      transform: ['toLowerCase'],
    }
  })
  username: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{5,512})',
      minLength: 8,
      maxLength: 512,
      format: 'password'
    }
  })
  password: string;

  @property({
    type: 'boolean',
  })
  emailVerified?: boolean;

  @property({
    type: 'string',
    index: {
      unique: true,
    },
    jsonSchema: {
      format: 'email',
      transform: ['toLowerCase'],
      errorMessage: {
        pattern: 'Invalid Email',
      },
    },
  })
  email?: string;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
  })
  phone: string;

  @property({
    type: 'string',
    required: true,
  })
  countryCode: string;

  @property({
    type: 'number',
    required: true,
  })
  userLoginAttempt: number;
  
  @property({
    type: 'string',
    required: true,
  })
  externalChatId: string;

  @property({
    type: 'string',
    required: true,
  })
  otp: string;

  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
