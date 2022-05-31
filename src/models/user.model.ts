import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {RoleMapping} from './role-mapping.model';
import {Role} from './role.model';
import {UserCredentials} from './user-credentials.model';

@model({
  settings: {
    hiddenProperties: ['password', 'userLoginAttempt', 'externalChatId'],
  },
})
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  userId: number;

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
    },
  })
  username: string;

  @property({
    type: 'string',
    jsonSchema: {
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{5,512})',
      minLength: 8,
      maxLength: 512,
      format: 'password',
    },
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
    jsonSchema: {
      transform: ['toLowerCase'],
    },
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      transform: ['toLowerCase'],
    },
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
    // Need to add a regex for the phone no
    // jsonSchema: {
    //   pattern: '',
    // },
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

  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;

  @hasMany(() => Role, {through: {model: () => RoleMapping}})
  roles: Role[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
