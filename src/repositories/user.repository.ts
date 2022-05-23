import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {IndulgeDBDataSource} from '../datasources';
import { UserServiceBindings } from '../keys';
import {User, UserRelations, UserCredentials} from '../models';
import {UserCredentialsRepository} from './user-credentials.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.userId,
  UserRelations
> {

  public readonly userCredentials: HasOneRepositoryFactory<UserCredentials, typeof User.prototype.userId>;

  constructor(
    @inject(`datasources.${UserServiceBindings.DATASOURCE_NAME}`) dataSource: IndulgeDBDataSource, @repository.getter('UserCredentialsRepository') protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
  ) {
    super(User, dataSource);
    this.userCredentials = this.createHasOneRepositoryFactoryFor('userCredentials', userCredentialsRepositoryGetter);
    this.registerInclusionResolver('userCredentials', this.userCredentials.inclusionResolver);
  }

  async findCredentials(userId: typeof User.prototype.userId): Promise<UserCredentials | undefined> {
    try {
      return await this.userCredentials(userId).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}
