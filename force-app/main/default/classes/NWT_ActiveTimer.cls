public class NWT_ActiveTimer {
    public static void checkActiveTimer () {
         List<NWT_Case_Timer__c> caseTimerList = [SELECT LastModifiedDate, IsActiveTimer__c
                                                 FROM NWT_Case_Timer__c];
        
        List<NWT_Case_Timer__c> caseTimerListToUpdate = new List<NWT_Case_Timer__c>();
        Boolean checkUpdate = false;
        
        for (NWT_Case_Timer__c cas : caseTimerList) {
            System.debug(cas.LastModifiedDate);
            System.debug(System.Now());
            
            Long dt1Long = cas.LastModifiedDate.getTime();
            Long dt2Long = System.Now().getTime();
            Long milliseconds = dt2Long - dt1Long;
            Long seconds = milliseconds / 1000;
           
            if (seconds > 60 && cas.IsActiveTimer__c == true) {
                checkUpdate = true;
                cas.IsActiveTimer__c = false;
                caseTimerListToUpdate.add(cas);
            }
        }
        
        if (checkUpdate) {
            update caseTimerListToUpdate;  
        }

    }
}