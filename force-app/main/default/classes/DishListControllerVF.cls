public class DishListControllerVF {
    private String sortOrder = 'Name__c';
    private String pageLimit = '';
    
    public void sortByName() {
      this.sortOrder = 'Name__c';
  }
        
    public void sortByDescription() {
      this.sortOrder = 'Description__c';
  }   
    
    public void by10pages() {
      this.pageLimit = 'LIMIT 10';
  }
    
    public List<Dish__c> getDishes() {
        List<Dish__c> dishlist = Database.query(
            'SELECT Id, Name__c, Description__c, Price__c, Comment__c, Quantity__c, Menu_Item__c, ' +
            'Total_amount_calculated__c, Total__c, Upcoming_Order__c FROM Dish__c ORDER BY '+ sortOrder + ' ASC ' + pageLimit);
    return dishlist;
    }
}