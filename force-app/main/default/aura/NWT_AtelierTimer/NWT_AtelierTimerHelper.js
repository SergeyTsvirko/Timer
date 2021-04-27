({   	
	//fonction timer
    doTimer : function(component, event, vatelier, vid) {
      // 	debugger;
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
  
        if (vid === "FirstStart"){
            //déclaration d'une variable valuestp
            var valueatp;
            //déclaration d'une variable valuenticket
            var valuenatelier;
            //déclaration d'une variable s1 instencié a 0
            var message = "true";
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
            //fonction recuperation du numéro de ticket
            function natelier(atelier) {
                //execute la classe getNAtelier
                var vGetNAtelier = component.get("c.getNAtelier");
                if (typeof vGetNAtelier != 'undefined'){
                    vGetNAtelier.setParams({
                        "idObject" : atelier
                    });
                    //recupère la valeur retourner par la classe
                    vGetNAtelier.setCallback(this, function(pResponseNAtelier) {
                        //met le résultat retourner dans la variable valuenatelier
                        valuenatelier = pResponseNAtelier.getReturnValue();
                    //on ferme la class getNTAtelier
                    });
                    $A.enqueueAction(vGetNAtelier);
                }    
            }
            //fonction crée ou modifier le atp
            function atp(atelier) {
                //execute la classe getSuiviTime
        		var vGetAtp = component.get("c.getSuiviTime");
                if (typeof vGetAtp != 'undefined'){
                    vGetAtp.setParams({
                        "idObject" : atelier
                    });
                    //recupère la valeur retourner par la classe
                    vGetAtp.setCallback(this, function(pResponseAtp) {
                        //recupère le résultat et le stock dans la variable vStateAtp
                        var vStateAtp = pResponseAtp.getReturnValue();
                        //stock aussi le resultat dans la variable valueatp
                        valueatp = vStateAtp;
                        //si le résultat est différent de null
                        if (vStateAtp != null) {
                            //execute la fonction udpateatp avec en paramètre le numéro du atp
                            updateatp(vStateAtp);
                        } else {
                            //execute la fonction createatp avec en paramètre l'id de l'atelier
                            createatp(atelier)
                        }
                    //on ferme la classe getSuiviTime
                    });
                    $A.enqueueAction(vGetAtp);
                }
        	}
            //fonction creation du atp
        	function createatp(atelier) {
                //execute la fonction saveTime
            	var vSaveFunction = component.get("c.saveTime");
                if (typeof vSaveFunction != 'undefined'){
                    vSaveFunction.setParams({
                        "stopwatch" : '00:00:00',
                        "idObject" : atelier
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
            //fonction mise a jour du atp
        	function updateatp(atp) {
                //execute la classe updateAtelierat0
            	var vUpdateFunction = component.get("c.updateAtelierat0");
                if (typeof vUpdateFunction != 'undefined'){
                    vUpdateFunction.setParams({                                     
                        "stopwatch" : '00:00:00',
                        "idAtp" : atp
                    });
                    //on ferme la classe updateAtelierat0
                    $A.enqueueAction(vUpdateFunction);
                    //execute la classe ResetTempsAtelier
                    var vUpdateTempsAtelier = component.get("c.ResetTempsAtelier");
                    if (typeof vUpdateTempsAtelier != 'undefined'){
                        vUpdateTempsAtelier.setParams ({
                            "timer" : true,
                            "idAtp" : atp
                        });
                        //one ferme la classe ResetTempsAtelier
                        $A.enqueueAction(vUpdateTempsAtelier);
                    }
                }
        	}
            //fonction atelierverouiller
            function atelierverouille(atelier) {
                //execute la classe ticketverouiller
                var vAtelierVerouiller = component.get("c.atelierverouiller");
                if (typeof vAtelierVerouiller != 'undefined'){
                    vAtelierVerouiller.setParams({
                        "idObject" : atelier
                    });
                    //recupere le résultat
                    vAtelierVerouiller.setCallback(this, function(pResponseAtelierVerouiller) {
                        //si le résultat est différent de null
                        if (pResponseAtelierVerouiller.getReturnValue() != null) {
                            //déclaration d'une variable avec le résultat récupérer
                            var atelierverouiller = (pResponseAtelierVerouiller.getReturnValue()).split(':');
                            //on recupére le premier champ que l'on met dans la variable resultatelierverouiller
                            var resultatelierverouiller = atelierverouiller[0];
                            //on recupére le deuxième champ que l'on met dans la variable user
                            var user = atelierverouiller[1];
                            //on récupére le troisième champ que l'on met dans la variable duree
                            var duree = atelierverouiller[2];
                            //on récupere le nombre de secondes et on dévise par 60 pour récuperer les min
                            var minutes = Math.floor(duree / 60);
                            //on envoie le résultat de l'utilisateur dans le composant v.vUser
                            component.set("v.vUser", user); 
                            //on envoie le résultat des minutes dans le composant v.vMinute
                            component.set("v.vMinutes", minutes);
                            //on recupere le composant atelierverouiller
                            var element = component.find("atelierverouiller");
                            //on affiche le composant
                            $A.util.removeClass(element, 'valeur');
                            //on recupere le composant timer
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
                    $A.enqueueAction(vAtelierVerouiller);
                }
        	}
            //fonction enregistrement du temps
            function save(time) {
                //déclaration d'une variable vtime avec le temps a enregistré sois 1 min
            	var vTime = "00:01:00";
                //execute la classe updateTimeAtelier
                var vUpdateFunction = component.get("c.updateTimeAtelier");
                if (typeof vUpdateFunction != 'undefined'){
                    vUpdateFunction.setParams({
                        "stopwatch" : vTime,
                         "idAtp" : valueatp
                    });
                    //on ferme la classe updateTimeAtelier
                    $A.enqueueAction(vUpdateFunction);
                }
            }

            // function mnotification(){
            //     //déclaration d'une variable titre avec le contenue du titre pour la notification
            //     var titre = "Travaillez-vous toujours sur le ticket " + valuenatelier + " ?";
            //     //déclaration d'une variable message notification avec le contenue du message
            //     var messagenotification = "Le ticket a été déverrouillé, veuillez cliquer sur \"YES\" dans le timer afin de le reprendre ou \"NON\" afin d’arrêter l'alerte"
            //     //création de la notification
            //     var n = new Notification(titre, {
            //     	body: messagenotification
            //     });
            //     verouille();
            // }

            function verouille() {
                var vVerouille = component.get("c.updateAtelierEncours");
                if (typeof vVerouille != 'undefined'){
                	vVerouille.setParams ({
                    	"timer" : true,
                         "idAtp" : valueatp
                   });
                   //one ferme la classe updateatelierencours
                   $A.enqueueAction(vVerouille);
               }
            }

            // function notification() {
            //     //si le contenue de la variable message est égal a true
            //     if (message === "true"){
            //         //execute la fonction mnotification
            //         mnotification();
            //         //remplace la valeur par false dans la variable message
            //         message = "false";
            //     }
            //     var time2 = component.get("v.vTime");
            //     if (time2 === "00:00:00") {
            //         clearInterval(clockmax);
            //     } else {
            //         //mise en forme du delai de la notification
            //         var delaimax = formatTime(y.time());
            //         //si le delai est égal a 1min
            //         if (delaimax === '00:01:00'){
            //             //on récupère l'id du ticket et on le met dans la variable idObject
            //             var idObject = component.get("v.recordId");
            //             //si type d'objet présent dans idObject est égal a undefined
            //             if (typeof idObject === 'undefined') {
            //                 //stop la fonction notification
            //                 clearInterval(clockmax);
            //             } else {
            //                 //execute la fonction mnotification
            //                 mnotification();
            //                 //reset le timer de la notif
            //                 y.reset();
            //                 //redémarrage du timer
            //                 y.start();
            //              }    
            //         }
            //     }
            // }

            //fonction timer
            // function timemax() {
            //     //arret du timer
            //     x.stop();
            //     //récupére le composant dont l'aura:id est work
            //     var element = component.find("work");
            //     //enleve la classe css valeur ce qui permet d'afficher l'element
            //     $A.util.removeClass(element, 'valeur');
            //     //récupére le composant dont l'aura:id est timer
            //     var element1 = component.find("timer");
            //     //ajoute la classe css valeur ce qui permet de cacher l'element
            //     $A.util.addClass(element1, 'valeur');
            //     //initialise le timer de la notification
            //     clockmax = setInterval(notification, 1);
            //     //démarre le timer
            //     y.start();
            // }

			function timer() {
                //envoie le résultat dans le composant v.vtime ce qui permet l'affichage du temps
        		component.set("v.vTime", formatTime(x.time()));
                //recupere le temps en cours sur le composant v.vtime
                time = component.get("v.vTime");
                // si valuestp est égal null
                if (valueatp == null) {
                    //execute la class getSuiviTime
                	var vGetAtp = component.get("c.getSuiviTime");
                    if (typeof vGetAtp != 'undefined') {
         				vGetAtp.setParams({
            				"idObject" : vatelier
          				});
                        ///recupère la valeur retourner par la classe
                        vGetAtp.setCallback(this, function(pResponseAtp) {
                            //met le résultat retourner dans la variable vStateAtp
                            var vStateAtp = pResponseAtp.getReturnValue();
                            //met aussi le résultat dans valueatp
                            valueatp = vStateAtp;
                        });
                        //ferme la class getSuiviTime
                        $A.enqueueAction(vGetAtp);
                    }
                }
                //si le type contenue dans la varialbe time est différent de undefined
                if (typeof time != "undefined") {
                    //on split le résultat récupérer dans la variable time
					var timer = time.split(':');  
                    //si le temps contenue dans timer[1] est égal a newtime
                	if (newtime == timer[1]) {
                        //si le timer[1] est inférieur a 9
                		if ((timer[1] >= 1 && timer[1] < 9) || (timer[1] >= 10 && timer[1] <19) || (timer[1] >= 20 && timer[1] <29) || (timer[1] >= 30 && timer[1] <39) || (timer[1] >= 40 && timer[1] <49) || (timer[1] >= 50 && timer[1] <59)){
                            //on incrémente la variable s2
                    		s2 = s2 + 1;
                            //on met a jour la variable newtime
                        	newtime = pad(s1, 1) + pad(s2, 1);
                            save(time);
                            atelierverouille(vatelier);
                    	}
                        //si le timer[1] est égal a 9
                    	if ((timer[1] == 9) || (timer[1] == 19) || (timer[1] == 29) || (timer[1] == 39) || (timer[1] == 49)){
                        	//on met la variable s1 a 1 et la variable s2 a 0
                    		s1 = s1 + 1;
                        	s2 = 0;
                            //on met a jour la variable newtime
                       		newtime = pad(s1, 1) + pad(s2, 1);
                            save(time);
                            atelierverouille(vatelier);
                    	}
                        if (timer[1] == 59) {
                            //on met la variable s1 a 0 et la variable s2 a 1
                    		s1 = 0;
                        	s2 = 1;
                            //on met a jour la variable newtime
                        	newtime = pad(s1, 1) + pad(s2, 1);
                            save(time);
                            atelierverouille(vatelier);
                            //message = "true";
                            //timemax();
                        }
                        //si le timer[1] est égal a 20
                    	if (timer[1] == 0) {
                            //on met la variable s1 a 0 et la variable s2 a 1
                    		s1 = 0;
                        	s2 = 1;
                            //on met a jour la variable newtime
                        	newtime = pad(s1, 1) + pad(s2, 1);
                            save(time);
                            atelierverouille(vatelier);
                    	}
                        //lance la fonction save
                    } 
                } else {
                    //stop la fonction timer
                	clearInterval(clocktimer);
                }
        	}
          
            atp(vatelier);
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
            //fonction atelierverouiller
            function atelierverouille(atelier) {
                //execute la classe ticketverouiller
                var vAtelierVerouiller = component.get("c.atelierverouiller");
                if (typeof vAtelierVerouiller != 'undefined'){
                    vAtelierVerouiller.setParams({
                        "idObject" : atelier
                    });
                    //recupere le résultat
                    vAtelierVerouiller.setCallback(this, function(pResponseAtelierVerouiller) {
                        //si le résultat est différent de null
                        if (pResponseAtelierVerouiller.getReturnValue() != null) {
                            //déclaration d'une variable avec le résultat récupérer
                            var atelierverouiller = (pResponseAtelierVerouiller.getReturnValue()).split(':');
                            //on recupére le premier champ que l'on met dans la variable resultatelierverouiller
                            var resultatelierverouiller = atelierverouiller[0];
                            //on recupére le deuxième champ que l'on met dans la variable user
                            var user = atelierverouiller[1];
                            //on récupére le troisième champ que l'on met dans la variable duree
                            var duree = atelierverouiller[2];
                            //on récupere le nombre de secondes et on dévise par 60 pour récuperer les min
                            var minutes = Math.floor(duree / 60);
                            //on envoie le résultat de l'utilisateur dans le composant v.vUser
                            component.set("v.vUser", user); 
                            //on envoie le résultat des minutes dans le composant v.vMinute
                            component.set("v.vMinutes", minutes);
                            //on recupere le composant atelierverouiller
                            var element = component.find("atelierverouiller");
                            //on affiche le composant
                            $A.util.removeClass(element, 'valeur');
                            //on recupere le composant timer
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
                            atp(atelier);
                    	}
                    //ferme la class getSuiviTime    
                    });
                    $A.enqueueAction(vAtelierVerouiller);
                }
        	}
            //fonction crée ou modifier le atp
            function atp(atelier) {
                //execute la classe getSuiviTime
        		var vGetAtp = component.get("c.getSuiviTime");
                if (typeof vGetAtp != 'undefined'){
                    vGetAtp.setParams({
                        "idObject" : atelier
                    });
                    //recupère la valeur retourner par la classe
                    vGetAtp.setCallback(this, function(pResponseAtp) {
                        //recupère le résultat et le stock dans la variable vStateAtp
                        var vStateAtp = pResponseAtp.getReturnValue();
                        //stock aussi le resultat dans la variable valueatp
                        valueatp = vStateAtp;
                        //si le résultat est différent de null
                        if (vStateAtp != null) {
                            //execute la fonction udpateatp avec en paramètre le numéro du atp
                            updateatp(vStateAtp);
                        }
                    //on ferme la classe getSuiviTime
                    });
                    $A.enqueueAction(vGetAtp);
                }
        	}
            //fonction updatimer
            function updateatp(atp) {
                //execute la classe ResetTempsAtelier
                var vUpdateTempsAtelier = component.get("c.ResetTempsAtelier");
                if (typeof vUpdateTempsAtelier != 'undefined'){
                        vUpdateTempsAtelier.setParams ({
                            "timer" : true,
                            "idAtp" : atp
                        });
                        //one ferme la classe ResetTempsAtelier
                        $A.enqueueAction(vUpdateTempsAtelier);
                    //lance la fonction start
                    start();
                }
            }

            function start() {
                //démarre le timer
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
            //lance la fonction ticketverouille
			atelierverouille(vatelier);
        }
        //si la valeur recupérer est égal a Stop
        if (vid === "Stop") {
            function atp(atelier){
                //execute la classe getSuiviTime
        		var vGetAtp = component.get("c.getSuiviTime");
                if (typeof vGetAtp != 'undefined'){
                    vGetAtp.setParams({
                        "idObject" : atelier
                    });
                    //recupère la valeur retourner par la classe
                    vGetAtp.setCallback(this, function(pResponseAtp) {
                        //recupère le résultat et le stock dans la variable vStateAtp
                        var vStateAtp = pResponseAtp.getReturnValue();
                        //stock aussi le resultat dans la variable valueatp
                        valueatp = vStateAtp;
                        //si le résultat est différent de null
                        if (vStateAtp != null) {
                            //execute la fonction udpateatp avec en paramètre le numéro du atp
                            updateatp(vStateAtp);
                        }
                    //on ferme la classe getSuiviTime
                    });
                    $A.enqueueAction(vGetAtp);
                }
        	}
            //fonction updatimer
            function updateatp(atp) {
                //execute la classe ResetTempsAtelier
                var vUpdateTempsAtelier = component.get("c.ResetTempsAtelier");
                if (typeof vUpdateTempsAtelier != 'undefined'){
                        vUpdateTempsAtelier.setParams ({
                            "timer" : false,
                            "idAtp" : atp
                        });
                        //one ferme la classe ResetTempsAtelier
                        $A.enqueueAction(vUpdateTempsAtelier);
                    //lance la fonction start
                    stop();
                }
            }
            //fonction stop
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
            //lance la fonction atp
            atp(vatelier);
        } 
    }
})