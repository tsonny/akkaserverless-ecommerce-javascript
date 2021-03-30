import { MockEventSourcedEntity } from './testkit.js';
import { expect } from 'chai';
import orders from '../orders.js';

describe('Test Orders', () => {
    const entityId = '1';
    const newOrder1 = { 'userID': entityId, 'orderID': '4557', 'items':[ { 'productID': 'turkey', 'quantity': 12, 'price': 10 } ] } 
    const newOrder2 = { 'userID': entityId, 'orderID': '1337', 'items':[ { 'productID': 'red pants', 'quantity': 300, 'price': 99 } ] } 

    describe('Commands', () => {
        it('Should add a new order...', () => {
            const entity = new MockEventSourcedEntity(orders, entityId);
            const result = entity.handleCommand('AddOrder', newOrder1);

            // The orders service returns the same message that was passed in
            expect(result).to.deep.equal(newOrder1);

            // There shouldn't be any errors
            expect(entity.error).to.be.undefined;

            // The new state of the entity should match the new user
            expect(entity.state.orders[0]).to.deep.equal(newOrder1);

            // There should only be one event for the entity of the type 'OrderAdded' and that should equal the new order
            expect(entity.events.length).to.be.equal(1)
            expect(entity.events[0].type).to.be.equal('OrderAdded')
        });

        it('Should get order details...', () => {
            // Load the service with a new user
            const entity = new MockEventSourcedEntity(orders, entityId);
            let result = entity.handleCommand('AddOrder', newOrder1);
            result = entity.handleCommand('GetOrderDetails', { 'userID': entityId, 'orderID': '4557' })

            // The orders details should match the user that was created
            expect(result).to.deep.equal(newOrder1);
        });

        it('Should get all orders...', () => {
            // Load the service with a new user
            const entity = new MockEventSourcedEntity(orders, entityId);
            let result = entity.handleCommand('AddOrder', newOrder1);
            result = entity.handleCommand('AddOrder', newOrder2);
            result = entity.handleCommand('GetAllOrders', entityId)

            // There shouldn't be any errors
            expect(entity.error).to.be.undefined;

            // There should be two orders for the entity
            expect(entity.events.length).to.be.equal(2)
            expect(entity.events[0].type).to.be.equal('OrderAdded')
            expect(entity.events[1].type).to.be.equal('OrderAdded')
            expect(entity.state.orders[0]).to.deep.equal(newOrder1);
            expect(entity.state.orders[1]).to.deep.equal(newOrder2);
            expect(result.orders[0]).to.deep.equal(newOrder1);
            expect(result.orders[1]).to.deep.equal(newOrder2);
        });
    });

    describe('Events', () => {
        it('Should handle order added events...', () => {
            // Load the service with a new user
            const entity = new MockEventSourcedEntity(orders, entityId);
            const result = entity.handleEvent({ type: 'OrderAdded', order: newOrder1 })

            // There shouldn't be any errors
            expect(entity.error).to.be.undefined;

            // There should be one event for the entity
            expect(entity.events.length).to.be.equal(1)
            expect(entity.events[0].type).to.be.equal('OrderAdded')
        });
    });
});