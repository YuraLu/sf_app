public with sharing class MenuItemController {

    @AuraEnabled(cacheable=true)
    public static List<Menu_Item__c> getMenuItems() {
        return [SELECT Id, Name, Description__c, Price__c FROM Menu_Item__c ORDER BY Name ASC LIMIT 25];
    }
}
 