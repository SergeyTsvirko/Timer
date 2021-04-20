public with sharing class NWT_TimerScheduleJob implements Schedulable {
    public void execute(SchedulableContext ctx) {
        try {
            NWT_ActiveTimer.checkActiveTimer();
             //  NWT_CallWebService_RingOver.calloutUserCalls();  
        } catch(Exception e) {
            System.debug(e);
        }

        NWT_TimerScheduleSettings obj = new NWT_TimerScheduleSettings();

        Integer min = (Integer) NWT_SchedulJobTimerSync__c.getInstance().NWT_JobInterval__c;
        obj.runSchedule(System.now().addMinutes(min).minute());
    }
}