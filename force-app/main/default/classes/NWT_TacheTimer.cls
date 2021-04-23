public class NWT_TacheTimer {
 @AuraEnabled
    public static Boolean EquipeParam(){
		Boolean result;
        Id user = UserInfo.getUserId();
        try{    
            User Equipe = [SELECT Equipe_Nowteam__c FROM User WHERE Id =: user];
            NWT_CaseTimer_settings__c Equip_Param = [SELECT IsActive_Tache__c 
                                                     FROM NWT_CaseTimer_settings__c 
                                                     WHERE Nom_de_equipe__c =: Equipe.Equipe_Nowteam__c];
            result = Equip_Param.IsActive_Tache__c;
        }
        catch(Exception ex){
        	ex.getMessage(); 
        }   
        return result;
    } 

    @AuraEnabled
    public static boolean Cloturer(Id idObject){
        Boolean value;
        try{
        	NWT_NOWPRJ_Tache__c tache = [SELECT IsClosed__c FROM NWT_NOWPRJ_Tache__c WHERE Id =: idObject];
        	value = tache.IsClosed__c;
        } catch(Exception ex){
        	ex.getMessage(); 
        }
        return value;
    }
    
    @AuraEnabled
    public static string tacheverouiller(Id idObject){
        Datetime tempsFin = Datetime.now();
        String dates = tempsFin.format('dd/MM/yyyy');
        String verouillertache;
        String username = UserInfo.getUserId();
        List<NWT_Tache_Timer__c> tacheverouiller = [SELECT IsActiveTimer__c,Utilisateur__r.Name,TimeSession_Sec__c from NWT_Tache_Timer__c where Tache__c=:idObject and CreatedDate__c=:dates and Utilisateur__c!=:username] ;
        for (NWT_Tache_Timer__c a : tacheverouiller) {
            if (a != null && a.IsActiveTimer__c == true) {
                verouillertache = a.IsActiveTimer__c + ':' + a.Utilisateur__r.Name + ':' + a.TimeSession_Sec__c;
                break;
            }
        }
        return verouillertache;
    }

    @AuraEnabled
    public static String deverouillertache(Id idObject){
        Datetime tempsFin = Datetime.now();
        String dates = tempsFin.format('dd/MM/yyyy');
        String timer;
        String username = UserInfo.getUserId();
        List<NWT_Tache_Timer__c> tacheverouiller = [SELECT Name,IsActiveTimer__c FROM NWT_Tache_Timer__c WHERE Tache__c=:idObject 
                                                    AND CreatedDate__c =: dates 
                                                    AND Utilisateur__c !=: username];

        for (NWT_Tache_Timer__c a : tacheverouiller) {
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
    public static String getSuiviTime(id idObject){
        Datetime tempsFin = Datetime.now();
        String dates = tempsFin.format('dd/MM/yyyy');
        String stp;
        String username = UserInfo.getUserId();

        List<NWT_Tache_Timer__c> temps = [SELECT Name 
                                          FROM NWT_Tache_Timer__c 
                                          WHERE Tache__c =: idObject 
                                            AND Utilisateur__c =: username 
                                            AND CreatedDate__c =: dates];

        for (NWT_Tache_Timer__c t : temps) {
        	if (temps != null) {
            	stp = t.Name;
                break;
        	}
        }
        return stp;
    }

	@AuraEnabled
    public static void saveTime(String stopwatch, Id idObject){
        Datetime tempsFin = Datetime.now();
        String dates = tempsFin.format('dd/MM/yyyy');
        List<Integer> integerList = NWT_TacheTimer.toInteger(stopwatch);   

        Time myTime;
        if (integerList != null && !integerList.IsEmpty()) {
            myTime = Time.newInstance(integerList[0], integerList[1], integerList[2],0);
        }

        Integer timeSec = (myTime.hour()*3600) + (myTime.minute()*60) + (myTime.second());        
        DateTime tempsDebut = tempsFin.addSeconds(-timeSec);
        Id user = UserInfo.getUserId();
        User Equipe = [SELECT Equipe_Nowteam__c FROM User WHERE Id =: user];
        try {
        	NWT_Tache_Timer__c stp = new NWT_Tache_Timer__c();
          	stp.Tache__c = idObject;
            stp.Equipe_Nowteam__c = Equipe.Equipe_Nowteam__c;
        	stp.Utilisateur__c = user; 
        	stp.CreatedDate__c = dates;
        	stp.CreatedDateHour__c = tempsDebut;
        	stp.LastModifiedDate__c = tempsFin;
            stp.TimeSession_Sec__c = 0;
        	stp.TimeTotal_Sec__c = 0;
            stp.IsActiveTimer__c = true;
         	insert stp;
     	} catch(Exception ex){
           		ex.getMessage(); 
        }
  
        NWT_NOWPRJ_Tache__c tache = [SELECT Id, Utilisateur_Courant__c FROM NWT_NOWPRJ_Tache__c WHERE Id =: idObject];
      	if (tache != null){
          	tache.Utilisateur_Courant__c = null;
            update tache;
      	}
    }

    @AuraEnabled
    public static void updateTimerEncours(Boolean timer, String idStp){
        try{
            NWT_Tache_Timer__c timerencours = [SELECT IsActiveTimer__c FROM NWT_Tache_Timer__c WHERE Name =: idStp];
            timerencours.IsActiveTimer__c = timer;
            update timerencours;
        } catch(Exception ex){
        	ex.getMessage(); 
        }
    }

    @AuraEnabled
    public static void ResetTempsdeTravail (Boolean timer, string idStp){
        try{
            NWT_Tache_Timer__c tempsdetravail = [SELECT IsActiveTimer__c, TimeSession_Sec__c 
                                                 FROM NWT_Tache_Timer__c WHERE Name=:idStp];
            tempsdetravail.TimeSession_Sec__c = 0;
            tempsdetravail.IsActiveTimer__c = timer;
            update tempsdetravail;
        } catch(Exception ex){
        	ex.getMessage(); 
        }
    }

    @AuraEnabled
    public static void updateTimeat0 (string stopwatch, string idStp){
        Datetime tempsFin = Datetime.now();
        String dates = tempsFin.format('dd/MM/yyyy');
        List<Integer> integerList = NWT_TacheTimer.toInteger(stopwatch);   
        Time myTime;
        if (integerList != null && !integerList.IsEmpty()) {
            myTime = Time.newInstance(integerList[0], integerList[1], integerList[2],0);
        }

        Integer timeSec = (myTime.hour()*3600) + (myTime.minute()*60) + (myTime.second());        
        
        String stp;
        try{
            NWT_Tache_Timer__c tempsexistant = [SELECT Name, LastModifiedDate__c, TimeSession_Sec__c, TimeTotal_Sec__c 
                                                FROM NWT_Tache_Timer__c 
                                                WHERE Name =: idStp];

            tempsexistant.LastModifiedDate__c = tempsFin;
            tempsexistant.TimeSession_Sec__c = 0;
            tempsexistant.TimeTotal_Sec__c	= tempsexistant.TimeTotal_Sec__c + 0;
            update tempsexistant;
        } catch(Exception ex){
        	ex.getMessage(); 
        }
    }

    @AuraEnabled
    public static void updateTime(String stopwatch, String idStp){
        Datetime tempsFin = Datetime.now();
        String dates = tempsFin.format('dd/MM/yyyy');
        List<Integer> integerList = NWT_TacheTimer.toInteger(stopwatch);      

        Time myTime;
        if (integerList != null && !integerList.IsEmpty()) {
            myTime = Time.newInstance(integerList[0], integerList[1], integerList[2],0);
        }

        Integer timeSec = (myTime.hour()*3600 )+ (myTime.minute()*60) + (myTime.second());        
     
        String stp;
        try {
            NWT_Tache_Timer__c tempsexistant = [SELECT Name,LastModifiedDate__c, TimeSession_Sec__c,TimeTotal_Sec__c 
                                                FROM NWT_Tache_Timer__c 
                                                WHERE Name=:idStp];
            tempsexistant.LastModifiedDate__c = tempsFin;
            tempsexistant.TimeSession_Sec__c = tempsexistant.TimeSession_Sec__c + 60;
            tempsexistant.TimeTotal_Sec__c	= tempsexistant.TimeTotal_Sec__c + 60;
            update tempsexistant;
        } catch(Exception ex){
        	ex.getMessage(); 
        }
    }

    @AuraEnabled
    public static list<integer> toInteger(String text) {
         List<Integer> integerList = new List<Integer>();
         List<String> lstAlpha = text.split(':');
         for (String c : lstAlpha){
            integerList.add(integer.valueOf(c));
        }
        return integerList;
    }

    @AuraEnabled
  	public static String getUser() {
    	return userinfo.getName();
  	}

    @AuraEnabled
    public static String getNTache(Id idObject){
        Datetime tempsFin = Datetime.now();
        String dates = tempsFin.format('dd/MM/yyyy');
        String NTache;
        String username = UserInfo.getUserId();
        List<NWT_Tache_Timer__c> tache = [SELECT Tache__r.Name FROM NWT_Tache_Timer__c WHERE Tache__c =: idObject 
                                            AND Utilisateur__c =: username 
                                            AND CreatedDate__c=:dates];

        for (NWT_Tache_Timer__c t : tache) {
        	if (t != null) {
            	NTache = t.Tache__r.Name;
        	}
        }
        return NTache;
    }

    @AuraEnabled
    public static void insertUser(Id idObject){
        NWT_NOWPRJ_Tache__c tache = [SELECT Id, Utilisateur_Courant__c 
                                     FROM NWT_NOWPRJ_Tache__c 
                                     WHERE Id =: idObject];
      	if (tache != null && tache.Utilisateur_Courant__c == null){
          	tache.Utilisateur_Courant__c = userInfo.getUserId();
            update tache;
      	}
    }
}