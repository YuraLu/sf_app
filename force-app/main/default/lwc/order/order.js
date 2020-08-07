import { LightningElement, wire, track, api } from 'lwc';
import getClosedOrders from '@salesforce/apex/UpcomingOrderController.getClosedOrders';

const COLUMNS = [
    { label: 'Order', fieldName: 'Name', type: 'text' },
    { label: 'Total cost', fieldName: 'Total_order_cost__c', type: 'number', typeAttributes: { maximumFractionDigits: 2 } }
];

export default class Order extends LightningElement {
    @track columns = COLUMNS;

    @wire(getClosedOrders) orders;
    totalAmount = 0;
    isShowed = false;

    toggleShowOrderList(event) {
        this.isShowed = !this.isShowed;
    }

    getTotalAmount= () => {
         for (let index = 0; index < orders.length; index++) {
            this.totalAmount += orders[i].Total_order_cost__c;
        }
    }
   
    
}
