import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {UserDeviceInfo} from '../models';
import {UserDeviceInfoRepository} from '../repositories';

export class UserDeviceInfoController {
  constructor(
    @repository(UserDeviceInfoRepository)
    public userDeviceInfoRepository: UserDeviceInfoRepository,
  ) {}

  @post('/user-device-infos')
  @response(200, {
    description: 'UserDeviceInfo model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserDeviceInfo)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserDeviceInfo, {
            title: 'NewUserDeviceInfo',
            exclude: ['userDeviceId'],
          }),
        },
      },
    })
    userDeviceInfo: Omit<UserDeviceInfo, 'userDeviceId'>,
  ): Promise<UserDeviceInfo> {
    return this.userDeviceInfoRepository.create(userDeviceInfo);
  }

  @get('/user-device-infos/count')
  @response(200, {
    description: 'UserDeviceInfo model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UserDeviceInfo) where?: Where<UserDeviceInfo>,
  ): Promise<Count> {
    return this.userDeviceInfoRepository.count(where);
  }

  @get('/user-device-infos')
  @response(200, {
    description: 'Array of UserDeviceInfo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserDeviceInfo, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(UserDeviceInfo) filter?: Filter<UserDeviceInfo>,
  ): Promise<UserDeviceInfo[]> {
    return this.userDeviceInfoRepository.find(filter);
  }

  @patch('/user-device-infos')
  @response(200, {
    description: 'UserDeviceInfo PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserDeviceInfo, {partial: true}),
        },
      },
    })
    userDeviceInfo: UserDeviceInfo,
    @param.where(UserDeviceInfo) where?: Where<UserDeviceInfo>,
  ): Promise<Count> {
    return this.userDeviceInfoRepository.updateAll(userDeviceInfo, where);
  }

  @get('/user-device-infos/{id}')
  @response(200, {
    description: 'UserDeviceInfo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserDeviceInfo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(UserDeviceInfo, {exclude: 'where'})
    filter?: FilterExcludingWhere<UserDeviceInfo>,
  ): Promise<UserDeviceInfo> {
    return this.userDeviceInfoRepository.findById(id, filter);
  }

  @patch('/user-device-infos/{id}')
  @response(204, {
    description: 'UserDeviceInfo PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserDeviceInfo, {partial: true}),
        },
      },
    })
    userDeviceInfo: UserDeviceInfo,
  ): Promise<void> {
    await this.userDeviceInfoRepository.updateById(id, userDeviceInfo);
  }

  @put('/user-device-infos/{id}')
  @response(204, {
    description: 'UserDeviceInfo PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() userDeviceInfo: UserDeviceInfo,
  ): Promise<void> {
    await this.userDeviceInfoRepository.replaceById(id, userDeviceInfo);
  }

  @del('/user-device-infos/{id}')
  @response(204, {
    description: 'UserDeviceInfo DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userDeviceInfoRepository.deleteById(id);
  }
}
