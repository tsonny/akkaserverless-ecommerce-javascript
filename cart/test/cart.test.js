import { MockEventSourcedEntity } from './testkit.js';
import { expect } from 'chai';
import cart from '../cart.js';

describe('Test Cart', () => {
    /**
     * The userID
     */
    const entityId = '1';

    /**
     * A new item
     */
    const itemToAdd = { 'user_id': '1', 'product_id': '2', 'name': 'Limited Edition Mat', 'quantity': 3 }

    describe('Commands', () => {
        it('Should add a new item...', () => {

        });

        it('Should remove an item...', () => {

        });

        it('Should get cart details...', () => {

        });
    });

    describe('Events', () => {
        it('Should handle adding a new item...', () => {

        });

        it('Should handle removing an item...', () => {

        });
    });
});