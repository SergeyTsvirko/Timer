public class NWT_CaseTimer {
    public static void checkActiveSchedule() {
        // if custom setting record is absent we create record with empty fields
        if(NWT_SchedulJobTimerSync__c.getInstance().NWT_NewJobId__c == null && NWT_SchedulJobTimerSync__c.getInstance().NWT_OldJobId__c == null) {
            NWT_SchedulJobTimerSync__c emptyCasSet = new NWT_SchedulJobTimerSync__c(NWT_NewJobId__c = '', NWT_OldJobId__c = '');
            insert emptyCasSet;  
            
            NWT_TimerScheduleSettings.firstSchedulRun();
        } 
    } 
    
    @AuraEnabled
    public static Boolean EquipeParam(){
        Boolean result;
        Id user = UserInfo.getUserId();
        try{    
            User Equipe = [SELECT Equipe_Nowteam__c from User where id=:user];
            NWT_CaseTimer_settings__c Equip_Param = [SELECT IsActive_Ticket__c from NWT_CaseTimer_settings__c where Nom_de_equipe__c=:Equipe.Equipe_Nowteam__c];
            result = Equip_Param.IsActive_Ticket__c;
        }
        catch(Exception ex){
            ex.getMessage(); 
        }   
        return result;
    }
    
    @AuraEnabled
    public static Boolean Cloturer(Id idObject){
        Boolean value;
        try{
            Case ticket = [SELECT IsClosed FROM Case WHERE Id =: idObject];
            value = ticket.IsClosed;
        } catch(Exception ex){
            ex.getMessage(); 
        }
        return value;
    }
    
    @AuraEnabled
    public static string ticketverouiller(id idObject){
        checkActiveSchedule();
        
        Datetime tempsFin  = Datetime.now();
        String dates = tempsFin.format('dd/MM/yyyy');
        String verouillerticket;
        String username = UserInfo.getUserId();
        
        List<NWT_Case_Timer__c> ticketverouiller = [SELECT IsActiveTimer__c, User__r.Name, TimeSession_Sec__c
                                                    FROM NWT_Case_Timer__c
                                                    WHERE Ticket__c=:idObject
                                                    AND CreatedDate__c=:dates 
                                                    AND User__c !=: username];
        
        for (NWT_Case_Timer__c a : ticketverouiller) {
            if (a != null && a.IsActiveTimer__c == true) {
                verouillerticket = a.IsActiveTimer__c + ':' + a.User__r.Name + ':' + a.TimeSession_Sec__c;
                break;
            }
        }
        return verouillerticket;
    }
    
    @AuraEnabled
    public static String deverouillerticket(Id idObject){
        Datetime tempsFin = Datetime.now();
        String dates = tempsFin.format('dd/MM/yyyy');
        String timer;
        string username = UserInfo.getUserId();
        List<NWT_Case_Timer__c> ticketverouiller = [SELECT Name, IsActiveTimer__c
                                                    FROM NWT_Case_Timer__c
                                                    WHERE Ticket__c=:idObject
                                                        AND CreatedDate__c =: dates
                                                        AND User__c !=: username];
        
        for (NWT_Case_Timer__c a : ticketverouiller) {
            if (a != null && a.IsActiveTimer__c == true) {
                timer = a.Name;
                a.IsActiveTimer__c = false;
                update a;
                break;
            }
        }
        return timer;
    }
    
    @AuraEnabled
    public static String getSuiviTime(Id idObject){
        Datetime tempsFin = Datetime.now();
        String dates = tempsFin.format('dd/MM/yyyy');
        String stp;
        String username = UserInfo.getUserId();
        
        List<NWT_Case_Timer__c> temps = [SELECT Name
                                         FROM NWT_Case_Timer__c
                                         WHERE Ticket__c =: idObject
                                            AND User__c =:username
                                            AND CreatedDate__c=:dates];
        
        for (NWT_Case_Timer__c t : temps) {
            if (temps != null) {
                stp = t.Name;
                break;
            }
        }
        return stp;
    }
    
    @AuraEnabled
    public static void saveTime (String stopwatch, Id idObject){
        Datetime tempsFin = Datetime.now();
        String dates = tempsFin.format('dd/MM/yyyy');
        List<Integer> integerList = NWT_CaseTimer.toInteger(stopwatch);
        
        Time myTime;
        if (integerList != null && !integerList.IsEmpty()) {
            myTime = Time.newInstance(integerList[0], integerList[1], integerList[2],0);   
        }
        
        Integer timeSec = (myTime.hour()*3600 )+ (myTime.minute()*60) + (myTime.second());
        DateTime tempsDebut = tempsFin.addSeconds(-timeSec);
        Id user = UserInfo.getUserId();
        System.debug('saveTime');
        try {
            NWT_Case_Timer__c stp = new NWT_Case_Timer__c();
            stp.Ticket__c=idObject;
            stp.User__c = user;
            stp.CreatedDate__c = dates;
            stp.CreatedDateHour__c = tempsDebut;
            stp.LastModifiedDate__c = tempsFin;
            stp.TimeSession_Sec__c = 0;
            stp.TimeTotal_Sec__c = 0;
            stp.IsActiveTimer__c = true;
            insert stp;
            System.debug(stp);
        } catch(Exception ex){
            ex.getMessage();
        }
        
        Case ticket = [SELECT Id, Utilisateur_Courant__c FROM Case WHERE Id =: idObject];
        if (ticket != null) {
            ticket.Utilisateur_Courant__c = null;
            update ticket;
        }
    }
    
    @AuraEnabled
    public static void updatetimerencours(Boolean timer, String idStp){
        try{
            System.debug('updateTimerEncours');
            NWT_Case_Timer__c timerencours = [SELECT IsActiveTimer__c FROM NWT_Case_Timer__c WHERE Name=:idStp];
            timerencours.IsActiveTimer__c = timer;
            update timerencours;
            System.debug(timerencours);
        } catch(Exception ex){
            ex.getMessage();
        }
    }
    
    @AuraEnabled
    public static void ResetTempsdeTravail (Boolean timer, string idStp){
        try{
            NWT_Case_Timer__c tempsdetravail = [SELECT IsActiveTimer__c, TimeSession_Sec__c FROM NWT_Case_Timer__c WHERE Name =: idStp];
            tempsdetravail.TimeSession_Sec__c = 0;
            tempsdetravail.IsActiveTimer__c = timer;
            update tempsdetravail;
        } catch(Exception ex){
            ex.getMessage();
        }
    }
    
    @AuraEnabled
    public static void updateTimeat0 (String stopwatch, String idStp){
        Datetime tempsFin = Datetime.now();
        String dates = tempsFin.format('dd/MM/yyyy');
        List<Integer> integerList = NWT_CaseTimer.toInteger(stopwatch);
        
        Time myTime;
        if(integerList != null && !integerList.IsEmpty()) {
            myTime = Time.newInstance(integerList[0], integerList[1], integerList[2],0);    
        }
        
        Integer timeSec = (myTime.hour()*3600 )+ (myTime.minute()*60) + (myTime.second());
        
        String stp; 
        try{
            NWT_Case_Timer__c tempsexistant = [SELECT Name, LastModifiedDate__c, TimeSession_Sec__c, TimeTotal_Sec__c
                                               FROM NWT_Case_Timer__c
                                               WHERE Name =: idStp];
            tempsexistant.LastModifiedDate__c = tempsFin;
            tempsexistant.TimeSession_Sec__c = 0;
            tempsexistant.TimeTotal_Sec__c = tempsexistant.TimeTotal_Sec__c + 0;
            update tempsexistant;
        } catch(Exception ex){
            ex.getMessage();
        }
    }
    
    @AuraEnabled
    public static void updateTime (string stopwatch, string idStp){
        Datetime tempsFin = Datetime.now();
        String dates = tempsFin.format('dd/MM/yyyy');
        List<Integer> integerList = NWT_CaseTimer.toInteger(stopwatch);
        
        Time myTime;
        if(integerList != null && !integerList.IsEmpty()) {
            myTime = Time.newInstance(integerList[0], integerList[1], integerList[2],0);  
        }
        
        Integer timeSec = (myTime.hour()*3600 )+ (myTime.minute()*60) + (myTime.second());
        
        String stp;
        try {
            NWT_Case_Timer__c tempsexistant = [SELECT Name,LastModifiedDate__c,TimeSession_Sec__c,TimeTotal_Sec__c
                                               FROM NWT_Case_Timer__c
                                               WHERE Name =: idStp];
            tempsexistant.LastModifiedDate__c = tempsFin;
            tempsexistant.TimeSession_Sec__c = tempsexistant.TimeSession_Sec__c + 60;
            tempsexistant.TimeTotal_Sec__c = tempsexistant.TimeTotal_Sec__c + 60;
            update tempsexistant;
        } catch(Exception ex){
            ex.getMessage();
        }
    }
    
    @AuraEnabled
    public static list<integer> toInteger(String text) {
        List<Integer> integerList = new List<Integer>();
        List<String> lstAlpha = text.split(':');
        for (String c : lstAlpha) {
            integerList.add(integer.valueOf(c));
        }
        return integerList;
    }
    
    @AuraEnabled
    public static String getUser() {
        return userinfo.getName();
    }
    
    @AuraEnabled
    public static String getNTicket(id idObject){
        Datetime tempsFin = Datetime.now();
        String dates = tempsFin.format('dd/MM/yyyy');
        String NTicket;
        String username = UserInfo.getUserId();
        List<NWT_Case_Timer__c> ticket = [SELECT Ticket__r.CaseNumber
                                          FROM NWT_Case_Timer__c
                                          WHERE Ticket__c =: idObject
                                          AND User__c =: username AND CreatedDate__c =: dates];
        for (NWT_Case_Timer__c t : ticket) {
            if (t != null) {
                NTicket = t.Ticket__r.CaseNumber;
            }
        }
        return NTicket;
    }
    
    @AuraEnabled
    public static void insertUser(Id idObject){
        Case ticket = [SELECT Id, Utilisateur_Courant__c FROM Case WHERE Id=:idObject];
        if(ticket != null && ticket.Utilisateur_Courant__c == null){
            ticket.Utilisateur_Courant__c=userInfo.getUserId();
            update ticket;
        }
    }
}