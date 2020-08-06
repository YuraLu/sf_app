public class UpcomingOrderController{

    public PageReference makeAnOrder() {
        return null;
    }
    
     public PageReference orderDetails() {
        return null;
    }


    public List<Upcoming_Order__c> getUpcomingOrders() {
        
        List<Upcoming_Order__c> orderlist = Database.query(
            'SELECT Id, Name__c, Total_order_cost__c FROM Upcoming_Order__c');
    return orderlist ;
    }
}