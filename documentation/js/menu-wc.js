'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">clear-face-api documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-d56905b9fc0aebcb54eb2978a624b70cf882dcb63f3897fe9d233f75c2e97d84c411c000382b41da26b624b9740720be5547b10b1be918a9895b0e9c3fcbc12d"' : 'data-bs-target="#xs-injectables-links-module-AppModule-d56905b9fc0aebcb54eb2978a624b70cf882dcb63f3897fe9d233f75c2e97d84c411c000382b41da26b624b9740720be5547b10b1be918a9895b0e9c3fcbc12d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-d56905b9fc0aebcb54eb2978a624b70cf882dcb63f3897fe9d233f75c2e97d84c411c000382b41da26b624b9740720be5547b10b1be918a9895b0e9c3fcbc12d"' :
                                        'id="xs-injectables-links-module-AppModule-d56905b9fc0aebcb54eb2978a624b70cf882dcb63f3897fe9d233f75c2e97d84c411c000382b41da26b624b9740720be5547b10b1be918a9895b0e9c3fcbc12d"' }>
                                        <li class="link">
                                            <a href="injectables/ImagesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ImagesService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppointmentsModule.html" data-type="entity-link" >AppointmentsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppointmentsModule-622b58b30b77d9cfb818beb4353221174a5db16e836d1aebe4ba8cefe64c099d85647852a17f242902ad26951973440e4ff60eab9c2eba1f8085a336b2d7c2c8"' : 'data-bs-target="#xs-controllers-links-module-AppointmentsModule-622b58b30b77d9cfb818beb4353221174a5db16e836d1aebe4ba8cefe64c099d85647852a17f242902ad26951973440e4ff60eab9c2eba1f8085a336b2d7c2c8"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppointmentsModule-622b58b30b77d9cfb818beb4353221174a5db16e836d1aebe4ba8cefe64c099d85647852a17f242902ad26951973440e4ff60eab9c2eba1f8085a336b2d7c2c8"' :
                                            'id="xs-controllers-links-module-AppointmentsModule-622b58b30b77d9cfb818beb4353221174a5db16e836d1aebe4ba8cefe64c099d85647852a17f242902ad26951973440e4ff60eab9c2eba1f8085a336b2d7c2c8"' }>
                                            <li class="link">
                                                <a href="controllers/AppointmentsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppointmentsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppointmentsModule-622b58b30b77d9cfb818beb4353221174a5db16e836d1aebe4ba8cefe64c099d85647852a17f242902ad26951973440e4ff60eab9c2eba1f8085a336b2d7c2c8"' : 'data-bs-target="#xs-injectables-links-module-AppointmentsModule-622b58b30b77d9cfb818beb4353221174a5db16e836d1aebe4ba8cefe64c099d85647852a17f242902ad26951973440e4ff60eab9c2eba1f8085a336b2d7c2c8"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppointmentsModule-622b58b30b77d9cfb818beb4353221174a5db16e836d1aebe4ba8cefe64c099d85647852a17f242902ad26951973440e4ff60eab9c2eba1f8085a336b2d7c2c8"' :
                                        'id="xs-injectables-links-module-AppointmentsModule-622b58b30b77d9cfb818beb4353221174a5db16e836d1aebe4ba8cefe64c099d85647852a17f242902ad26951973440e4ff60eab9c2eba1f8085a336b2d7c2c8"' }>
                                        <li class="link">
                                            <a href="injectables/AppointmentsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppointmentsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-2d56df38c8cfe20c05ed55051722670559d16112b61545852f4f5ca647014b2cd9df46842e3164d2e28f68e0553e3c98436857533fa2f6afa6a3b6fe3581171d"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-2d56df38c8cfe20c05ed55051722670559d16112b61545852f4f5ca647014b2cd9df46842e3164d2e28f68e0553e3c98436857533fa2f6afa6a3b6fe3581171d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-2d56df38c8cfe20c05ed55051722670559d16112b61545852f4f5ca647014b2cd9df46842e3164d2e28f68e0553e3c98436857533fa2f6afa6a3b6fe3581171d"' :
                                        'id="xs-injectables-links-module-AuthModule-2d56df38c8cfe20c05ed55051722670559d16112b61545852f4f5ca647014b2cd9df46842e3164d2e28f68e0553e3c98436857533fa2f6afa6a3b6fe3581171d"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ImagesModule.html" data-type="entity-link" >ImagesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ImagesModule-f6d1d3ab40ee0adf79a7aeebda51f4384faafd6f49e2f22e7108b52d1941b8bf74d28fd090bec5269f7c18a56711fdcd3262bab6f2cc4de22f6dce088a2e03bd"' : 'data-bs-target="#xs-controllers-links-module-ImagesModule-f6d1d3ab40ee0adf79a7aeebda51f4384faafd6f49e2f22e7108b52d1941b8bf74d28fd090bec5269f7c18a56711fdcd3262bab6f2cc4de22f6dce088a2e03bd"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ImagesModule-f6d1d3ab40ee0adf79a7aeebda51f4384faafd6f49e2f22e7108b52d1941b8bf74d28fd090bec5269f7c18a56711fdcd3262bab6f2cc4de22f6dce088a2e03bd"' :
                                            'id="xs-controllers-links-module-ImagesModule-f6d1d3ab40ee0adf79a7aeebda51f4384faafd6f49e2f22e7108b52d1941b8bf74d28fd090bec5269f7c18a56711fdcd3262bab6f2cc4de22f6dce088a2e03bd"' }>
                                            <li class="link">
                                                <a href="controllers/ImagesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ImagesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ImagesModule-f6d1d3ab40ee0adf79a7aeebda51f4384faafd6f49e2f22e7108b52d1941b8bf74d28fd090bec5269f7c18a56711fdcd3262bab6f2cc4de22f6dce088a2e03bd"' : 'data-bs-target="#xs-injectables-links-module-ImagesModule-f6d1d3ab40ee0adf79a7aeebda51f4384faafd6f49e2f22e7108b52d1941b8bf74d28fd090bec5269f7c18a56711fdcd3262bab6f2cc4de22f6dce088a2e03bd"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ImagesModule-f6d1d3ab40ee0adf79a7aeebda51f4384faafd6f49e2f22e7108b52d1941b8bf74d28fd090bec5269f7c18a56711fdcd3262bab6f2cc4de22f6dce088a2e03bd"' :
                                        'id="xs-injectables-links-module-ImagesModule-f6d1d3ab40ee0adf79a7aeebda51f4384faafd6f49e2f22e7108b52d1941b8bf74d28fd090bec5269f7c18a56711fdcd3262bab6f2cc4de22f6dce088a2e03bd"' }>
                                        <li class="link">
                                            <a href="injectables/ImagesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ImagesService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UserModule-cbdbe575f1541836e66cfddfc5bcf1104cc09a61eb75c21a2ff66587eee466ab531b1702b5b7ae13a761a39f6841ad5e770eb275e0367daea5c78de137127b41"' : 'data-bs-target="#xs-controllers-links-module-UserModule-cbdbe575f1541836e66cfddfc5bcf1104cc09a61eb75c21a2ff66587eee466ab531b1702b5b7ae13a761a39f6841ad5e770eb275e0367daea5c78de137127b41"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-cbdbe575f1541836e66cfddfc5bcf1104cc09a61eb75c21a2ff66587eee466ab531b1702b5b7ae13a761a39f6841ad5e770eb275e0367daea5c78de137127b41"' :
                                            'id="xs-controllers-links-module-UserModule-cbdbe575f1541836e66cfddfc5bcf1104cc09a61eb75c21a2ff66587eee466ab531b1702b5b7ae13a761a39f6841ad5e770eb275e0367daea5c78de137127b41"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UserModule-cbdbe575f1541836e66cfddfc5bcf1104cc09a61eb75c21a2ff66587eee466ab531b1702b5b7ae13a761a39f6841ad5e770eb275e0367daea5c78de137127b41"' : 'data-bs-target="#xs-injectables-links-module-UserModule-cbdbe575f1541836e66cfddfc5bcf1104cc09a61eb75c21a2ff66587eee466ab531b1702b5b7ae13a761a39f6841ad5e770eb275e0367daea5c78de137127b41"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-cbdbe575f1541836e66cfddfc5bcf1104cc09a61eb75c21a2ff66587eee466ab531b1702b5b7ae13a761a39f6841ad5e770eb275e0367daea5c78de137127b41"' :
                                        'id="xs-injectables-links-module-UserModule-cbdbe575f1541836e66cfddfc5bcf1104cc09a61eb75c21a2ff66587eee466ab531b1702b5b7ae13a761a39f6841ad5e770eb275e0367daea5c78de137127b41"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppointmentsController.html" data-type="entity-link" >AppointmentsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ImagesController.html" data-type="entity-link" >ImagesController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UserController.html" data-type="entity-link" >UserController</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/EntityAlreadyExistsError.html" data-type="entity-link" >EntityAlreadyExistsError</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntityDoesNotExists.html" data-type="entity-link" >EntityDoesNotExists</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValidationError.html" data-type="entity-link" >ValidationError</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppointmentsService.html" data-type="entity-link" >AppointmentsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ImagesService.html" data-type="entity-link" >ImagesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link" >JwtStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PrismaService.html" data-type="entity-link" >PrismaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/EmailType.html" data-type="entity-link" >EmailType</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/user.html" data-type="entity-link" >user</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});