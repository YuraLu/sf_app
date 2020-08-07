import { LightningElement, wire, track, api } from 'lwc';
import getUpcomingOrder from '@salesforce/apex/UpcomingOrderController.getUpcomingOrder';
import getUpcomingOrders from '@salesforce/apex/UpcomingOrderController.getUpcomingOrders';
import getRelatedList from '@salesforce/apex/DishListController.getRelatedList';

import { updateRecord, createRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import NAME_FIELD from '@salesforce/schema/Upcoming_Order__c.Name';
import STATUS_FIELD from '@salesforce/schema/Upcoming_Order__c.Status__c';
import UPCOMING_ORDER_OBJECT from '@salesforce/schema/Upcoming_Order__c';

const UPCOMING_ORDER_COLUMNS = [
    { label: 'Order name', fieldName: 'Name', type: 'text' },
    { label: 'Total order sum', fieldName: 'Total_order_cost__c', type: 'number', typeAttributes: { maximumFractionDigits: 2 } }
];


const DISH_COLUMNS = [
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Description', fieldName: 'Description__c', type: 'text' },
    { label: 'Price', fieldName: 'Price__c', type: 'number', typeAttributes: { maximumFractionDigits: 2 } },
    { label: 'Comment', fieldName: 'Comment__c', type: 'text' },
    { label: 'Quantity', fieldName: 'Quantity__c', type: 'number', typeAttributes: { maximumFractionDigits: 0 } },
    { label: 'Total', fieldName: 'Total__c', type: 'number', typeAttributes: { maximumFractionDigits: 2 } }
];


export default class UpcomingOrder extends LightningElement {
    @track columns = UPCOMING_ORDER_COLUMNS;
    @track dish_columns = DISH_COLUMNS;
    
    @track draftValues = [];
    @track dish_draftValues = [];

    //@track upcomingOrder;

    @api recordId;

    @api dishlist;

    @wire(getUpcomingOrders)  upcomingOrder;
    //@wire(getUpcomingOrder, {recordId: Id})  upcomingOrder;
  //  @wire(getRelatedList, {recordId: Id})  relatedDishList;

   isShowed = false;

    connectedCallback() {
        console.log('init block');
        console.log(this.recordId);

    if(!this.recordId){

        console.log('inside if block');

        const fields = {};
        fields[NAME_FIELD.fieldApiName] = 'Order from '+ new Date(); 
        fields[STATUS_FIELD.fieldApiName] = 'New';

        const recordInput = { apiName: UPCOMING_ORDER_OBJECT.objectApiName, fields };
        console.log('create recordInput = ' ,recordInput);

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
                console.log('record = ', record);

              //  this.upcomingOrder = record;
              //  console.log('this.upcomingOrder = record = ', this.upcomingOrder );

                refreshApex(this.recordId);
            }).catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });   
    }
    
    else{

        console.log('in else block');

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

            refreshApex(record);
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });  
           
    } 

    
    }


    renderedCallback() {
    //  the required business logic to be executed when component is rendered
    }

   makeOrder(event) {

   }

   toggleShowRelatedList(event){
        this.isShowed = !this.isShowed;
   }

}