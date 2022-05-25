import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication, RestBindings} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {JWTAuthenticationComponent} from './component/jwt-authentication-component';
import {IndulgeDBDataSource} from './datasources';
import {CustomErrorProvider} from './providers';
import {MySequence} from './sequence';
export {ApplicationConfig};

export class UserServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.dataSource(IndulgeDBDataSource);
    this.component(JWTAuthenticationComponent);
    // Configuring the custom error handler
    this.bind(RestBindings.SequenceActions.REJECT).toProvider(
      CustomErrorProvider,
    );
    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here

    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
