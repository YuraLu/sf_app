import { LightningElement, wire, track, api } from 'lwc';
import Id from '@salesforce/user/Id';
import getMenuItems from '@salesforce/apex/MenuItemController.getMenuItems';

import getDishes from '@salesforce/apex/DishListController.getDishes';
import { updateRecord, createRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';

import COMMENT_FIELD from '@salesforce/schema/Dish__c.Comment__c';
import QUANTITY_FIELD from '@salesforce/schema/Dish__c.Quantity__c';
import MENU_ITEM_FIELD from '@salesforce/schema/Dish__c.Menu_Item__c';
import DISH_UPCOMING_ORDER_FIELD from '@salesforce/schema/Dish__c.Upcoming_Order__c';


const MENU_COLUMNS = [
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Description', fieldName: 'Description__c', type: 'text' },
    { label: 'Price', fieldName: 'Price__c', type: 'number', typeAttributes: { maximumFractionDigits: 2 }},
    { label: 'Comment', fieldName: COMMENT_FIELD.fieldApiName, type: 'text', editable: true  },
    { label: 'Quantity', fieldName: QUANTITY_FIELD.fieldApiName, type: 'number', typeAttributes: { maximumFractionDigits: 0 }, editable: true },
    { label: 'Total', fieldName: 'Total__c', type: 'number', typeAttributes: { maximumFractionDigits: 2 } }
];


export default class Menu extends LightningElement {
    @track columns = MENU_COLUMNS;
    @track error;
    @track draftValues = [];

    @api recordId;
    userId = Id;

    @wire(getMenuItems) menuItems;

    @wire(getDishes) dishItems;

    @api dishes = [];

/*
    @wire(CurrentPageReference) pageRef; // Required by pubsub
    connectedCallback() {
        // subscribe to bearListUpdate event
        registerListener('EventName', this.MethodName, this);
    }
    disconnectedCallback() {
        // unsubscribe from bearListUpdate event
        unregisterAllListeners(this);
    }
    MethodName(data) {
        //processing
        this.recordId = data
    }
*/
    handleChange(event){
        console.log('handleChange block');
        const recordInputs =  event.detail.draftValues.slice().map(draft => {

            const obj = {};
            obj[MENU_ITEM_FIELD.fieldApiName] = draft.Id;
            obj[COMMENT_FIELD.fieldApiName] = draft.Comment__c;
            obj[QUANTITY_FIELD.fieldApiName] = draft.Quantity__c;
            const fields = Object.assign({}, obj);     
            
            console.log('fields with obj in handleChange - ' , fields);
            return { fields };
        });
    }

    handleSave(event) {
        console.log('handleSave block');
        const recordInputs =  event.detail.draftValues.slice().map(draft => {

        const obj = {};
        obj[MENU_ITEM_FIELD.fieldApiName] = draft.Id;
        obj[COMMENT_FIELD.fieldApiName] = draft.Comment__c;
        obj[QUANTITY_FIELD.fieldApiName] = draft.Quantity__c;
        obj[DISH_UPCOMING_ORDER_FIELD.fieldApiName] = this.recordId;

        const fields = Object.assign({}, obj);     
        return { fields };
        });

        let promises = new Set();
        for(let i = 0; i < recordInputs.length; i++){
            let record = recordInputs[i];
            record.apiName = 'Dish__c';
            console.log('create', record);
            promises.add(createRecord(record));
        }

        Promise.all(promises).then(records => {
            console.log('inside promise');
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Dish updated',
                    variant: 'success'
                })
            );
            this.draftValues = [];
            this.dishes = records;
            console.log(this.dishes);
            return refreshApex(this.menuItems);
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