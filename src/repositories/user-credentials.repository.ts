import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {IndulgeDBDataSource} from '../datasources';
import {UserServiceBindings} from '../keys';
import {UserCredentials, UserCredentialsRelations} from '../models';
export class UserCredentialsRepository extends DefaultCrudRepository<
  UserCredentials,
  typeof UserCredentials.prototype.id,
  UserCredentialsRelations
> {
  constructor(
    @inject(`datasources.${UserServiceBindings.DATASOURCE_NAME}`)
    dataSource: IndulgeDBDataSource,
  ) {
    super(UserCredentials, dataSource);
  }
}
