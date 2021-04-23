public class NWT_ActiveTimer {
    public static void checkActiveTimer () {
        List<NWT_Case_Timer__c> caseTimerList = [SELECT LastModifiedDate, IsActiveTimer__c
                                                 FROM NWT_Case_Timer__c];
        
        List<NWT_Tache_Timer__c> tacheTimerList = [SELECT LastModifiedDate, IsActiveTimer__c
                                                   FROM NWT_Tache_Timer__c];

        List<NWT_Atelier_Timer__c> atelierTimerList = [SELECT LastModifiedDate, IsActiveTimer__c
                                                     FROM NWT_Atelier_Timer__c];

        List<NWT_Case_Timer__c> caseTimerListToUpdate = new List<NWT_Case_Timer__c>();
        List<NWT_Tache_Timer__c> tacheTimerListToUpdate = new List<NWT_Tache_Timer__c>();
        List<NWT_Atelier_Timer__c> atelierTimerListToUpdate = new List<NWT_Atelier_Timer__c>();

        Boolean caseUpdate = false;
        Boolean tacheUpdate = false;
        Boolean atelierUpdate = false;

        Long currentTime = System.Now().getTime();

        // change the field IsActiveTimer__c on false if the last change date is more than 60 seconds
        for (NWT_Case_Timer__c cas : caseTimerList) {
            Long dtLong = cas.LastModifiedDate.getTime();
            Long milliseconds = currentTime - dtLong;
            Long seconds = milliseconds / 1000;
           
            if (seconds > 60 && cas.IsActiveTimer__c == true) {
                caseUpdate = true;
                cas.IsActiveTimer__c = false;
                caseTimerListToUpdate.add(cas);
            }
        }
        
        for (NWT_Tache_Timer__c tach : tacheTimerList) {
            Long dtLong = tach.LastModifiedDate.getTime();
            Long milliseconds = currentTime - dtLong;
            Long seconds = milliseconds / 1000;
           
            if (seconds > 60 && tach.IsActiveTimer__c == true) {
                tacheUpdate = true;
                tach.IsActiveTimer__c = false;
                tacheTimerListToUpdate.add(tach);
            }
        }

        for (NWT_Atelier_Timer__c atel : atelierTimerList) {
            Long dtLong = atel.LastModifiedDate.getTime();
            Long milliseconds = currentTime - dtLong;
            Long seconds = milliseconds / 1000;
           
            if (seconds > 60 && atel.IsActiveTimer__c == true) {
                atelierUpdate = true;
                atel.IsActiveTimer__c = false;
                atelierTimerListToUpdate.add(atel);
            }
        }

        if (caseUpdate) {
            update caseTimerListToUpdate;  
        }
        if (tacheUpdate) {
            update tacheTimerListToUpdate;  
        }
        if (atelierUpdate) {
            update atelierTimerListToUpdate;  
        }
    }
}