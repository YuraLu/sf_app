public class OrderControllerVF {

    public PageReference showOrders() {
       return null;
   }


   public List<Upcoming_Order__c> getOrders() {
       
       List<Upcoming_Order__c> orderlist = Database.query(
           'SELECT Id, Name, Total_order_cost__c FROM Upcoming_Order__c WHERE Status__c= \'Closed\' ');
   return orderlist;
   }
}
