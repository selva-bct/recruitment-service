import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {IndulgeDBDataSource} from '../datasources';
import {UserServiceBindings} from '../keys';
import {UserDeviceInfo, UserDeviceInfoRelations} from '../models';

export class UserDeviceInfoRepository extends DefaultCrudRepository<
  UserDeviceInfo,
  typeof UserDeviceInfo.prototype.userDeviceId,
  UserDeviceInfoRelations
> {
  constructor(
    @inject(`datasources.${UserServiceBindings.DATASOURCE_NAME}`)
    dataSource: IndulgeDBDataSource,
  ) {
    super(UserDeviceInfo, dataSource);
  }
}
