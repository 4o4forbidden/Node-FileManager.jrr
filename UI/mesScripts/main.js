var cheminActuel = '/Dossier';
var dossierContent = [];

$(document).ready(()=>{
    rvDossierContent(cheminActuel);
})

function rvDossierContent(chemin){
    axios.get(`http://localhost:3000/rvFichiers?chemin=${chemin}`).then((files)=>{
        cheminActuel = files.data.dossierChemin;
        dossierContent = files.data.dossierContent;
        $('ol.breadcrumb.racine').html('')
        for(i of files.data.dossierChemin.split('/')){
            $('ol.breadcrumb.racine').append(`<li class="breadcrumb-item"><a href="#">${i}</a></li>`);
        }

        $('.files').html('');
        for (i of files.data.dossierContent){
            if(i != 'null') $('.files').append(`<span class="element ${i.split('.').length == 1 ? 'dossier' : `fichier ${i.split('.').at(-1)}`} "> ${i} </span>`)
        }
        initControls();  

        if(dossierContent.length == 0){
            $('.files').html('<div class="empty">Dossier Vide</div>');
        }
        console.log(dossierContent);
    })
}


function initControls(){
    $('.dossier.selectedFile').click(function(){
        rvDossierContent(cheminActuel+'/'+$(this).text().trim())
    })

    $('.element').click(function(){
        $('.element').removeClass('selectedFile');
        $(this).addClass('selectedFile');
        initControls();
    })

    $('.racine .breadcrumb-item').click(function(){
        rvDossierContent(cheminActuel.split('/').slice(0,$(this).index()+1).join('/'))
    })

    $('.element').draggable({
        drag: function( event, ui ) {
            $(this).addClass('selectedFile');
        }
    });

    $('.dossier').droppable({
        drop: function( event, ui ) {
            cheminElement = cheminActuel + '/' + $('.selectedFile').text().trim();
            cheminCible = cheminActuel + '/' + $(this).text().trim();
            axios.get(`http://localhost:3000/deplacerElement?cheminElement=${cheminElement}&cheminCible=${cheminCible}`).then((response)=>{
                setTimeout(()=>{
                    $('#deplacerModal').modal('hide');
                    rvDossierContent(cheminActuel);
                },500)
            })
        },
    });

    $('body').click(()=>{
        if($('.selectedFile').length == 1){
            $('i.mdi-import,i.mdi-delete-sweep-outline').fadeIn();
        }else{
            $('i.mdi-import,i.mdi-delete-sweep-outline').fadeOut();
        }
    })

}

function creerElement() {
    nomElement = prompt('Saisissez le nom du dossier/fichier a créer !');
    axios.get(`http://localhost:3000/creerElement?nomElement=${nomElement}&chemin=${cheminActuel}`).then((response)=>{
        setTimeout(()=>{
            rvDossierContent(cheminActuel);
        },500)
    })
}

function deplacerElement(){
    if($('.selectedFile').length != 0){
        nomElement = $('.selectedFile').text().trim();

        $('.deplacerCeDossierContent').html('');
        for(i of dossierContent){
            if( i.split('.').length == 1 &&  i!=nomElement) $('.deplacerCeDossierContent').append(`<button type="button" class="btn btn-inverse-primary btn-fw deplacerIci dossier">${i}</button>`)
        }

        $('ol.breadcrumb.deplacerRacineContent').html('');
        for(i of cheminActuel.split('/')){
            $('ol.breadcrumb.deplacerRacineContent').append(`<li class="breadcrumb-item deplacerIci racine"><a href="#">${i}</a></li>`);
        }

        $('#deplacerModal').modal('show');
        $('.deplacerIci').click(function(){
            cheminElement = cheminActuel + '/' + nomElement;
            cheminCible = ($(this).hasClass('dossier') ? cheminActuel : cheminActuel.split('/').slice(0,$(this).index()).join('/')) +'/'+$(this).text();
            console.log('ELEMENT = ' + cheminElement)
            console.log('CIBLE = ' + cheminCible)
            axios.get(`http://localhost:3000/deplacerElement?cheminElement=${cheminElement}&cheminCible=${cheminCible}`).then((response)=>{
                setTimeout(()=>{
                    $('#deplacerModal').modal('hide');
                    rvDossierContent(cheminActuel);
                },500)
            })
        })
    }else{
        alert('Aucun fichier/dossier sélectionné');
    }
}

function supprimerElement(){
    if($('.selectedFile').length != 0){
        nomElement = $('.selectedFile').text();
        axios.get(`http://localhost:3000/supprimerElement?nomElement=${nomElement}&chemin=${cheminActuel}`).then((response)=>{
            setTimeout(()=>{
                rvDossierContent(cheminActuel);
            },500)
        })
    }else{
        alert('Aucun fichier/dossier sélectionné');
    }
}

function cmdTerminal(){
    cmd = $('.terminalInput').val();
    if(cmd.length > 0){
        axios.get(`http://localhost:3000/cmdTerminal?cmd=${cmd}`).then((response)=>{
            $('.terminalOutput').html('');
            $('.terminalInput').val('');
            $('.terminalOutput').html(response.data.split('\n').join('<br>'));
        })
    }
}