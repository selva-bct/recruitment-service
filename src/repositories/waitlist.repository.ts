import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {IndulgeDBDataSource} from '../datasources';
import { UserServiceBindings } from '../keys';
import {Waitlist, WaitlistRelations} from '../models';

export class WaitlistRepository extends DefaultCrudRepository<
  Waitlist,
  typeof Waitlist.prototype.waitlistId,
  WaitlistRelations
> {
  constructor(
    @inject(`datasources.${UserServiceBindings.DATASOURCE_NAME}`) dataSource: IndulgeDBDataSource,
  ) {
    super(Waitlist, dataSource);
  }
}
