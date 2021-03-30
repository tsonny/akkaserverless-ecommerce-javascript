import as from '@lightbend/akkaserverless-javascript-sdk';
import entity from './orders.js';

const server = new as.AkkaServerless();
server.addComponent(entity);
server.start({bindAddress:'0.0.0.0', bindPort:'8080'});