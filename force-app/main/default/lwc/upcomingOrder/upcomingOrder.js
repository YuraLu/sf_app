import { LightningElement, wire, track, api } from 'lwc';
import getUpcomingOrder from '@salesforce/apex/UpcomingOrderController.getUpcomingOrder';
import getRelatedList from '@salesforce/apex/DishListController.getRelatedList';

import { updateRecord, createRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';

import NAME_FIELD from '@salesforce/schema/Upcoming_Order__c.Name';
import STATUS_FIELD from '@salesforce/schema/Upcoming_Order__c.Status__c';
import UPCOMING_ORDER_OBJECT from '@salesforce/schema/Upcoming_Order__c';

const UPCOMING_ORDER_COLUMNS = [
    { label: 'Order name', fieldName: 'Name', type: 'text' },
    { label: 'Total order sum', fieldName: 'Total_order_cost__c', type: 'number', typeAttributes: { maximumFractionDigits: 2 } }
];


const DISH_COLUMNS = [
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Price', fieldName: 'Price__c', type: 'number', typeAttributes: { maximumFractionDigits: 2 } },
    { label: 'Comment', fieldName: 'Comment__c', type: 'text' },
    { label: 'Quantity', fieldName: 'Quantity__c', type: 'number', typeAttributes: { maximumFractionDigits: 0 } },
    { label: 'Total', fieldName: 'Total__c', type: 'number', typeAttributes: { maximumFractionDigits: 2 } }
];


export default class UpcomingOrder extends LightningElement {
    @track columns = UPCOMING_ORDER_COLUMNS;
    @track dish_columns = DISH_COLUMNS;
    @track error;
    isShowed = false;

    @track recordId;
    @api recordOrder;
    @api upcomingOrderObject = UPCOMING_ORDER_OBJECT;
    @wire(getUpcomingOrder, { recordId: '$recordId' }) upcomingOrder;

    @track dish_draftValues = [];
    @api dishlist;

    @wire(getRelatedList, {recordId: Id})  relatedDishList;
    
    //@wire(CurrentPageReference) pageRef;

  
    connectedCallback() {
        if(!this.recordId){

            const fields = {};
            fields[NAME_FIELD.fieldApiName] = 'Order from ' + new Date(); 
            fields[STATUS_FIELD.fieldApiName] = 'New';

            const recordInput = { apiName: UPCOMING_ORDER_OBJECT.objectApiName, fields };
            console.log('create recordInput = ', recordInput);

            createRecord(recordInput)
                .then(record => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Upcoming Order created',
                            variant: 'success'
                        })
                    );

                    this.recordId = record.id;
                    this.recordOrder = record;
                    console.log('returned record = ', record);

                    //fireEvent(this.pageRef, 'EventName', this.recordId);

                    return refreshApex(this.recordId);
                }).catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error updating record',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                    this.error = error;
            });   
        }
    }


    renderedCallback() {
        // update order when dishes changes
        /*
                const fields = {};
                fields[NAME_FIELD.fieldApiName] = 'Order from '+ new Date(); 
                fields[STATUS_FIELD.fieldApiName] = 'New';

                const recordInput = {id:this.recordId, apiName: UPCOMING_ORDER_OBJECT.objectApiName, fields };
                console.log('update recordInput = ', recordInput);

                updateRecord(recordInput).then(record => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Upcoming Order updated',
                            variant: 'success'
                        })
                    );
                    console.log('after update recordId', this.recordId);
                    console.log('after update record', record);

                    return refreshApex(record);
                }).catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error updating record',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                    this.error = error;
                });  
            */
    }

   makeOrder(event) {
        // change order status to Closed

        console.log('in makeOrder block');
        console.log('in makeOrder block order', this.recordOrder);

        const fields = {};
        fields[STATUS_FIELD.fieldApiName]='Closed';
        recordInput = { apiName: UPCOMING_ORDER_OBJECT.objectApiName, fields };


        console.log('for update recordInput = ', recordInput);

        updateRecord(recordInput).then(record => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Upcoming Order updated',
                    variant: 'success'
                })
            );
            console.log('after update recordId', record.id);
            console.log('after update record', record);

            this.recordId = null;

            return refreshApex(this.recordId);
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
            this.error = error;
        });  
   }

   toggleShowRelatedList(event){
        this.isShowed = !this.isShowed;
   }

}