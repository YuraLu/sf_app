public class UpcomingOrderController{

    @AuraEnabled(cacheable=true)
    public static Upcoming_Order__c getUpcomingOrder(Id orderId) {
        return [SELECT Id, Name, Total_order_cost__c FROM Upcoming_Order__c WHERE Id = :orderId];
    }

    @AuraEnabled(cacheable=true)
    public static List<Upcoming_Order__c> getClosedOrders() {
         return [SELECT Id, Name, Total_order_cost__c FROM Upcoming_Order__c WHERE Status__c= 'Closed'];
    }
}
