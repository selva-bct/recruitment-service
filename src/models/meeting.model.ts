import {Entity, model, property} from '@loopback/repository';

@model()
export class Meeting extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  meetingId?: number;

  @property({
    type: 'date',
    required: true,
  })
  date: string;

  @property({
    type: 'date',
    required: true,
  })
  startTime: string;

  @property({
    type: 'date',
    required: true,
  })
  endTime: string;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  recipentIds: string[];


  constructor(data?: Partial<Meeting>) {
    super(data);
  }
}

export interface MeetingRelations {
  // describe navigational properties here
}

export type MeetingWithRelations = Meeting & MeetingRelations;
