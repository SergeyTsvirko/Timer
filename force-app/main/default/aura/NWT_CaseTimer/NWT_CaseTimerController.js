({ 
    //initialisation Automatique
	doInit : function (component, event, helper) {
        //When opening, retrieve the ticket ID
		var idObject = component.get("v.recordId");
        var resultticketverouiller;
        var resultequipeautorise;
        //ETAPE 1 : Verification of the ticket if it is closed (1 request)
		function ticketfermer(ticket){
            //Execute la classe cloturer (1 Requete SOQL)
        	var vClose = component.get("c.Cloturer");
        	vClose.setParams({
        		"idObject" : ticket
         	});
            //Get the value returned by the class
         	vClose.setCallback(this, function(pClose) {
                // f the result is equal to true
         		if(pClose.getReturnValue() != true) {
                    //Launch the ticketverouille function with the ticket id as a parameter
					ticketverouille(ticket);
            	}
         	});
         	$A.enqueueAction(vClose);
		}
        //ETAPE 2 : Verification if the ticket is locked by someone (1 request)
        function ticketverouille(ticket){
            //execute the ticketlock class
            var vTicketVerouiller = component.get("c.ticketverouiller");
            if(typeof vTicketVerouiller != 'undefined'){
                vTicketVerouiller.setParams({
                    "idObject" : ticket
                });
                //get the value returned by the class
                vTicketVerouiller.setCallback(this, function(pResponseTicketVerouiller) {
                    //if the result is different from null
                    resultticketverouiller = pResponseTicketVerouiller.getReturnValue();
                    affichageticketverouiller(ticket);
                });
                $A.enqueueAction(vTicketVerouiller);
        	}
        }

        function affichageticketverouiller(ticket){
            if(resultticketverouiller != null){
           		//we separate the returned result in an array
                var ticketverouiller = (resultticketverouiller.split(':'));
                //we retrieve the first value of the array which contains if a timer is in progress
                var resulticketverouiller = ticketverouiller[0];
                //we get the second value of the array which contains the user
                var user = ticketverouiller[1];
                //on récupére la troisième valeur du tableau qui contient la durée de modification
                var duree = ticketverouiller[2];
                //déclaration d'une variable clocktimer
                var clocktimer;
                //on calcule le nombre de minutes a partir de la durée en secondes
                var minutes = Math.floor(duree / 60);
                //envoie le résultat de l'utilisateur dans le composant
                component.set("v.vUser", user);
                //envoie le résultat des minutes dans le composant
                component.set("v.vMinutes", minutes);
                //déclaration d'une variable element
                var element;
                //on recherche l'element ticketverouiller dans le composant
                element = component.find("ticketverouiller");
                //Afficher le verrouillage du ticket
                //on lui retire la class valeur qui permet d'afficher le composant
                $A.util.removeClass(element, 'valeur');
			}
            //sinon
            else{
                //on recherche l'element timer dans le composant
                 var element = component.find("timer");
                //on lui retire la class valeur qui permet d'afficher le composant
                $A.util.removeClass(element, 'valeur');
                //on lance la fonction equipeautorise avec en paramètre l'id du ticket
                equipeautorise(ticket);
        	}
        }
        //ETAPE 3 Verification si l'equipe est autorisé a lancer le timer automatiquement (1 requete)
        function equipeautorise(ticket){
             resultequipeautorise = true;
             affichageequipeautorise(ticket);
            //execute la classe EquipeParam
         /*   var vEquipeParam = component.get("c.EquipeParam");
            //recupère la valeur retourner par la classe
			vEquipeParam.setCallback(this, function(pEquipeParam) {
                //si le résultat est différent de null
                resultequipeautorise = pEquipeParam.getReturnValue();
                affichageequipeautorise(ticket);
            //on ferme la classe Equipe Param
            });
        	$A.enqueueAction(vEquipeParam);*/
        }
        function affichageequipeautorise(ticket){
            var id = "FirstStart";
            //Lance le compteur
            if(resultequipeautorise != null)
            {
            	if(resultequipeautorise != false) { 
            		//on execute la fonction dotimer présent dans le helper
                	helper.doTimer(component, event, ticket, id); 
            	}
            	//Afficher le bouton START / STOP
            	else {
                    component.set("v.vTime", "00:00:00");
                    var element;
                    //récupere le composant button
                    element = component.find("button");
                    //cache le bouton pause
                    $A.util.removeClass(element, 'pause');
                    //affiche le bouton start
                    $A.util.addClass(element, 'start');
                    //get the start component
                    var element1 = component.find("start");
                    //cache le bouton pause
                    $A.util.removeClass(element1, 'slds-buttonstop');
                    //affiche le bouton start
                    $A.util.addClass(element1, 'slds-buttonstart');
                    component.set("v.vValue","FirstStart");
				}
            } else {
                	component.set("v.vTime", "00:00:00");
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
                    component.set("v.vValue","FirstStart");
            }
        //fin de la fonction 
        }
        //on lance la fonction ticket fermer avec en paramètre l'id du ticket
        ticketfermer(idObject);
        
    //fin de la fonction doinit
    },	
    //Action manuel / Clique Bouton Start / Stop
	onClick : function (component, event, helper) {
		debugger;
        //recupere l'id du ticket
       	var idObject = component.get("v.recordId");
		var id = component.get("v.vValue");
        var vid;
        if(id == "FirstStart") {
            vid = "FirstStart";
        }
        if(id == "Stop") {
            vid = "Stop";
        }
        if(id == "Start") {
            vid = "Start";
        }
        //lance la fonction principal
		helper.doTimer(component, event, idObject, vid);              
	},
    
    //Action manuel / Clique Bouton deverouiller
    onRefresh : function (component, event, helper) {
        //recupere l'id du ticket
        var idObject = component.get("v.recordId");
        //lance la fonction principal
        //fonction refresh
        function refresh(ticket){
       		//recupere la classe deverouillerticket
            var vdeverouillerticket = component.get('c.deverouillerticket');
            if(typeof vdeverouillerticket != 'undefined'){
        		vdeverouillerticket.setParams({
        			"idObject" : ticket
        		});
                //ferme la classe ticketdeverouilleticket
                $A.enqueueAction(vdeverouillerticket);
                //déclaration d'un variable element
                var element;
                //recupere le composant ticketverouiller
                element = component.find("ticketverouiller");
                //cache le composant
                $A.util.addClass(element, 'valeur');
                //déclaration d'une variable element1
                var element1;
                element1 = component.find("timer");
                //affiche le composant
                $A.util.removeClass(element1, 'valeur');
                var id = component.get("v.vValue");
        		var vid;
        		if(id === "Start") {
                    vid = "Start";
                } else {
                	//modifier la valeur dans valuestart par FirstStart
                	vid = "FirstStart"; 
                }
                //relance la fonction principal
                helper.doTimer(component, event, ticket, vid);
            }
         }
         //lance la fonction refresh
         refresh(idObject);
	},
    
    //Action manuel / Clique Bouton OUI / NON
    onWork : function (component, event, helper){
        //recupère l'id du ticket
		var idObject = component.get("v.recordId");
        //recupere la valeur choisi par l'utilisateur
        var id = event.getSource().getLocalId();
        var vid;
        //si c'est égal a oui
        if(id === "Yes") {
            //modifier la valeur dans valuestart par Oui
             vid = "Yes";
        }
        //si c'est égal a non
        if(id === "No") {
            //modifier la valeur dans valuestart par Non
             vid = "No";
        }
        //lance la fonction principal
		helper.doTimer(component, event, idObject, vid);   
    },
})