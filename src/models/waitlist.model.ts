import {Entity, model, property} from '@loopback/repository';

@model()
export class Waitlist extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  waitlistId: number;

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
  })
  phone: string;

  @property({
    type: 'string',
    required: true,
  })
  countryCode: string;

  @property({
    type: 'boolean',
    required: true,
    default: false,
  })
  isApproved: boolean;

  constructor(data?: Partial<Waitlist>) {
    super(data);
  }
}

export interface WaitlistRelations {
  // describe navigational properties here
}

export type WaitlistWithRelations = Waitlist & WaitlistRelations;
