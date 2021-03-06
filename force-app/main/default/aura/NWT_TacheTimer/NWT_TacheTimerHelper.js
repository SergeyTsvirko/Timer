({   	
	//fonction timer
    doTimer : function(component, event, vtache, vid) 
    {
       	debugger;
        //déclaration d'une variable clocktimer
        var clocktimer;
        //déclaration d'une variable clockmax
        var clockmax;
        //déclaration d'une variable time
        var time;
        var	clsStopwatch = function() {
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
        if (vid === "FirstStart") {
            //déclaration d'une variable valuestp
            var valuestp;
            //déclaration d'une variable valuentache
            var valuentache;
            //déclaration d'une variable message instencié a true
            var message = "true";
            //déclaration d'une variable s1 instencié a 0
            var s1 = 0;
            //déclaration d'une variable s2 instencié a 1
            var s2 = 1;
            //déclaration d'une variable newtime qui va permettre de comparer le temps
            var newtime = pad(s1, 1) + pad(s2, 1);
            //recupére le composant button
            var element = component.find("button");
            //cache le bouton start
            $A.util.removeClass(element, 'start');
            //affiche le button pause
            $A.util.addClass(element, 'pause');
            //recupére le composant start
            var element1 = component.find("start");
            //cache le bouton start
            $A.util.removeClass(element1, 'slds-buttonstart');
            //affiche le bouton stop
            $A.util.addClass(element1, 'slds-buttonstop');
            //fonction recuperation du numéro de tache

            function ntache(tache) {
                //execute la classe getNTache
                var vGetNTache = component.get("c.getNTache");
                if (typeof vGetNTache != 'undefined'){
                    vGetNTache.setParams({
                        "idObject" : tache
                    });
                    //recupère la valeur retourner par la classe
                    vGetNTache.setCallback(this, function(pResponseNTache) {
                        //met le résultat retourner dans la variable valuentache
                        valuentache = pResponseNTache.getReturnValue();
                    //on ferme la class getNTache
                    });
                    $A.enqueueAction(vGetNTache);
                }    
            }
            //fonction crée ou modifier le stp
            function stp(tache) {
                //execute la classe getSuiviTime
        		var vGetStp = component.get("c.getSuiviTime");
                if (typeof vGetStp != 'undefined') {
                    vGetStp.setParams({
                        "idObject" : tache
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
                        } else {
                            //execute la fonction createstp avec en paramètre l'id du tache
                            createstp(tache)
                        }
                    //on ferme la classe getSuiviTime
                    });
                    $A.enqueueAction(vGetStp);
                }
        	}
            //fonction creation du stp
        	function createstp(tache) {
                //execute la fonction saveTime
            	var vSaveFunction = component.get("c.saveTime");
                if (typeof vSaveFunction != 'undefined'){
                    vSaveFunction.setParams({
                        "stopwatch" : '00:00:00',
                        "idObject" : tache
                    });
                    var self = this;
                    //recupère la valeur retourner par la classe
                    vSaveFunction.setCallback(this, function(pResponse) {
                        //recupère l'etat du résultat et le stock dans la variable vState
                        var vState = pResponse.getState(); 
                    //on ferme la classe saveTime
                    });
                    $A.enqueueAction(vSaveFunction);
                }
        	}
            //fonction mise a jour du stp
        	function updatestp(stp) {
                //execute la classe updateTimeat0
            	var vUpdateFunction = component.get("c.updateTimeat0");
                if (typeof vUpdateFunction != 'undefined'){
                    vUpdateFunction.setParams({                                     
                        "stopwatch" : '00:00:00',
                        "idStp" : stp
                    });
                    //on ferme la classe updateTimeat0
                    $A.enqueueAction(vUpdateFunction);
                    //execute la classe ResetTempsdeTravail
                    var vUpdateTempsdeTravail = component.get("c.ResetTempsdeTravail");
                    if (typeof vUpdateTempsdeTravail != 'undefined'){
                        vUpdateTempsdeTravail.setParams ({
                            "timer" : true,
                            "idStp" : stp
                        });
                        //one ferme la classe ResetTempsdeTravail
                        $A.enqueueAction(vUpdateTempsdeTravail);
                    }
                }
        	}

        	function tacheverouille(tache) {
                //execute la classe tacheverouiller
                var vTacheVerouiller = component.get("c.tacheverouiller");
                if (typeof vTacheVerouiller != 'undefined'){
                    vTacheVerouiller.setParams({
                        "idObject" : tache
                    });
                    //recupere le résultat
                    vTacheVerouiller.setCallback(this, function(pResponseTacheVerouiller) {
                        //si le résultat est différent de null
                        if (pResponseTacheVerouiller.getReturnValue() != null) {
                            //déclaration d'une variable avec le résultat récupérer
                            var tacheverouiller = (pResponseTacheVerouiller.getReturnValue()).split(':');
                            //on recupére le premier champ que l'on met dans la variable resultacheverouiller
                            var resultacheverouiller = tacheverouiller[0];
                            //on recupére le deuxième champ que l'on met dans la variable user
                            var user = tacheverouiller[1];
                            //on récupére le troisième champ que l'on met dans la variable duree
                            var duree = tacheverouiller[2];
                            //on récupere le nombre de secondes et on dévise par 60 pour récuperer les min
                            var minutes = Math.floor(duree / 60);
                            //on envoie le résultat de l'utilisateur dans le composant v.vUser
                            component.set("v.vUser", user); 
                            //on envoie le résultat des minutes dans le composant v.vMinute
                            component.set("v.vMinutes", minutes);
                            //on recupere le composant tacheverouiller
                            var element = component.find("tacheverouiller");
                            //on affiche le composant
                            $A.util.removeClass(element, 'valeur');
                            //on recupere le composant tacheverouiller
                            var element1 = component.find("timer");
                            //cache le composant
                            $A.util.addClass(element1, 'valeur');
                            //modifier la valeur dans valuestart par Start
                            component.set("v.vValue","Start");
                            x.stop();
                    	} else {
                            //on recupere le composant timer
                            var element = component.find("timer");
                            //on affiche le composant
                            $A.util.removeClass(element, 'valeur');
                            //on lance la fonction stp
                            //modifier la valeur dans valuestart par Stop
                            component.set("v.vValue","Stop");
                            verouille();
                    	}
                    //ferme la class getSuiviTime    
                    });
                    $A.enqueueAction(vTacheVerouiller);
                }
        	}
            //fonction enregistrement du temps
            function save(time) {
                //déclaration d'une variable vtime avec le temps a enregistré sois 1 min
            	var vTime = "00:01:00";
                //execute la classe updateTime
                var vUpdateFunction = component.get("c.updateTime");
                if (typeof vUpdateFunction != 'undefined'){
                    vUpdateFunction.setParams({
                        "stopwatch" : vTime,
                         "idStp" : valuestp
                    });
                    //on ferme la classe updateTime
                    $A.enqueueAction(vUpdateFunction);
                }
            }
            //fonction message pour la notification
            function mnotification() {
                //déclaration d'une variable titre avec le contenue du titre pour la notification
                var titre = "Travaillez-vous toujours sur cette tâche " + valuentache + " ?";
                //déclaration d'une variable message notification avec le contenue du message
                var messagenotification = "La tâche a été déverrouillée, veuillez cliquer sur \"OUI\" dans le timer afin de le reprendre ou \"NON\" afin d’arrêter l'alerte"    
                //création de la notification
                var n = new Notification(titre, {
                	body: messagenotification
                });
                verouille();
            }

            function verouille() {
                var vVerouille = component.get("c.updateTimerEncours");
                if (typeof vVerouille != 'undefined'){
                	vVerouille.setParams ({
                    	"timer" : true,
                         "idStp" : valuestp
                   });
                   //one ferme la classe updatetimerencours
                   $A.enqueueAction(vVerouille);
               }
            }
       
            function notification() {
                //si le contenue de la variable message est égal a true
                if (message === "true"){
                    //execute la fonction mnotification
                    mnotification();
                    //remplace la valeur par false dans la variable message
                    message = "false";
                }
                var time2 = component.get("v.vTime");
                if (time2 === "00:00:00") {
                    clearInterval(clockmax);
                } else {
                    //mise en forme du delai de la notification
                    var delaimax = formatTime(y.time());
                    //si le delai est égal a 1min
                    if (delaimax === '00:01:00'){
                        //on récupère l'id du tache et on le met dans la variable idObject
                        var idObject = component.get("v.recordId");
                        //si type d'objet présent dans idObject est égal a undefined
                        if (typeof idObject === 'undefined') {
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
         
            function timemax() {
                //arret du timer
                x.stop();
                //récupére le composant dont l'aura:id est work
                var element = component.find("work");
                //enleve la classe css valeur ce qui permet d'afficher l'element
                $A.util.removeClass(element, 'valeur');
                //récupére le composant dont l'aura:id est timer
                var element1 = component.find("timer");
                //ajoute la classe css valeur ce qui permet de cacher l'element
                $A.util.addClass(element1, 'valeur');
                //initialise le timer de la notification
                clockmax = setInterval(notification, 1);
                //démarre le timer
                y.start();
            }
       
			function timer() {
                //envoie le résultat dans le composant v.vtime ce qui permet l'affichage du temps
        		component.set("v.vTime", formatTime(x.time()));
                //recupere le temps en cours sur le composant v.vtime
                time = component.get("v.vTime");
                // si valuestp est égal null
                if (valuestp == null) {
                    //execute la class getSuiviTime
                	var vGetStp = component.get("c.getSuiviTime");
                    if(typeof vGetStp != 'undefined') {
         				vGetStp.setParams({
            				"idObject" : vtache
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
                if (typeof time != "undefined") {
                    //on split le résultat récupérer dans la variable time
					var timer = time.split(':');  
                    //si le temps contenue dans timer[1] est égal a newtime
                    var hh = 0;
                	if (newtime == timer[1] || hh == 1) {
                        //si le timer[1] est inférieur a 9
                		if (timer[1] < 9) {
                            //on incrémente la variable s2
                    		s2 = s2 + 1;
                            //on met a jour la variable newtime
                        	newtime = pad(s1, 1) + pad(s2, 1);
                            save(time);
                            tacheverouille(vtache);
                    	}
                        //si le timer[1] est égal a 9
                    	if (timer[1] == 9) {
                        	//on met la variable s1 a 1 et la variable s2 a 0
                    		s1 = 1;
                        	s2 = 0;
                            //on met a jour la variable newtime
                       		newtime = pad(s1, 1) + pad(s2, 1);
                            save(time);
                            tacheverouille(vtache);
                    	}
                        //si le timer[1] est supérieu ou égal a 10 mais inférieur a 19
                    	if ((timer[1] >= 10) && (timer[1] < 19)) {
                            //on incrémente la variable s2
                    		s2 = s2 + 1;
                            //on met a jour la variable newtime
                    		newtime = pad(s1, 1) + pad(s2, 1);
                            save(time);
                            tacheverouille(vtache);
                    	}
                        //si le timer[1] est égal a 19
                        if (timer[1] == 19) {
                        	//on met la variable s1 a 1 et la variable s2 a 0
                    		s1 = 2;
                        	s2 = 0;
                            //on met a jour la variable newtime
                       		newtime = pad(s1, 1) + pad(s2, 1);
                            save(time);
                            tacheverouille(vtache);
                    	}
                        //si le timer[1] est supérieu ou égal a 20 mais inférieur a 29
                    	if ((timer[1] >= 20) && (timer[1] < 29)) {
                            //on incrémente la variable s2
                    		s2 = s2 + 1;
                            //on met a jour la variable newtime
                    		newtime = pad(s1, 1) + pad(s2, 1);
                            save(time);
                            tacheverouille(vtache);
                    	}
                        //si le timer[1] est égal a 29
                        if (timer[1] == 29) {
                        	//on met la variable s1 a 1 et la variable s2 a 0
                    		s1 = 3;
                        	s2 = 0;
                            //on met a jour la variable newtime
                       		newtime = pad(s1, 1) + pad(s2, 1);
                            save(time);
                            tacheverouille(vtache);
                    	}
                        //si le timer[1] est supérieu ou égal a 30 mais inférieur a 39
                    	if ((timer[1] >= 30) && (timer[1] < 39)) {
                            //on incrémente la variable s2
                    		s2 = s2 + 1;
                            //on met a jour la variable newtime
                    		newtime = pad(s1, 1) + pad(s2, 1);
                            save(time);
                            tacheverouille(vtache);
                    	}
                        //si le timer[1] est égal a 39
                        if (timer[1] == 39) {
                        	//on met la variable s1 a 1 et la variable s2 a 0
                    		s1 = 4;
                        	s2 = 0;
                            //on met a jour la variable newtime
                       		newtime = pad(s1, 1) + pad(s2, 1);
                            save(time);
                            tacheverouille(vtache);
                    	}
                        //si le timer[1] est supérieu ou égal a 40 mais inférieur a 49
                    	if ((timer[1] >= 40) && (timer[1] < 49)) {
                            //on incrémente la variable s2
                    		s2 = s2 + 1;
                            //on met a jour la variable newtime
                    		newtime = pad(s1, 1) + pad(s2, 1);
                            save(time);
                            tacheverouille(vtache);
                    	}
                        //si le timer[1] est égal a 49
                        if (timer[1] == 49) {
                        	//on met la variable s1 a 1 et la variable s2 a 0
                    		s1 = 5;
                        	s2 = 0;
                            //on met a jour la variable newtime
                       		newtime = pad(s1, 1) + pad(s2, 1);
                            save(time);
                            tacheverouille(vtache);
                    	}
                        //si le timer[1] est supérieu ou égal a 50 mais inférieur a 59
                    	if ((timer[1] >= 50) && (timer[1] < 59)) {
                            //on incrémente la variable s2
                    		s2 = s2 + 1;
                            //on met a jour la variable newtime
                    		newtime = pad(s1, 1) + pad(s2, 1);
                            save(time);
                            tacheverouille(vtache);
                    	}
                        //si le timer[1] est égal a 59
                    	// if (timer[1] == 59) {
                        //     //on met la variable s1 a 2 et la variable s2 a 0
                    	// 	s1 = 0;
                    	// 	s2 = 1;
                        //     //on met a jour la variable newtime
                    	// 	newtime = pad(s1, 1) + pad(s2, 1);
                        //     save(time);
                    	// 	//ntache(vtache);
                        //     //tacheverouille(vtache);
                        //     message = "true";
                        //     timemax();
                        // }
                        //lance la fonction save
                    } 
                } else {
                    //stop la fonction timer
                	clearInterval(clocktimer);
                }
        	}
            //lance la fonction stp
            stp(vtache);
            //modifier la valeur dans valuestart par stop
            component.set("v.vValue","Stop");
           	if (!stopwatch) {
        		component.set("v.stopwatch", x);
        	}
            //initialise la fonction timer
            clocktimer = setInterval(timer, 1);
            //lance la fonction timer
            x.start();
        }
        //si la valeur recupérer est égal a Start
        if (vid === "Start") {
            //déclaration d'une variable s1 instencié a 0
            var s1 = 0;
            //déclaration d'une variable s2 instencié a 1
            var s2 = 1;
            //déclaration d'une variable newtime qui va permettre de comparer le temps
            var newtime = pad(s1, 1) + pad(s2, 1);
            //fonction tacheverouiller
        	function tacheverouille(tache) {
                //execute la classe tacheverouiller
                var vTacheVerouiller = component.get("c.tacheverouiller");
                if (typeof vTacheVerouiller != 'undefined') {
                	vTacheVerouiller.setParams({
                    	"idObject" : tache
                	});
                    //recupere le résultat
                	vTacheVerouiller.setCallback(this, function(pResponseTacheVerouiller) {
                    	//si le résultat est différent de null
                    	if (pResponseTacheVerouiller.getReturnValue() != null) {
                            //déclaration d'une variable avec le résultat récupérer
                            var tacheverouiller = (pResponseTacheVerouiller.getReturnValue()).split(':');
                            //on recupére le premier champ que l'on met dans la variable resultacheverouiller
                            var resultacheverouiller = tacheverouiller[0];
                            //on recupére le deuxième champ que l'on met dans la variable user
                            var user = tacheverouiller[1];
                            //on récupére le troisième champ que l'on met dans la variable duree
                            var duree = tacheverouiller[2];
                            //on récupere le nombre de secondes et on dévise par 60 pour récuperer les min
                            var minutes = Math.floor(duree / 60);
                            //on envoie le résultat de l'utilisateur dans le composant v.vUser
                            component.set("v.vUser", user); 
                            //on envoie le résultat des minutes dans le composant v.vMinute
                            component.set("v.vMinutes", minutes);
                            //on recupere le composant tacheverouiller
                            var element = component.find("tacheverouiller");
                            //on affiche le composant
                            $A.util.removeClass(element, 'valeur');
                            //on recupere le composant tacheverouiller
                            var element1 = component.find("timer");
                            //cache le composant
                            $A.util.addClass(element1, 'valeur');
                            //modifier la valeur dans valuestart par Start
                            component.set("v.vValue","Start");
                            x.stop();
                    	} else {
                            //on recupere le composant timer
                            var element = component.find("timer");
                            //on affiche le composant
                            $A.util.removeClass(element, 'valeur');
                            //on lance la fonction stp
                            stp(tache);
                            //modifier la valeur dans valuestart par Stop
                            component.set("v.vValue","Stop");
                        }
                    //ferme la class getSuiviTime    
                    });
                    $A.enqueueAction(vTacheVerouiller);
                }
        	}

            function stp(tache) {
                //execute la classe getSuiviTime
        		var vGetStp = component.get("c.getSuiviTime");
                if (typeof vGetStp != 'undefined'){
                    vGetStp.setParams({
                        "idObject" : tache
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
          
            function updatetimer(stp) {
                //execute la classe ResetTempsdeTravail
                var vUpdateTempsdeTravail = component.get("c.ResetTempsdeTravail");
                if (typeof vUpdateTempsdeTravail != 'undefined'){
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
      
            function start() {
                //démarre le timer
                x.reset();
                x.start();
                //recupére le composant button
                var element = component.find("button");
                //cache le bouton start
                $A.util.removeClass(element, 'start');
                //affiche le button pause
                $A.util.addClass(element, 'pause');
                //recupére le composant start
                var element1 = component.find("start");
                //cache le bouton start
                $A.util.removeClass(element1, 'slds-buttonstart');
                //affiche le bouton stop
                $A.util.addClass(element1, 'slds-buttonstop');
            }
            //lance la fonction tacheverouille
			tacheverouille(vtache);
        }
        //si la valeur recupérer est égal a Stop
        if (vid === "Stop") {
            //fonction stp
            function stp(tache){
                //execute la classe getSuiviTime
        		var vGetStp = component.get("c.getSuiviTime");
                if (typeof vGetStp != 'undefined'){
                    vGetStp.setParams({
                        "idObject" : tache
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

            function updatetimer(stp) {
                //execute la classe ResetTempsdeTravail
                var vUpdateTempsdeTravail = component.get("c.ResetTempsdeTravail");
                if (typeof vUpdateTempsdeTravail != 'undefined'){
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
         
            function stop() {
                //stop le timer
                x.stop();
                //récupere le composant button
                var element = component.find("button");
                //cache le bouton pause
                $A.util.removeClass(element, 'pause');
                //affiche le bouton start
                $A.util.addClass(element, 'start');
                //recupère le composant start
                var element1 = component.find("start");
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
            stp(vtache);
        }
        //si la valeur recupérer est égal a Oui
        if (vid === "Oui") {
            //fonction tacheverouille
            function tacheverouille(tache){
                //execute la classe tacheverouiller
                var vTacheVerouiller = component.get("c.tacheverouiller");
                if (typeof vTacheVerouiller != 'undefined') {
                    vTacheVerouiller.setParams({
                        "idObject" : tache
                    });
                    //recupère le resultat
                    vTacheVerouiller.setCallback(this, function(pResponseTacheVerouiller) {
                        //si le résultat est différent de null
                        if (pResponseTacheVerouiller.getReturnValue() != null) {
                            //stock le résultat dans tacheverouiller
                            var tacheverouiller = (pResponseTacheVerouiller.getReturnValue()).split(':');
                            //stock le premiere résultat du tableau dans resultacheverouiller
                            var resultacheverouiller = tacheverouiller[0];
                            //stocke le second résultat du tableau dans user
                            var user = tacheverouiller[1];
                            //stock le troisième résultat du tableau dans duree
                            var duree = tacheverouiller[2];
                            //on récupere le nombre de secondes et on dévise par 60 pour récuperer les min
                            var minutes = Math.floor(duree / 60);
                            //envoie le resultat de l'utilisateur dans la composant v.vUser
                            component.set("v.vUser", user); 
                            //envoie le resultat des minutes dans le composant v.vMinutes
                            component.set("v.vMinutes", minutes);
                            //recupère le composant tacheverouiller
                            var element = component.find("tacheverouiller");
                            //affiche le composant
                            $A.util.removeClass(element, 'valeur');
                            //on recupere le composant tacheverouiller
                            var element1 = component.find("timer");
                            //cache le composant
                            $A.util.addClass(element1, 'valeur');
                            //modifier la valeur dans valuestart par Start
                            component.set("v.vValue","Start");
                            x.stop();
                        } else {
                            //recupère le composant timer
                            var element = component.find("timer");
                            //affiche le composant
                            $A.util.removeClass(element, 'valeur');
                            //modifier la valeur dans valuestart par Stop
                            component.set("v.vValue","Stop");
                            //execution de la fonction stp
                            stp(tache);
                        }
                    //ferme la classe tacheverouiller
                    });
                    $A.enqueueAction(vTacheVerouiller);
                }
        	}
      
            function stp(tache) {
                //execute la classe getSuiviTime
        		var vGetStp = component.get("c.getSuiviTime");
                if (typeof vGetStp != 'undefined'){
                    vGetStp.setParams({
                        "idObject" : tache
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
         
            function updatetimer(stp) {
                //execute la classe ResetTempsdeTravail
                var vUpdateTempsdeTravail = component.get("c.ResetTempsdeTravail");
                if (typeof vUpdateTempsdeTravail != 'undefined') {
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
         
            function oui() {
                //reset du timer
                x.reset();
                //démarre le timer
                x.start();
                //récuperation du composant
                var element = component.find("work");
                //cache le composant
                $A.util.addClass(element, 'valeur');
                //récuperation du composant
                var element2 = component.find("timer");
                //affiche le composant
                $A.util.removeClass(element2, 'valeur');
                //modifier la valeur dans valuestart par Stop
                component.set("v.vValue","Stop");
            }
            //lance la fonction tacheverouille
            tacheverouille(vtache);
        }
        //Si la valeur recupérer est égal a Non
        if (vid === "Non") {
            function stp(tache) {
                //execute la classe getSuiviTime
        		var vGetStp = component.get("c.getSuiviTime");
                if (typeof vGetStp != 'undefined'){
                    vGetStp.setParams({
                        "idObject" : tache
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
   
            function updatetimer(stp) {
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
     
            function non() {
                //reset le timer
                x.reset();
                //recupere le composant
                var element = component.find("work");
                //cache le composant
                $A.util.addClass(element, 'valeur');
                //recupere le composant button
                var element1 = component.find("button");
                //cache le bouton pause
                $A.util.removeClass(element1, 'pause');
                //affiche le bouton start
                $A.util.addClass(element1, 'start');
                //recupere le composant
                var element2 = component.find("timer");
                //affiche le composant
                $A.util.removeClass(element2, 'valeur');
                //recupere le composant
                var element3 = component.find("start");
                //cache le bouton pause
                $A.util.removeClass(element3, 'slds-buttonstop');
                //affiche le bouton start
                $A.util.addClass(element3, 'slds-buttonstart');
                //modifier la valeur dans valuestart par Start
                component.set("v.vValue","Start");
            }
    
			stp(vtache);
        }
    }
})