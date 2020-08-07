public with sharing class DishListController {
   
    @AuraEnabled(cacheable=true)
    public static List<Dish__c> getDishes() {
        return [SELECT Id, Name__c, Description__c, Price__c, Comment__c, Quantity__c, Menu_Item__c, 
                        Total_amount_calculated__c, Total__c, Upcoming_Order__c FROM Dish__c ORDER BY Name__c  ASC];
    }


        
    @AuraEnabled(cacheable=true)
    public static List<Dish__c> getRelatedList(Id orderId) {
        return [SELECT Id, Name__c, Description__c, Price__c, Comment__c, Quantity__c, Menu_Item__c, 
        Total_amount_calculated__c, Total__c, Upcoming_Order__c FROM Dish__c WHERE Upcoming_Order__c = :orderId];
    }
}