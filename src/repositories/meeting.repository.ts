import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {IndulgeDBDataSource} from '../datasources';
import {UserServiceBindings} from '../keys';
import {Meeting, MeetingRelations} from '../models';

export class MeetingRepository extends DefaultCrudRepository<
  Meeting,
  typeof Meeting.prototype.meetingId,
  MeetingRelations
> {
  constructor(
    @inject(`datasources.${UserServiceBindings.DATASOURCE_NAME}`)
    dataSource: IndulgeDBDataSource,
  ) {
    super(Meeting, dataSource);
  }
}
