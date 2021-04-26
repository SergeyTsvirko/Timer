({ 
    //initialisation Automatique
	doInit : function (component, event, helper) {  
        //A l'ouverture recupèrer l'id de l'atelier
		var idObject = component.get("v.recordId");
        var resultequipeautorise;
        //ETAPE 1 : Verification de l'atelier si il est cloturé (1 requete)
		function atelierfermer(atelier){
            console.log('atelierfermer');
            //Execute la classe cloturer (1 Requete SOQL)
        	var vClose = component.get("c.Cloturer");
        	vClose.setParams({
        		"idObject" : atelier
         	});
            //Recupère la valeur retourner par la classe
         	vClose.setCallback(this, function(pClose) {
                // si le résultat est différent de Préparation terminée
         		if (pClose.getReturnValue() != "Préparation terminée") {
                    //Lancer la fonction atelierverouille avec en paramètre l'id de l'atelier
					atelierverouille(atelier);  
            	}
            //on ferme la class cloturer
         	});
         	$A.enqueueAction(vClose);
        //fin de la fonction  
		}
        //ETAPE 2 : Verification si l'atelier est verrouillé par qqun (1 requete)
        function atelierverouille(atelier){
            console.log('atelierverouille');
            //execute la classe atelierverouiller
            var vAtelierVerouiller = component.get("c.atelierverouiller");
            if (typeof vAtelierVerouiller != 'undefined'){
                vAtelierVerouiller.setParams({
                    "idObject" : atelier
                });
                //recupère la valeur retourner par la classe
               vAtelierVerouiller.setCallback(this, function(pResponseAtelierVerouiller) {
                    //si le résultat est différent de null
                    affichageatelierverouille(atelier,pResponseAtelierVerouiller.getReturnValue())
                //on ferme la class ticket verouiller
                });
                $A.enqueueAction(vAtelierVerouiller);
        	}
        }
        function affichageatelierverouille(atelier, resultatelierverouiller){
        	if (resultatelierverouiller != null){
           		//on sépare le resultat retournée dans un tableau
                var atelierverouiller = (resultatelierverouiller.split(':'));
                //on récupére la première valeur du tableau qui contient si un timer est en cours
                var resultatelierverouiller = atelierverouiller[0];
                //on récupére la seconde valeur du tableau qui contient l'utilisateur
                var user = atelierverouiller[1];
                //on récupére la troisième valeur du tableau qui contient la durée de modification
                var duree = atelierverouiller[2];
                //déclaration d'une variable clocktimer
                var clocktimer;
                //on calcule le nombre de minutes a partir de la durée en secondes
                var minutes = Math.floor(duree / 60);
                //envoie le résultat de l'utilisateur dans le composant
                component.set("v.vUser", user); 
                //envoie le résultat des minutes dans le composant
                component.set("v.vMinutes", minutes);
                //on recherche l'element ticketverouiller dans le composant
                var element = component.find("atelierverouiller");
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
                equipeautorise(atelier)
			}
        }
        //ETAPE 2 Verification si l'equipe est autorisé a lancer le timer automatiquement (1 requete)
        function equipeautorise(atelier){
            //execute la classe EquipeParam
            var vEquipeParam = component.get("c.EquipeParam");
            //recupère la valeur retourner par la classe
			vEquipeParam.setCallback(this, function(pEquipeParam) {
                //si le résultat est différent de null
                resultequipeautorise = pEquipeParam.getReturnValue();
                affichageequipeautorise(atelier)
            //on ferme la classe Equipe Param
            });
        	$A.enqueueAction(vEquipeParam);
        }
        function affichageequipeautorise(atelier){
            var id = "FirstStart";
            //Lance le compteur
            if (resultequipeautorise != null) {
            	if (resultequipeautorise != false){ 
            		//on execute la fonction dotimer présent dans le helper
                	helper.doTimer(component, event, atelier, id); 
            	}
            	else {
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
            }
            else {
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
        //on lance la fonction atelier fermer avec en paramètre l'id de l'atelier
        atelierfermer(idObject);
    //fin de la fonction doinit
    },	
    //Action manuel / Clique Bouton Start / Stop
	onClick : function (component, event, helper) {
		debugger;
        //recupere l'id du ticket
       	var idObject = component.get("v.recordId");
		var id = component.get("v.vValue");
        var vid;
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
        //recupere l'id de l'atelier
        var idObject = component.get("v.recordId");
        //lance la fonction principal
        //fonction refresh
        function refresh(atelier){
       		//recupere la classe deverouilleratelier
            var vdeverouilleratelier = component.get('c.deverouilleratelier');
            if (typeof vdeverouilleratelier != 'undefined'){
        		vdeverouilleratelier.setParams({
        			"idObject" : atelier
        		});
                //ferme la classe ticketdeverouilleticket
                $A.enqueueAction(vdeverouilleratelier);
                //recupere le composant ticketverouiller
                var element = component.find("atelierverouiller");
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
                helper.doTimer(component, event, atelier, vid);
            }
         }
         //lance la fonction refresh
         refresh(idObject);
	},

     //Action manuel / Clique Bouton OUI / NON
    //  onWork : function (component, event, helper){
    //     //recupère l'id du ticket
	// 	var idObject = component.get("v.recordId");
    //     //recupere la valeur choisi par l'utilisateur
    //     var id = event.getSource().getLocalId();
    //     var vid;
    //     //si c'est égal a oui
    //     if (id === "Yes") {
    //         //modifier la valeur dans valuestart par Oui
    //          vid = "Yes";
    //     }
    //     //si c'est égal a non
    //     if (id === "No") {
    //         //modifier la valeur dans valuestart par Non
    //          vid = "No";
    //     }
    //     //lance la fonction principal
	// 	helper.doTimer(component, event, idObject, vid);   
    // },
})