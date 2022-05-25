import {authenticate} from '@loopback/authentication';
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
import {RoleMapping} from '../models';
import {RoleMappingRepository} from '../repositories';

@authenticate('jwt')
export class RoleMappingController {
  constructor(
    @repository(RoleMappingRepository)
    public roleMappingRepository: RoleMappingRepository,
  ) {}

  @post('/role-mappings')
  @response(200, {
    description: 'RoleMapping model instance',
    content: {'application/json': {schema: getModelSchemaRef(RoleMapping)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RoleMapping, {
            title: 'NewRoleMapping',
            exclude: ['roleMappingId'],
          }),
        },
      },
    })
    roleMapping: Omit<RoleMapping, 'roleMappingId'>,
  ): Promise<RoleMapping> {
    return this.roleMappingRepository.create(roleMapping);
  }

  @get('/role-mappings/count')
  @response(200, {
    description: 'RoleMapping model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(RoleMapping) where?: Where<RoleMapping>,
  ): Promise<Count> {
    return this.roleMappingRepository.count(where);
  }

  @get('/role-mappings')
  @response(200, {
    description: 'Array of RoleMapping model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(RoleMapping, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(RoleMapping) filter?: Filter<RoleMapping>,
  ): Promise<RoleMapping[]> {
    return this.roleMappingRepository.find(filter);
  }

  @patch('/role-mappings')
  @response(200, {
    description: 'RoleMapping PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RoleMapping, {partial: true}),
        },
      },
    })
    roleMapping: RoleMapping,
    @param.where(RoleMapping) where?: Where<RoleMapping>,
  ): Promise<Count> {
    return this.roleMappingRepository.updateAll(roleMapping, where);
  }

  @get('/role-mappings/{id}')
  @response(200, {
    description: 'RoleMapping model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(RoleMapping, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(RoleMapping, {exclude: 'where'})
    filter?: FilterExcludingWhere<RoleMapping>,
  ): Promise<RoleMapping> {
    return this.roleMappingRepository.findById(id, filter);
  }

  @patch('/role-mappings/{id}')
  @response(204, {
    description: 'RoleMapping PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RoleMapping, {partial: true}),
        },
      },
    })
    roleMapping: RoleMapping,
  ): Promise<void> {
    await this.roleMappingRepository.updateById(id, roleMapping);
  }

  @put('/role-mappings/{id}')
  @response(204, {
    description: 'RoleMapping PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() roleMapping: RoleMapping,
  ): Promise<void> {
    await this.roleMappingRepository.replaceById(id, roleMapping);
  }

  @del('/role-mappings/{id}')
  @response(204, {
    description: 'RoleMapping DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.roleMappingRepository.deleteById(id);
  }
}
