import { MockEventSourcedEntity } from './testkit.js';
import { expect } from 'chai';
import users from '../users.js';

describe('Test Users', () => {
    const entityId = '1';
    const newUser = { 'id': entityId, 'name': 'retgits', 'emailAddress': 'retgits@example.com' }

    describe('Commands', () => {
        it('Should add a new user...', () => {
            const entity = new MockEventSourcedEntity(users, entityId);
            const result = entity.handleCommand('AddUser', newUser);

            // The user service returns the same message that was passed in
            expect(result).to.deep.equal(newUser);

            // There shouldn't be any errors
            expect(entity.error).to.be.undefined;

            // The new state of the entity should match the new user
            expect(entity.state).to.deep.equal(newUser);

            // There should only be one event for the entity of the type 'UserCreated' and that should equal the new user
            expect(entity.events.length).to.be.equal(1)
            expect(entity.events[0].type).to.be.equal('UserCreated')
            expect(entity.events[0].user).to.deep.include(newUser);
        });

        it('Should get user details...', () => {
            // Load the service with a new user
            const entity = new MockEventSourcedEntity(users, entityId);
            let result = entity.handleCommand('AddUser', newUser);
            result = entity.handleCommand('GetUserDetails', entityId)

            // The user details should match the user that was created
            expect(result).to.deep.equal(newUser);
        });

        it('Should add an order to a user...', () => {
            // Load the service with a new user
            const entity = new MockEventSourcedEntity(users, entityId);
            let result = entity.handleCommand('AddUser', newUser);
            result = entity.handleCommand('UpdateUserOrders', { 'id': entityId, 'orderID': '1234' })

            // There shouldn't be any errors
            expect(entity.error).to.be.undefined;

            // There should be two events for the entity
            expect(entity.events.length).to.be.equal(2)
            expect(entity.events[0].type).to.be.equal('UserCreated')
            expect(entity.events[1].type).to.be.equal('OrderAdded')
        });
    });

    describe('Events', () => {
        it('Should handle user created events...', () => {
            // Load the userservice with a user
            const entity = new MockEventSourcedEntity(users, entityId);
            const result = entity.handleEvent({ type: 'UserCreated', user: newUser });

            // There shouldn't be any errors
            expect(entity.error).to.be.undefined;
        });

        it('Should handle order added events...', () => {
            // Load the service with a new user
            const entity = new MockEventSourcedEntity(users, entityId);
            let result = entity.handleCommand('AddUser', newUser);
            result = entity.handleEvent({ type: 'OrderAdded', orderDetails: { 'id': entityId, 'orderID': '1234' } })

            // There shouldn't be any errors
            expect(entity.error).to.be.undefined;

            // There should be two events for the entity
            expect(entity.events.length).to.be.equal(2)
            expect(entity.events[0].type).to.be.equal('UserCreated')
            expect(entity.events[1].type).to.be.equal('OrderAdded')
        });
    });
});