import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {IndulgeDBDataSource} from '../datasources';
import {UserServiceBindings} from '../keys';
import {UserDeviceInfo, UserDeviceInfoRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class UserDeviceInfoRepository extends DefaultCrudRepository<
  UserDeviceInfo,
  typeof UserDeviceInfo.prototype.userDeviceId,
  UserDeviceInfoRelations
> {

  public readonly user: BelongsToAccessor<User, typeof UserDeviceInfo.prototype.userDeviceId>;

  constructor(
    @inject(`datasources.${UserServiceBindings.DATASOURCE_NAME}`)
    dataSource: IndulgeDBDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(UserDeviceInfo, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
