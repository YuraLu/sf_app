trigger DishTrigger on Dish__c (before insert, before update) {

    if (Trigger.isInsert) {
        if (Trigger.isBefore) {
            for (Dish__c item: Trigger.new){
                if(item.Quantity__c != 0){
                    item.Total__c = item.Total_amount_calculated__c;
                    }
            }  
        }    
    }else {
        for (Dish__c item: Trigger.new){
            if(item.Quantity__c != Trigger.oldMap.get(item.Id).Quantity__c || item.Quantity__c != 0){
                item.Total__c = item.Total_amount_calculated__c;
            }
        }  
    }  
 }