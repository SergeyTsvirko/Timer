public class NWT_AtelierTimer {
    
	@AuraEnabled
    public static Boolean EquipeParam(){
		//boolean result;
		Boolean result;
        id user = UserInfo.getUserId();
        try{
            User Equipe = [SELECT Equipe_Nowteam__c from User where id=:user];
            NWT_CaseTimer_settings__c Equip_Param = [SELECT IsActive_Atelier__c from NWT_CaseTimer_settings__c where Nom_de_equipe__c=:Equipe.Equipe_Nowteam__c];
            result = Equip_Param.IsActive_Atelier__c;
        }
        catch(Exception ex){
        	ex.getMessage(); 
        } 
        return result;
    }
   @AuraEnabled
    public static string Cloturer(id idObject){
        System.debug('Cloturer');
        string value;
        try{
            Atelier__c at = [SELECT Statut__c from Atelier__c where id=:idObject];
            value = at.Statut__c;
        }
        catch(Exception ex){
        	ex.getMessage(); 
        }
        System.debug(value); 
        
        return value;
    }
    @AuraEnabled
    public static string atelierverouiller(id idObject){
        System.debug('atelierverouiller');
        Datetime tempsFin  = Datetime.now();
        String dates = tempsFin.format('dd/MM/yyyy');
        String verouilleratelier;
        string username = UserInfo.getUserId();
        List<NWT_Atelier_Timer__c> atelierverouiller = [SELECT IsActiveTimer__c,Utilisateur__r.Name,TimeSession_Sec__c from NWT_Atelier_Timer__c where Atelier__c=:idObject and CreatedDate__c=:dates and Utilisateur__c!=:username] ;
        for(NWT_Atelier_Timer__c a : atelierverouiller) {
            if(a!=null && a.IsActiveTimer__c == true)
                //             if(a!=null && a.IsActiveTimer__c == 'oui')
        	{
            verouilleratelier = a.IsActiveTimer__c + ':' + a.Utilisateur__r.Name + ':' + a.TimeSession_Sec__c;
            break;
            }
        }
        return verouilleratelier;
    }
    @AuraEnabled
    public static String deverouilleratelier(id idObject){
        Datetime tempsFin  = Datetime.now();
        String dates = tempsFin.format('dd/MM/yyyy');
        String timer;
        string username = UserInfo.getUserId();
        List<NWT_Atelier_Timer__c> 	atelierverouiller = [SELECT Name,IsActiveTimer__c from NWT_Atelier_Timer__c where Atelier__c=:idObject and CreatedDate__c=:dates and Utilisateur__c!=:username] ;
        for (NWT_Atelier_Timer__c a : atelierverouiller)
        {
            if (a!=null && a.IsActiveTimer__c == true)
        	{
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
        Datetime tempsFin  = Datetime.now();
        String dates = tempsFin.format('dd/MM/yyyy');
        String atp;
        string username = UserInfo.getUserId();
        List<NWT_Atelier_Timer__c> temps = [SELECT Name from NWT_Atelier_Timer__c where Atelier__c=:idObject and Utilisateur__c=:username and CreatedDate__c=:dates];
        for(NWT_Atelier_Timer__c t : temps)
        {
            if(t != null)
            {
                atp = t.Name;
                break;
            }
            system.debug(t.Name);
        }
        return atp;
    }
	@AuraEnabled
    public static void saveTime (string stopwatch, id idObject){
        
        Datetime tempsFin = Datetime.now();
        String dates = tempsFin.format('dd/MM/yyyy');
        system.debug('temps' +tempsFin);
        List<Integer> integerList = NWT_AtelierTimer.toInteger(stopwatch);      
        Time myTime = Time.newInstance(integerList[0], integerList[1], integerList[2],0);
        system.debug('TIME' +myTime);
        integer  timeSec = (myTime.hour()*3600 )+ (myTime.minute()*60) + (myTime.second());        
        system.debug('somme' +timeSec);
        DateTime tempsDebut = tempsFin.addSeconds(-timeSec);
        system.debug('temps' +tempsDebut);
        id user = UserInfo.getUserId();
        User Equipe = [SELECT Equipe_Nowteam__c from User where id=:user];
        try {
        	NWT_Atelier_Timer__c atp = new NWT_Atelier_Timer__c();
          	atp.Atelier__c=idObject;
            atp.Equipe_Nowteam__c=Equipe.Equipe_Nowteam__c;
        	atp.Utilisateur__c= user; 
        	atp.CreatedDate__c = dates;
        	atp.CreatedDateHour__c = tempsDebut;
        	atp.LastModifiedDate__c = tempsFin;
            atp.TimeSession_Sec__c = timeSec;
        	atp.TimeTotal_Sec__c =  0;
            atp.IsActiveTimer__c= true;
        	system.debug('time' +myTime);
         	insert atp;
     	}catch(Exception ex){
           		ex.getMessage(); 
        }  
    }
    @AuraEnabled
    public static void updateAtelierEncours(Boolean timer, string idAtp){
        try{
       		NWT_Atelier_Timer__c timerencours = [SELECT IsActiveTimer__c from NWT_Atelier_Timer__c where Name=:idAtp];
        	timerencours.IsActiveTimer__c = timer;
            update timerencours;
        }catch(Exception ex){
        	ex.getMessage(); 
        }
    }
    @AuraEnabled
    public static void ResetTempsAtelier (Boolean timer, string idAtp){
        try{
            NWT_Atelier_Timer__c tempsatelier = [SELECT IsActiveTimer__c,TimeSession_Sec__c from  NWT_Atelier_Timer__c where Name=:idAtp];
            tempsatelier.TimeSession_Sec__c = 0;
            tempsatelier.IsActiveTimer__c = timer;
            update tempsatelier;
        }catch(Exception ex){
        	ex.getMessage(); 
        }
    }
    @AuraEnabled
    public static void updateAtelierat0 (string stopwatch, string idAtp){
        Datetime tempsFin   =Datetime.now();
        String dates = tempsFin.format('dd/MM/yyyy');
        system.debug('temps' +tempsFin);
        List<Integer> integerList = NWT_AtelierTimer.toInteger(stopwatch);      
        Time myTime = Time.newInstance(integerList[0], integerList[1], integerList[2],0);
        system.debug('TIME' +myTime);
        integer  timeSec = (myTime.hour()*3600 )+ (myTime.minute()*60) + (myTime.second());        
        system.debug('somme' +timeSec);
        string atp;
        try{
            NWT_Atelier_Timer__c tempsexistant = [SELECT Name,LastModifiedDate__c,TimeSession_Sec__c,TimeTotal_Sec__c from NWT_Atelier_Timer__c where Name=:idAtp];
            tempsexistant.LastModifiedDate__c=tempsFin;
            tempsexistant.TimeSession_Sec__c = 0;
            tempsexistant.TimeTotal_Sec__c	= tempsexistant.TimeTotal_Sec__c + timeSec;
            update tempsexistant;
        }catch(Exception ex){
        	ex.getMessage(); 
        }
    }
    @AuraEnabled
    public static void updateTimeAtelier (string stopwatch, string idAtp){
        Datetime tempsFin   =Datetime.now();
        String dates = tempsFin.format('dd/MM/yyyy');
        system.debug('temps' +tempsFin);
        List<Integer> integerList = NWT_AtelierTimer.toInteger(stopwatch);      
        Time myTime = Time.newInstance(integerList[0], integerList[1], integerList[2],0);
        system.debug('TIME' +myTime);
        integer  timeSec = (myTime.hour()*3600 )+ (myTime.minute()*60) + (myTime.second());        
        system.debug('somme' +timeSec);
        string stp;
        try{
            NWT_Atelier_Timer__c tempsexistant = [SELECT Name,LastModifiedDate__c,TimeSession_Sec__c,TimeTotal_Sec__c from NWT_Atelier_Timer__c where Name=:idAtp];
            tempsexistant.LastModifiedDate__c=tempsFin;
            tempsexistant.TimeSession_Sec__c=tempsexistant.TimeSession_Sec__c + 60;
            tempsexistant.TimeTotal_Sec__c	= tempsexistant.TimeTotal_Sec__c + 60;
            update tempsexistant;
        }catch(Exception ex){
        	ex.getMessage(); 
        }
    }
    @AuraEnabled
    public static list<integer> toInteger(string text) {
         List<Integer> integerList = new List<Integer>();
         List<String> lstAlpha = text.split(':');
         for(string c:lstAlpha){
            integerList.add(integer.valueOf(c));
            
        }
        system.debug('integer list' +integerList); 
        return integerList;
         
    }
    @AuraEnabled
  	public static String getUser() {
    	return userinfo.getName();
  	}
    @AuraEnabled
    public static String getNAtelier(id idObject){
        Datetime tempsFin  = Datetime.now();
        String dates = tempsFin.format('dd/MM/yyyy');
        String NAtelier;
        string username = UserInfo.getUserId();
        List<NWT_Atelier_Timer__c> atelier = [SELECT Atelier__r.Name from NWT_Atelier_Timer__c where Atelier__c=:idObject and Utilisateur__c=:username and CreatedDate__c=:dates];
        for(NWT_Atelier_Timer__c a : atelier)
        {
        	if(atelier!=null)
        	{
            	NAtelier = a.Atelier__r.Name;
                break;
        	}
        }   
        return NAtelier;
    }
   
}