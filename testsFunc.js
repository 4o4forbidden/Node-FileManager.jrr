const isPath = (path) =>{
    return (path.split('/').length > 1 )
}

const contenuDossier = (content) =>{
    return typeof(content)
}

module.exports = {isPath,contenuDossier}