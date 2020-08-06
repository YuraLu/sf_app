trigger DishTrigger on Dish__c (before insert, before update) {

    Upcoming_Order__c upOrder = new Upcoming_Order__c();
    upOrder.Name__c = 'Test';
    insert upOrder;

    if (Trigger.isInsert) {
        if (Trigger.isBefore) {
            for (Dish__c item: Trigger.new){
                if(item.Quantity__c != 0){
                    item.Total__c = item.Total_amount_calculated__c;
                    item.Upcoming_Order__c = upOrder.Id;
                    upOrder.Dishes__r.add(item);
                    }
            }  
        }    
    }else {
        for (Dish__c item: Trigger.new){
            if(item.Quantity__c != Trigger.oldMap.get(item.Id).Quantity__c || item.Quantity__c != 0){
                item.Total__c = item.Total_amount_calculated__c;
                upOrder.Dishes__r.add(item);
            }
        }  
    }  
 }