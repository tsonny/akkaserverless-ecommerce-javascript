import { MockEventSourcedEntity } from './testkit.js';
import { expect } from 'chai';
import cart from '../cart.js';

describe('Test Warehouse', () => {
    const entityId = '1';
    const newItem = { 'userId': entityId, 'productId': 'turkey', 'name': 'delicious turkey', 'quantity': 2 }
    const removeItem = { 'userId': entityId, 'productId': 'turkey' }

    describe('Commands', () => {
        it('Should add an item...', () => {
            const entity = new MockEventSourcedEntity(cart, entityId);
            const result = entity.handleCommand('AddItem', newItem);

            // The cart returns an empty message
            expect(result).to.be.empty;

            // There shouldn't be any errors
            expect(entity.error).to.be.undefined;

            // The new state of the entity should match the added item
            expect(entity.state.items[0].name).to.equal(newItem.name);

            // There should be one event
            expect(entity.events.length).to.be.equal(1)
            expect(entity.events[0].constructor.name).to.be.equal('ItemAdded')
        })

        it('Should remove an item...', () => {
            const entity = new MockEventSourcedEntity(cart, entityId);
            let result = entity.handleCommand('AddItem', newItem);
            result = entity.handleCommand('RemoveItem', removeItem);

            // The cart returns an empty message
            expect(result).to.be.empty;

            // There shouldn't be any errors
            expect(entity.error).to.be.undefined;

            // There should be two event
            expect(entity.events.length).to.be.equal(2)
            expect(entity.events[0].constructor.name).to.be.equal('ItemAdded')
            expect(entity.events[1].constructor.name).to.be.equal('ItemRemoved')
        })

        it('Should get cart details...', () => {
            const entity = new MockEventSourcedEntity(cart, entityId);
            let result = entity.handleCommand('AddItem', newItem);
            result = entity.handleCommand('GetCart', { userId: entityId });

            // The cart returns an empty message
            expect(result).to.not.be.empty;

            // There shouldn't be any errors
            expect(entity.error).to.be.undefined;
        })
    })

    describe('Events', () => {
        it('Should handle an item added...', () => {
            const entity = new MockEventSourcedEntity(cart, entityId);

            // Mock a new ItemAdded
            function ItemAdded(addItem) {
                this.item = {
                    productId: addItem.productId,
                    name: addItem.name,
                    quantity: addItem.quantity
                }
            }
            const result = entity.handleEvent(new ItemAdded(newItem))

            // There shouldn't be any errors
            expect(entity.error).to.be.undefined;

            // The new state of the entity should match the new product
            expect(entity.state.items[0].name).to.equal(newItem.name);
        })

        it('Should handle an item removed...', () => {
            const entity = new MockEventSourcedEntity(cart, entityId);

            // Mock a new ItemAdded
            function ItemAdded(addItem) {
                this.item = {
                    productId: addItem.productId,
                    name: addItem.name,
                    quantity: addItem.quantity
                }
            }
            let result = entity.handleEvent(new ItemAdded(newItem))

            // There shouldn't be any errors
            expect(entity.error).to.be.undefined;

            // Mock a new ItemRemoved
            function ItemRemoved(addItem) {
                this.productId = addItem.productId
            }
            result = entity.handleEvent(new ItemRemoved(newItem))

            expect(entity.events.length).to.be.equal(2)
            expect(entity.events[0].constructor.name).to.be.equal('ItemAdded')
            expect(entity.events[1].constructor.name).to.be.equal('ItemRemoved')
        })
    })
})