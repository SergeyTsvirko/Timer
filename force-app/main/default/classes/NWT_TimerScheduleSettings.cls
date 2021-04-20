public with sharing class NWT_TimerScheduleSettings {
    public static void firstSchedulRun() {
        List<NWT_SchedulJobTimerSync__c> cusSetList = [SELECT NWT_NewJobId__c, NWT_OldJobId__c FROM NWT_SchedulJobTimerSync__c];
        if(cusSetList.size() == 0) {
            NWT_SchedulJobTimerSync__c emptyCasSet = new NWT_SchedulJobTimerSync__c(NWT_NewJobId__c = '', NWT_OldJobId__c = '');
            insert emptyCasSet;
        }

        NWT_TimerScheduleSettings obj = new NWT_TimerScheduleSettings();
        obj.runSchedule(System.now().addMinutes(2).minute());
    }

    public void runSchedule(Integer minute) {
        List<NWT_SchedulJobTimerSync__c> cusSetList = [SELECT NWT_NewJobId__c, NWT_OldJobId__c FROM NWT_SchedulJobTimerSync__c];
        if(cusSetList != null && !cusSetList.IsEmpty()) {
            if(cusSetList[0].NWT_OldJobId__c != null) {
                try {
                    System.abortJob(cusSetList[0].NWT_OldJobId__c);
                } catch(Exception e) {
                }
            }
        }

        NWT_TimerScheduleJob reminder = new NWT_TimerScheduleJob();
        String sch = '0 '+ minute + ' * * * ?';

        Id jobID;
        if(!test.isRunningTest()) {
            jobID = System.schedule('Timer sync will occur in ' + minute + ' minutes', sch, reminder);
        }

        if(cusSetList != null && !cusSetList.IsEmpty()) {
            cusSetList[0].NWT_OldJobId__c = cusSetList[0].NWT_NewJobId__c;
        }

        if(cusSetList != null && !cusSetList.IsEmpty()) {
            cusSetList[0].NWT_NewJobId__c = jobID;
        }

        update cusSetList;
    }
}