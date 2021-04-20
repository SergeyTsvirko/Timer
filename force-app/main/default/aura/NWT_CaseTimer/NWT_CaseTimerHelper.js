({   	
	//fonction timer
    doTimer : function(component, event, vticket, vid) 
    {
       	debugger;
        //déclaration d'une variable clocktimer
        var clocktimer;
        //déclaration d'une variable clockmax
        var clockmax;
        //déclaration d'une variable time
        var time;
        var	clsStopwatch = function() {
                // Private vars
                var	startAt	=  0;	// Time of last start / resume. (0 if not running)
                var	lapTime	=  0;	// Time on the clock when last stopped in milliseconds
                var	now	= function() {
                    return (new Date()).getTime();
                };
                // Public methods
                // Start or resume
                this.start = function() {
                    startAt	= startAt ? startAt : now();                   	 
                };
                // Stop or pause
                this.stop = function() {
                    // If running, update elapsed time otherwise keep it
                    lapTime	= startAt ? lapTime + now() - startAt : lapTime;
                    startAt	= 0; // Paused    
                 };
                // Reset
                this.reset = function() {
                    lapTime = startAt = 0;
                };
                // Duration
                this.time = function() {
                    return lapTime + (startAt ? now() - startAt : 0);
                };
        };
        function pad(num, size) {
        	var s = "0000" + num;
            return s.substr(s.length - size);
       	}
        //fonction mise en forme du temps
        function formatTime(time) {
        	var h = 0;
            var m = 0;
            var s = 0;
            var ms = 0;
            var newTime = '';
            h = Math.floor( time / (60 * 60 * 1000) );	
            time = time % (60 * 60 * 1000);
            m = Math.floor( time / (60 * 1000) );
            time = time % (60 * 1000);
            s = Math.floor( time / 1000 );
            ms = time % 1000;
            newTime = pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2);
            //+ ':' + pad(ms, 3);
            return newTime;
 		}
        //recupère le composant v.stopwatch
        var stopwatch = component.get("v.stopwatch");
        //initialiser des timer
        var x = stopwatch || new clsStopwatch();
        var y = stopwatch || new clsStopwatch();
        //si la valeur recupérer est égal a FirstStart
        if(vid === "FirstStart"){
            //déclaration d'une variable valuestp
            var valuestp;
            //déclaration d'une variable valuenticket
            var valuenticket;
            //déclaration d'une variable message instencié a true
            var message = "true";
            //déclaration d'une variable s1 instencié a 0
            var s1 = 0;
            //déclaration d'une variable s2 instencié a 1
            var s2 = 1;
            //déclaration d'une variable newtime qui va permettre de comparer le temps
            var newtime = pad(s1, 1) + pad(s2, 1);
            //déclaration d'une variable element
                var element;
                //recupére le composant button
                element = component.find("button");
                //cache le bouton start
                $A.util.removeClass(element, 'start');
                //affiche le button pause
                $A.util.addClass(element, 'pause');
                //déclaration d'une variable element1
                var element1;
                //recupére le composant start
                element1 = component.find("start");
                //cache le bouton start
                $A.util.removeClass(element1, 'slds-buttonstart');
                //affiche le bouton stop
                $A.util.addClass(element1, 'slds-buttonstop');
            //fonction recuperation du numéro de ticket
            function nticket(ticket){
                //execute la classe getNTicket
                var vGetNTicket = component.get("c.getNTicket");
                if(typeof vGetNTicket != 'undefined'){
                    vGetNTicket.setParams({
                        "idObject" : ticket
                    });
                    //recupère la valeur retourner par la classe
                    vGetNTicket.setCallback(this, function(pResponseNTicket) {
                        //met le résultat retourner dans la variable valuenticket
                        valuenticket = pResponseNTicket.getReturnValue();
                    });
                    $A.enqueueAction(vGetNTicket);
                }    
            }
            //fonction crée ou modifier le stp
            function stp(ticket){
                //execute la classe getSuiviTime
        		var vGetStp = component.get("c.getSuiviTime");
                if(typeof vGetStp != 'undefined'){
                    vGetStp.setParams({
                        "idObject" : ticket
                    });
                    //recupère la valeur retourner par la classe
                    vGetStp.setCallback(this, function(pResponseStp) {
                        //recupère le résultat et le stock dans la variable vStateStp
                        var vStateStp = pResponseStp.getReturnValue();
                        //stock aussi le resultat dans la variable valuestp
                        valuestp = vStateStp;
                        //si le résultat est différent de null
                        if (vStateStp != null) {
                            //execute la fonction udpatestp avec en paramètre le numéro du stp
                            updatestp(vStateStp);
                        }
                        //sinon
                        else {
                            //execute la fonction createstp avec en paramètre l'id du ticket
                            createstp(ticket)
                        }
                    });
                    $A.enqueueAction(vGetStp);
                }
        	}
            //fonction creation du stp
        	function createstp(ticket){
                //execute la fonction saveTime
            	var vSaveFunction = component.get("c.saveTime");
                if(typeof vSaveFunction != 'undefined'){
                    vSaveFunction.setParams({
                        "stopwatch" : '00:00:00',
                        "idObject" : ticket
                    });
                    var self = this;
                    //recupère la valeur retourner par la classe
                    vSaveFunction.setCallback(this, function(pResponse) {
                        //recupère l'etat du résultat et le stock dans la variable vState
                        var vState = pResponse.getState(); 
                        console.log('############ vState ' + vState);
                    //on ferme la classe saveTime
                    });
                    $A.enqueueAction(vSaveFunction);
                }
        	}
            //fonction mise a jour du stp
        	function updatestp(stp){
                //execute la classe updateTimeat0
            	var vUpdateFunction = component.get("c.updateTimeat0");
                if(typeof vUpdateFunction != 'undefined'){
                    vUpdateFunction.setParams({                                     
                        "stopwatch" : '00:00:00',
                        "idStp" : stp
                    });
                    //on ferme la classe updateTimeat0
                    $A.enqueueAction(vUpdateFunction);
                    //execute la classe ResetTempsdeTravail
                    var vUpdateTempsdeTravail = component.get("c.ResetTempsdeTravail");
                    if(typeof vUpdateTempsdeTravail != 'undefined'){
                        vUpdateTempsdeTravail.setParams ({
                            "timer" : true,
                            "idStp" : stp
                        });
                        //one ferme la classe ResetTempsdeTravail
                        $A.enqueueAction(vUpdateTempsdeTravail);
                    }
                }
        	}
            //fonction ticketverouiller
        	function ticketverouille(ticket){
                //execute la classe ticketverouiller
                var vTicketVerouiller = component.get("c.ticketverouiller");
                if(typeof vTicketVerouiller != 'undefined'){
                    vTicketVerouiller.setParams({
                        "idObject" : ticket
                    });
                    //recupere le résultat
                    vTicketVerouiller.setCallback(this, function(pResponseTicketVerouiller) {
                        //si le résultat est différent de null
                        if(pResponseTicketVerouiller.getReturnValue() != null)
                        {
                            //déclaration d'une variable avec le résultat récupérer
                            var ticketverouiller = (pResponseTicketVerouiller.getReturnValue()).split(':');
                            //on recupére le premier champ que l'on met dans la variable resulticketverouiller
                            var resulticketverouiller = ticketverouiller[0];
                            //on recupére le deuxième champ que l'on met dans la variable user
                            var user = ticketverouiller[1];
                            //on récupére le troisième champ que l'on met dans la variable duree
                            var duree = ticketverouiller[2];
                            //on récupere le nombre de secondes et on dévise par 60 pour récuperer les min
                            var minutes = Math.floor(duree / 60);
                            //on envoie le résultat de l'utilisateur dans le composant v.vUser
                            component.set("v.vUser", user); 
                            //on envoie le résultat des minutes dans le composant v.vMinute
                            component.set("v.vMinutes", minutes);
                            //déclaration d'une variable element
                            var element;
                            //on recupere le composant ticketverouiller
                            element = component.find("ticketverouiller");
                            //on affiche le composant
                            $A.util.removeClass(element, 'valeur');
                            //déclaration d'une variable element1
                            var element1;
                            //on recupere le composant ticketverouiller
                            element1 = component.find("timer");
                            //cache le composant
                            $A.util.addClass(element1, 'valeur');
                            //modifier la valeur dans valuestart par Start
                            component.set("v.vValue","Start");
                            x.stop();
                    	}
                        //sinon
                        else {
                            //déclaration d'une variable element
                            var element;
                            //on recupere le composant timer
                            element = component.find("timer");
                            //on affiche le composant
                            $A.util.removeClass(element, 'valeur');
                            //on lance la fonction stp
                            //modifier la valeur dans valuestart par Stop
                            component.set("v.vValue","Stop");
                            verouille();
                    	}
                    //ferme la class getSuiviTime    
                    });
                    $A.enqueueAction(vTicketVerouiller);
                }
        	}
            //fonction enregistrement du temps
            function save(time){
                //déclaration d'une variable vtime avec le temps a enregistré sois 1 min
            	var vTime = "00:01:00";
                //execute la classe updateTime
                var vUpdateFunction = component.get("c.updateTime");
                if(typeof vUpdateFunction != 'undefined'){
                    vUpdateFunction.setParams({
                        "stopwatch" : vTime,
                         "idStp" : valuestp
                    });
                    //on ferme la classe updateTime
                    $A.enqueueAction(vUpdateFunction);
                }
            }
            //fonction message pour la notification
            function mnotification(){
                //déclaration d'une variable titre avec le contenue du titre pour la notification
                var titre = "Travaillez-vous toujours sur le ticket " + valuenticket + " ?";
                //déclaration d'une variable message notification avec le contenue du message
                var messagenotification = "Le ticket a été déverrouillé, veuillez cliquer sur \"YES\" dans le timer afin de le reprendre ou \"NON\" afin d’arrêter l'alerte"
                //création de la notification
                var n = new Notification(titre, {
                	body: messagenotification
                });
                verouille();
            }
            function verouille(){
                var vVerouille = component.get("c.updatetimerencours");
                if(typeof vVerouille != 'undefined'){
                	vVerouille.setParams ({
                    	"timer" : true,
                         "idStp" : valuestp
                   });
                   //one ferme la classe updatetimerencours
                   $A.enqueueAction(vVerouille);
               }
            }
            //fonction notification
            function notification(){
                //si le contenue de la variable message est égal a true
                if(message === "true"){
                    //execute la fonction mnotification
                    mnotification();
                    //remplace la valeur par false dans la variable message
                    message = "false";
                }
                var time2 = component.get("v.vTime");
                if(time2 === "00:00:00") {
                    clearInterval(clockmax);
                } else {
                    //mise en forme du delai de la notification
                    var delaimax = formatTime(y.time());
                    //si le delai est égal a 1min
                    if(delaimax === '00:01:00'){
                        //on récupère l'id du ticket et on le met dans la variable idObject
                        var idObject = component.get("v.recordId");
                        //si type d'objet présent dans idObject est égal a undefined
                        if(typeof idObject === 'undefined') {
                            //stop la fonction notification
                            clearInterval(clockmax);
                        } else {
                            //execute la fonction mnotification
                            mnotification();
                            //reset le timer de la notif
                            y.reset();
                            //redémarrage du timer
                            y.start();
                         }    
                    }
                }
            }
            //fonction timemax
            function timemax(){
                //arret du timer
                x.stop();
                //déclaration d'une variable element
                var element;
                //récupére le composant dont l'aura:id est work
                element = component.find("work");
                //enleve la classe css valeur ce qui permet d'afficher l'element
                $A.util.removeClass(element, 'valeur');
                //déclaration d'une variable element
                var element1;
                //récupére le composant dont l'aura:id est timer
                element1 = component.find("timer");
                //ajoute la classe css valeur ce qui permet de cacher l'element
                $A.util.addClass(element1, 'valeur');
                //initialise le timer de la notification
                clockmax = setInterval(notification, 1);
                //démarre le timer
                y.start();
            }
            //fonction timer
			function timer(){
                //envoie le résultat dans le composant v.vtime ce qui permet l'affichage du temps
        		component.set("v.vTime", formatTime(x.time()));
                //recupere le temps en cours sur le composant v.vtime
                time = component.get("v.vTime");
                // si valuestp est égal null
                if(valuestp == null){
                    //execute la class getSuiviTime
                	var vGetStp = component.get("c.getSuiviTime");
                    if(typeof vGetStp != 'undefined'){
         				vGetStp.setParams({
            				"idObject" : vticket
          				});
                        ///recupère la valeur retourner par la classe
                        vGetStp.setCallback(this, function(pResponseStp) {
                            //met le résultat retourner dans la variable vStateStp
                            var vStateStp = pResponseStp.getReturnValue();
                            //met aussi le résultat dans valuestp
                            valuestp = vStateStp;
                        });
                        //ferme la class getSuiviTime
                        $A.enqueueAction(vGetStp);
                    }
                }
                //si le type contenue dans la varialbe time est différent de undefined
                if(typeof time != "undefined"){
                    //on split le résultat récupérer dans la variable time
					var timer = time.split(':');  
                    //si le temps contenue dans timer[1] est égal a newtime
                	if(newtime == timer[1]){
                        //si le timer[1] est inférieur a 9
                		if(timer[1] < 9){
                            //on incrémente la variable s2
                    		s2 = s2 + 1;
                            //on met a jour la variable newtime
                        	newtime = pad(s1, 1) + pad(s2, 1);
                            save(time);
                            ticketverouille(vticket);
                    	}
                        //si le timer[1] est égal a 9
                    	if(timer[1] == 9){
                        	//on met la variable s1 a 1 et la variable s2 a 0
                    		s1 = 1;
                        	s2 = 0;
                            //on met a jour la variable newtime
                       		newtime = pad(s1, 1) + pad(s2, 1);
                            save(time);
                            ticketverouille(vticket);
                    	}
                        //si le timer[1] est supérieu ou égal a 10 mais inférieur a 19
                    	if((timer[1] >= 10) && (timer[1] < 19)){
                            //on incrémente la variable s2
                    		s2 = s2 + 1;
                            //on met a jour la variable newtime
                    		newtime = pad(s1, 1) + pad(s2, 1);
                            save(time);
                            ticketverouille(vticket);
                    	}
                        //si le timer[1] est égal a 19
                        if(timer[1] == 19){
                        	//on met la variable s1 a 1 et la variable s2 a 0
                    		s1 = 2;
                        	s2 = 0;
                            //on met a jour la variable newtime
                       		newtime = pad(s1, 1) + pad(s2, 1);
                            save(time);
                            ticketverouille(vticket);
                    	}
                        //si le timer[1] est supérieu ou égal a 20 mais inférieur a 29
                    	if((timer[1] >= 20) && (timer[1] < 29)){
                            //on incrémente la variable s2
                    		s2 = s2 + 1;
                            //on met a jour la variable newtime
                    		newtime = pad(s1, 1) + pad(s2, 1);
                            save(time);
                            ticketverouille(vticket);
                    	}
                        //si le timer[1] est égal a 29
                    	if(timer[1] == 29){
                            //on met la variable s1 a 2 et la variable s2 a 0
                    		s1 = 3;
                    		s2 = 0;
                            //on met a jour la variable newtime
                    		newtime = pad(s1, 1) + pad(s2, 1);
                            save(time);
                    		nticket(vticket);
                            ticketverouille(vticket);
                    	}
                        //si le timer[1] est égal a 30
                    	if(timer[1] == 30){
                            //on met la variable s1 a 0 et la variable s2 a 1
                    		s1 = 0;
                        	s2 = 1;
                            //on met a jour la variable newtime
                        	newtime = pad(s1, 1) + pad(s2, 1);
                            save(time);
                            //lance la fonction timemax
                            message = "true";
                            timemax();
                    	}
                        //lance la fonction save
                    } 
                } else {
                    //stop la fonction timer
                	clearInterval(clocktimer);
                }
        	}
            //lance la fonction stp
            stp(vticket);
            //modifier la valeur dans valuestart par stop
            component.set("v.vValue","Stop");
           	if(!stopwatch){
        		component.set("v.stopwatch", x);
        	}
            //initialise la fonction timer
            clocktimer = setInterval(timer, 1);
            //lance la fonction timer
            x.start();
        }
        //si la valeur recupérer est égal a Start
        if(vid === "Start"){
            //déclaration d'une variable s1 instencié a 0
            var s1 = 0;
            //déclaration d'une variable s2 instencié a 1
            var s2 = 1;
            //déclaration d'une variable newtime qui va permettre de comparer le temps
            var newtime = pad(s1, 1) + pad(s2, 1);
            //fonction ticketverouiller
        	function ticketverouille(ticket){
                //execute la classe ticketverouiller
                var vTicketVerouiller = component.get("c.ticketverouiller");
                if(typeof vTicketVerouiller != 'undefined'){
                	vTicketVerouiller.setParams({
                    	"idObject" : ticket
                	});
                    //recupere le résultat
                	vTicketVerouiller.setCallback(this, function(pResponseTicketVerouiller) {
                    	//si le résultat est différent de null
                    	if(pResponseTicketVerouiller.getReturnValue() != null)
                    	{
                            //déclaration d'une variable avec le résultat récupérer
                            var ticketverouiller = (pResponseTicketVerouiller.getReturnValue()).split(':');
                            //on recupére le premier champ que l'on met dans la variable resulticketverouiller
                            var resulticketverouiller = ticketverouiller[0];
                            //on recupére le deuxième champ que l'on met dans la variable user
                            var user = ticketverouiller[1];
                            //on récupére le troisième champ que l'on met dans la variable duree
                            var duree = ticketverouiller[2];
                            //on récupere le nombre de secondes et on dévise par 60 pour récuperer les min
                            var minutes = Math.floor(duree / 60);
                            //on envoie le résultat de l'utilisateur dans le composant v.vUser
                            component.set("v.vUser", user); 
                            //on envoie le résultat des minutes dans le composant v.vMinute
                            component.set("v.vMinutes", minutes);
                            //déclaration d'une variable element
                            var element;
                            //on recupere le composant ticketverouiller
                            element = component.find("ticketverouiller");
                            //on affiche le composant
                            $A.util.removeClass(element, 'valeur');
                            //déclaration d'une variable element1
                            var element1;
                            //on recupere le composant ticketverouiller
                            element1 = component.find("timer");
                            //cache le composant
                            $A.util.addClass(element1, 'valeur');
                            //modifier la valeur dans valuestart par Start
                            component.set("v.vValue","Start");
                            x.stop();
                    	} else {
                            //déclaration d'une variable element
                            var element;
                            //on recupere le composant timer
                            element = component.find("timer");
                            //on affiche le composant
                            $A.util.removeClass(element, 'valeur');
                            //on lance la fonction stp
                            stp(ticket);
                            //modifier la valeur dans valuestart par Stop
                            component.set("v.vValue","Stop");
                        }
                    //ferme la class getSuiviTime    
                    });
                    $A.enqueueAction(vTicketVerouiller);
                }
        	}
            //fonction stp
            function stp(ticket){
                //execute la classe getSuiviTime
        		var vGetStp = component.get("c.getSuiviTime");
                if(typeof vGetStp != 'undefined'){
                    vGetStp.setParams({
                        "idObject" : ticket
                    });
                    //recupère le resultat
                    vGetStp.setCallback(this, function(pResponseStp) {
                        //stock le résultat dans la variable dans vStateStp
                        var vStateStp = pResponseStp.getReturnValue();
                        //stock le résultat dans valuestp
                        valuestp = vStateStp;
                        //si le résultat est diférent de null
                        if (vStateStp != null) {
                            //lance la fonction updatetimer
                            updatetimer(vStateStp);
                        }
                    });
                    //ferme la classe getSuiviTime
                    $A.enqueueAction(vGetStp);
                }
        	}
            //fonction updatimer
            function updatetimer(stp){
                //execute la classe ResetTempsdeTravail
                var vUpdateTempsdeTravail = component.get("c.ResetTempsdeTravail");
                if(typeof vUpdateTempsdeTravail != 'undefined'){
                    vUpdateTempsdeTravail.setParams ({
                        "timer" : true,
                        "idStp" : stp
                    });
                    //ferme le classe ResetTempsdeTravail
                    $A.enqueueAction(vUpdateTempsdeTravail);
                    //lance la fonction start
                    start();
                }
            }
            //fonction start
            function start(){
                //démarre le timer
                x.reset();
                x.start();
                //déclaration d'une variable element
                var element;
                //recupére le composant button
                element = component.find("button");
                //cache le bouton start
                $A.util.removeClass(element, 'start');
                //affiche le button pause
                $A.util.addClass(element, 'pause');
                //déclaration d'une variable element1
                var element1;
                //recupére le composant start
                element1 = component.find("start");
                //cache le bouton start
                $A.util.removeClass(element1, 'slds-buttonstart');
                //affiche le bouton stop
                //$A.util.addClass(element1, 'slds-buttonstop');
                $A.util.addClass(element1, 'valeur');
            }
            //lance la fonction ticketverouille
			ticketverouille(vticket);
        }
        //si la valeur recupérer est égal a Stop
        if(vid === "Stop"){
            //fonction stp
            function stp(ticket){
                //execute la classe getSuiviTime
        		var vGetStp = component.get("c.getSuiviTime");
                if(typeof vGetStp != 'undefined'){
                    vGetStp.setParams({
                        "idObject" : ticket
                    });
                    //recupère le résultat
                    vGetStp.setCallback(this, function(pResponseStp) {
                        //stock le résultat dans vStateStp
                        var vStateStp = pResponseStp.getReturnValue();
                        //stock aussi le résultat dans valuestp
                        valuestp = vStateStp;
                        //si lé résultat est différent de null
                        if (vStateStp != null) {
                            //lance la fonction updatetimer
                            updatetimer(vStateStp);
                        }
                    });
                    //ferme la classe getSuiviTime
                    $A.enqueueAction(vGetStp);
                }
        	}
            //fonction updatetimer
            function updatetimer(stp){
                //execute la classe ResetTempsdeTravail
                var vUpdateTempsdeTravail = component.get("c.ResetTempsdeTravail");
                if(typeof vUpdateTempsdeTravail != 'undefined'){
                    vUpdateTempsdeTravail.setParams ({
                        "timer" : false,
                        "idStp" : stp
                    });
                    //ferme la classe ResetTempsdeTravail
                    $A.enqueueAction(vUpdateTempsdeTravail);
                    //lance la fonction stop
                    stop();
                }
            }
            //fonction stop
            function stop(){
                //stop le timer
                x.stop();
                //déclaration d'une variable element
                var element;
                //récupere le composant button
                element = component.find("button");
                //cache le bouton pause
                $A.util.removeClass(element, 'pause');
                //affiche le bouton start
                $A.util.addClass(element, 'start');
                //déclaration d'une variable element1
                var element1;
                //recupère le composant start
                element1 = component.find("start");
                //cache le bouton pause
                $A.util.removeClass(element1, 'slds-buttonstop');
                //affiche le bouton start
                $A.util.addClass(element1, 'slds-buttonstart');
                //modifier la valeur dans valuestart par Start
                component.set("v.vValue","Start");
                //rénitiliase le timer
                clearInterval(clocktimer);
            }
            //lance la fonction stp
            stp(vticket);
        }
        //si la valeur recupérer est égal a Oui
        if(vid === "Yes"){
            //fonction ticketverouille
            function ticketverouille(ticket){
                //execute la classe ticketverouiller
                var vTicketVerouiller = component.get("c.ticketverouiller");
                if(typeof vTicketVerouiller != 'undefined'){
                    vTicketVerouiller.setParams({
                        "idObject" : ticket
                    });
                    //recupère le resultat
                    vTicketVerouiller.setCallback(this, function(pResponseTicketVerouiller) {
                        //si le résultat est différent de null
                        if(pResponseTicketVerouiller.getReturnValue() != null)
                        {
                            //stock le résultat dans ticketverouiller
                            var ticketverouiller = (pResponseTicketVerouiller.getReturnValue()).split(':');
                            //stock le premiere résultat du tableau dans resulticketverouiller
                            var resulticketverouiller = ticketverouiller[0];
                            //stocke le second résultat du tableau dans user
                            var user = ticketverouiller[1];
                            //stock le troisième résultat du tableau dans duree
                            var duree = ticketverouiller[2];
                            //on récupere le nombre de secondes et on dévise par 60 pour récuperer les min
                            var minutes = Math.floor(duree / 60);
                            //envoie le resultat de l'utilisateur dans la composant v.vUser
                            component.set("v.vUser", user); 
                            //envoie le resultat des minutes dans le composant v.vMinutes
                            component.set("v.vMinutes", minutes);
                            //déclaration de la variable element
                            var element;
                            //recupère le composant ticketverouiller
                            element = component.find("ticketverouiller");
                            //affiche le composant
                            $A.util.removeClass(element, 'valeur');
                            //déclaration d'une variable element1
                            var element1;
                            //on recupere le composant ticketverouiller
                            element1 = component.find("timer");
                            //cache le composant
                            $A.util.addClass(element1, 'valeur');
                            //modifier la valeur dans valuestart par Start
                            component.set("v.vValue","Start");
                            x.stop();
                        } else {
                            //déclaration de la variable element
                            var element;
                            //recupère le composant timer
                            element = component.find("timer");
                            //affiche le composant
                            $A.util.removeClass(element, 'valeur');
                            //modifier la valeur dans valuestart par Stop
                            component.set("v.vValue","Stop");
                            //execution de la fonction stp
                            stp(ticket);
                        }
                    //ferme la classe ticketverouiller
                    });
                    $A.enqueueAction(vTicketVerouiller);
                }
        	}
            //fonction stp
            function stp(ticket){
                //execute la classe getSuiviTime
        		var vGetStp = component.get("c.getSuiviTime");
                if(typeof vGetStp != 'undefined'){
                    vGetStp.setParams({
                        "idObject" : ticket
                    });
                    //récupère le résultat
                    vGetStp.setCallback(this, function(pResponseStp) {
                        //stock le résultat dans la variable vStateStp
                        var vStateStp = pResponseStp.getReturnValue();
                        //stock le résultat dans la varialbe valuestp
                        valuestp = vStateStp;
                        //si le résultat est différent de null
                        if (vStateStp != null) {
                            //lance la fonction updatetimer
                            updatetimer(vStateStp);
                        }
                    });
                    //ferme la classe getSuiviTime
                    $A.enqueueAction(vGetStp);
                }
        	}
            //fonction updatetimer
            function updatetimer(stp){
                //execute la classe ResetTempsdeTravail
                var vUpdateTempsdeTravail = component.get("c.ResetTempsdeTravail");
                if(typeof vUpdateTempsdeTravail != 'undefined'){
                    vUpdateTempsdeTravail.setParams ({
                        "timer" : true,
                        "idStp" : stp
                    });
                    //ferme la classe ResetTempsdeTravail
                    $A.enqueueAction(vUpdateTempsdeTravail);
                    //lance la fonction oui
                    oui();
                }
            }
            //fonction oui
            function oui(){
                //reset du timer
                x.reset();
                //démarre le timer
                x.start();
                //déclaration de la variable element
                var element
                //récuperation du composant
                element = component.find("work");
                //cache le composant
                $A.util.addClass(element, 'valeur');
                //déclaration de la variable element
                var element2;
                //récuperation du composant
                element2 = component.find("timer");
                //affiche le composant
                $A.util.removeClass(element2, 'valeur');
                //modifier la valeur dans valuestart par Stop
                component.set("v.vValue","Stop");
            }
            //lance la fonction ticketverouille
            ticketverouille(vticket);
        }
        //Si la valeur recupérer est égal a Non
        if(vid === "No"){
            //fonction stp
            function stp(ticket){
                //execute la classe getSuiviTime
        		var vGetStp = component.get("c.getSuiviTime");
                if(typeof vGetStp != 'undefined'){
                    vGetStp.setParams({
                        "idObject" : ticket
                    });
                    //recupère le resultat
                    vGetStp.setCallback(this, function(pResponseStp) {
                        //stock le resultat dans la variable vStateStp
                        var vStateStp = pResponseStp.getReturnValue();
                        //stock le resultat dans la variable valuestp
                        valuestp = vStateStp;
                        //si le resultat est différent de null
                        if (vStateStp != null) {
                            //lance la fonction updatetimer
                            updatetimer(vStateStp);
                        }
                    });
                    //ferme la classe getSuiviTime
                    $A.enqueueAction(vGetStp);
                }
        	}
            //fonction updatetimer
            function updatetimer(stp){
                //execute la classe ResetTempsdeTravail
                var vUpdateTempsdeTravail = component.get("c.ResetTempsdeTravail");
            	vUpdateTempsdeTravail.setParams ({
            		"timer" : false,
                 	"idStp" : stp
            	});
                //ferme la classe ResetTempsdeTravail
            	$A.enqueueAction(vUpdateTempsdeTravail);
                //excute la fonction non
                non();
            }
            //fonction non
            function non(){
                //reset le timer
                x.reset();
                //déclaration d'une variable element
                var element;
                //recupere le composant
                element = component.find("work");
                //cache le composant
                $A.util.addClass(element, 'valeur');
                //déclaration d'une variable element1
                var element1;
                //recupere le composant button
                element1 = component.find("button");
                //cache le bouton pause
                $A.util.removeClass(element1, 'pause');
                //affiche le bouton start
                $A.util.addClass(element1, 'start');
                //déclaration d'une variable element2
                var element2;
                //recupere le composant
                element2 = component.find("timer");
                //affiche le composant
                $A.util.removeClass(element2, 'valeur');
                //déclaration d'une variable element3
                var element3;
                //recupere le composant
                element3 = component.find("start");
                //cache le bouton pause
                $A.util.removeClass(element3, 'slds-buttonstop');
                $A.util.removeClass(element3, 'valeur');
                //affiche le bouton start
                $A.util.addClass(element3, 'slds-buttonstart');
                //modifier la valeur dans valuestart par Start
                component.set("v.vValue","Start");
            }
            //lance la fonction stp
			stp(vticket);
        }
    }
})