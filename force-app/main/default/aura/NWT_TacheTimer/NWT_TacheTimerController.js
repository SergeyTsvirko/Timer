({ 
    //initialisation Automatique
	doInit : function (component, event, helper) {  
        //A l'ouverture recupèrer l'id du tache
		var idObject = component.get("v.recordId");
        var resulttacheverouiller;
        var resultequipeautorise;
        //ETAPE 1 : Verification du tache si il est cloturé (1 requete)
		function tachefermer(tache) {
            //Execute la classe cloturer (1 Requete SOQL)
        	var vClose = component.get("c.Cloturer");
        	vClose.setParams({
        		"idObject" : tache
         	});
            //Recupère la valeur retourner par la classe
         	vClose.setCallback(this, function(pClose) {
                // si le résultat est égal a true
         		if (pClose.getReturnValue() != true) {
                    //Lancer la fonction tacheverouille avec en paramètre l'id du tache
					tacheverouille(tache);  
            	}
            //on ferme la class cloturer
         	});
         	$A.enqueueAction(vClose);
        //fin de la fonction  
		}
        //ETAPE 2 : Verification si le tache est verrouillé par qqun (1 requete)
        function tacheverouille(tache){
            //execute la classe tacheverouiller
            var vTacheVerouiller = component.get("c.tacheverouiller");
            if (typeof vTacheVerouiller != 'undefined'){
                vTacheVerouiller.setParams({
                    "idObject" : tache
                });
                //recupère la valeur retourner par la classe
                vTacheVerouiller.setCallback(this, function(pResponseTacheVerouiller) {
                    //si le résultat est différent de null
                    resulttacheverouiller = pResponseTacheVerouiller.getReturnValue();
                    affichagetacheverouiller(tache);
                //on ferme la class tache verouiller
                });
                $A.enqueueAction(vTacheVerouiller);
        	}
        }
        //fin de la fonction
        function affichagetacheverouiller(tache) {
            if (resulttacheverouiller != null) {
           		//on sépare le resultat retournée dans un tableau
                var tacheverouiller = (resulttacheverouiller.split(':'));
                //on récupére la première valeur du tableau qui contient si un timer est en cours
                var resultacheverouiller = tacheverouiller[0];
                //on récupére la seconde valeur du tableau qui contient l'utilisateur
                var user = tacheverouiller[1];
                //on récupére la troisième valeur du tableau qui contient la durée de modification
                var duree = tacheverouiller[2];
                //déclaration d'une variable clocktimer
                var clocktimer;
                //on calcule le nombre de minutes a partir de la durée en secondes
                var minutes = Math.floor(duree / 60);
                //envoie le résultat de l'utilisateur dans le composant
                component.set("v.vUser", user); 
                //envoie le résultat des minutes dans le composant
                component.set("v.vMinutes", minutes);
                //on recherche l'element tacheverouiller dans le composant
                var element = component.find("tacheverouiller");
                //Afficher le verrouillage du tache 
                //on lui retire la class valeur qui permet d'afficher le composant
                $A.util.removeClass(element, 'valeur');
			} else {
                //on recherche l'element timer dans le composant
                var element = component.find("timer");
                //on lui retire la class valeur qui permet d'afficher le composant
                $A.util.removeClass(element, 'valeur');
                //on lance la fonction equipeautorise avec en paramètre l'id du tache
                equipeautorise(tache);
        	}
        //fin de la fonction   
        }
        //ETAPE 3 Verification si l'equipe est autorisé a lancer le timer automatiquement (1 requete)
        function equipeautorise(tache) {
            //execute la classe EquipeParam
            var vEquipeParam = component.get("c.EquipeParam");
            //recupère la valeur retourner par la classe
			vEquipeParam.setCallback(this, function(pEquipeParam) {
                //si le résultat est différent de null
                resultequipeautorise = pEquipeParam.getReturnValue();
                affichageequipeautorise(tache);
            //on ferme la classe Equipe Param
            });
        	$A.enqueueAction(vEquipeParam);
        }

        function affichageequipeautorise(tache) {
            var id = "FirstStart";
            //Lance le compteur
            if (resultequipeautorise != null) {
            	if (resultequipeautorise != false) { 
            		//on execute la fonction dotimer présent dans le helper
                	helper.doTimer(component, event, tache, id); 
                    //Afficher le bouton START / STOP
            	} else {
                    component.set("v.vTime", "00:00:00");
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
                    component.set("v.vValue","FirstStart");
				}
            } else {
                	component.set("v.vTime", "00:00:00");
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
                    component.set("v.vValue","FirstStart");
            }
        //fin de la fonction 
        }
        //on lance la fonction tache fermer avec en paramètre l'id du tache
        tachefermer(idObject);
    //fin de la fonction doinit
    },	
    //Action manuel / Clique Bouton Start / Stop
	onClick : function (component, event, helper) {
		debugger;
        //recupere l'id du tache
       	var idObject = component.get("v.recordId");
		var id = component.get("v.vValue");
        var vid;
        if (id == "FirstStart") {
            vid = "FirstStart";
        }
        if (id == "Stop") {
            vid = "Stop";
        }
        if (id == "Start") {
            vid = "Start";
        }
        //lance la fonction principal
		helper.doTimer(component, event, idObject, vid);              
	},
    
    //Action manuel / Clique Bouton deverouiller
    onRefresh : function (component, event, helper) {
        //recupere l'id du tache
        var idObject = component.get("v.recordId");
        //lance la fonction principal
        //fonction refresh
        function refresh(tache){
       		//recupere la classe deverouillertache
            var vdeverouillertache = component.get('c.deverouillertache');
            if (typeof vdeverouillertache != 'undefined'){
        		vdeverouillertache.setParams({
        			"idObject" : tache
        		});
                //ferme la classe tachedeverouilletache
                $A.enqueueAction(vdeverouillertache);
                //recupere le composant tacheverouiller
                var element = component.find("tacheverouiller");
                //cache le composant
                $A.util.addClass(element, 'valeur');
                var element1 = component.find("timer");
                //affiche le composant
                $A.util.removeClass(element1, 'valeur');
                var id = component.get("v.vValue");
        		var vid;
        		if (id === "Start") {
                    vid = "Start";
                }
                else {
                	//modifier la valeur dans valuestart par FirstStart
                	vid = "FirstStart"; 
                }
                //relance la fonction principal
                helper.doTimer(component, event, tache, vid);
            }
         }
         //lance la fonction refresh
         refresh(idObject);
	},
    
    //Action manuel / Clique Bouton OUI / NON
    onWork : function (component, event, helper){
        //recupère l'id du tache
		var idObject = component.get("v.recordId");
        //recupere la valeur choisi par l'utilisateur
        var id = event.getSource().getLocalId();
        var vid;
        //si c'est égal a oui
        if (id === "oui") {
            //modifier la valeur dans valuestart par Oui
             vid = "Oui";  
        }
        //si c'est égal a non
        if (id === "non") {
            //modifier la valeur dans valuestart par Non
             vid = "Non";  
        }
        //lance la fonction principal
		helper.doTimer(component, event, idObject, vid);   
    },
})