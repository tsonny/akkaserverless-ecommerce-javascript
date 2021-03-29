import { MockEventSourcedEntity } from './testkit.js';
import { expect } from 'chai';
import warehouse from '../warehouse.js';

describe('Test Warehouse', () => {
    const entityId = '5c61f497e5fdadefe84ff9b9';
    const newProduct = { 'id': entityId, 'name': 'Yoga Mat', 'description': 'Limited Edition Mat', 'imageURL': '/static/images/yogamat_square.jpg', 'price': 62.5, 'stock': 5, 'tags': [ 'mat' ] };
    const newStock = 10;

    describe('Commands', () => {
        it('Should accept a new product...', () => {
            const entity = new MockEventSourcedEntity(warehouse, entityId);
            const result = entity.handleCommand('ReceiveProduct', newProduct );

            // The warehouse returns the same message that was passed in
            expect(result).to.deep.equal(newProduct);

            // There shouldn't be any errors
            expect(entity.error).to.be.undefined;

            // The new state of the entity should match the new product
            expect(entity.state).to.deep.equal(newProduct);

            // There should only be one event for the entity of the type 'ProductReceived' and that should equal the new product
            expect(entity.events.length).to.be.equal(1)
            expect(entity.events[0].type).to.be.equal('ProductReceived')
            expect(entity.events[0].product).to.deep.include(newProduct);
        });

        it('Should update stock...', () => {
            // Load the warehouse with a product
            const entity = new MockEventSourcedEntity(warehouse, entityId);
            let result = entity.handleCommand('ReceiveProduct', newProduct );

            // Update the stock
            result = entity.handleCommand('UpdateStock', { 'id': entityId, 'stock': newStock })

            // The warehouse returns the updated product data so it should match newProduct with the new stock
            newProduct.stock = newProduct.stock + newStock
            expect(result).to.deep.equal(newProduct);

            // There shouldn't be any errors
            expect(entity.error).to.be.undefined;

            // There should be two events for the entity
            expect(entity.events.length).to.be.equal(2)
            expect(entity.events[0].type).to.be.equal('ProductReceived')
            expect(entity.events[1].type).to.be.equal('StockChanged')
        });

        it('Should get product details...', () => {
            // Load the warehouse with a product
            const entity = new MockEventSourcedEntity(warehouse, entityId);
            let result = entity.handleCommand('ReceiveProduct', newProduct );
            result = entity.handleCommand('GetProductDetails', entityId );
            
            // The product details should match the stuff going in
            expect(result).to.deep.equal(newProduct);
        });
    });

    describe('Events', () => {
        it('Should handle incoming products...', () => {
            // Load the warehouse with a product
            const entity = new MockEventSourcedEntity(warehouse, entityId);
            const result = entity.handleEvent({ type: 'ProductReceived', product: newProduct })

            // There shouldn't be any errors
            expect(entity.error).to.be.undefined;

            // The new state of the entity should match the new product
            expect(entity.state).to.deep.equal(newProduct);

            // There should only be one event for the entity of the type 'ProductReceived' and that should equal the new product
            expect(entity.events.length).to.be.equal(1)
            expect(entity.events[0].type).to.be.equal('ProductReceived')
            expect(entity.events[0].product).to.deep.include(newProduct);
        });

        it('Should update stock...', () => {
            // Load the warehouse with a product
            const entity = new MockEventSourcedEntity(warehouse, entityId);
            let result = entity.handleCommand('ReceiveProduct', newProduct );

            // Update the stock
            result = entity.handleEvent({ type: 'StockChanged', product: newProduct })
        });
    });
});