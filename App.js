const express = require('express')
const path = require('path');
// const getFiles = require('./Test');
const app = express()
const port = 3000

const fs = require('fs');
const { exec } = require('child_process');
 


app.get('/rvFichiers', (req, res) => {
    const readdirAsync = promisify(fs.readdir)
    var directoryPath;
    
    if(req.query.chemin.split('/').length == 2){
       directoryPath = path.join(__dirname,req.query.chemin);
    }else{
       directoryPath = req.query.chemin;
    }
    // console.log('CHEMINNNN => ' + req.query.chemin)
    // console.log('=>>>>>>>>>' + directoryPath);
    readdirAsync(directoryPath).then(dossierContent => res.send({
      'dossierContent':dossierContent,
      'dossierChemin': directoryPath
    }))
})

app.get('/creerElement',(req,res) => {
    const nomElementCE = req.query.nomElement.replace(' ','-');
    const cheminActuelCE = req.query.chemin;

    nomElementCE.split('.').length == 1 ? fs.mkdir(path.join(cheminActuelCE,nomElementCE),()=>{}) : fs.writeFile(path.join(cheminActuelCE,nomElementCE),'',()=>{})
    // exec(`cd ${cheminActuelCE} && ${nomElementCE.split('.').length == 1 ? 'mkdir' : 'touch'} ${nomElementCE}`);
    console.log('Nom Element = ' + nomElementCE)
    console.log('Chemin Actuel = ' + cheminActuelCE)
    res.send(true)
})

app.get('/supprimerElement',(req,res) => {
    const nomElementSE = req.query.nomElement;
    const cheminActuelSE = req.query.chemin;
    console.log('==> '+nomElementSE)
    console.log('==> '+cheminActuelSE)
    exec(`cd "${cheminActuelSE}" && rm -r ${nomElementSE}`);
    res.send(true)
})

app.get('/deplacerElement',(req,res) => {
  const cheminElement = req.query.cheminElement;
  const cheminCible = req.query.cheminCible;
  console.log('ELEMENT = ' + cheminElement)
  console.log('CIBLE = ' + cheminCible)
  exec(`mv "${cheminElement}" "${cheminCible}"`);
  res.send(true)
})

app.get('/cmdTerminal',(req,res) => {
  const cmd = req.query.cmd;
  const terminal = exec(cmd, function (error, stdout, stderr) {
    if (error) {
      res.send(error.stack);
    }else{
      res.send(stdout);
    }
  });
})

app.listen(port, () => {
  console.log(`Mon file Manager localhost => ${port}`)
})


function promisify(fn) {
    /**
     * @param {...Any} params The params to pass into *fn*
     * @return {Promise<Any|Any[]>}
     */
    return function promisified(...params) {
      return new Promise((resolve, reject) => fn(...params.concat([(err, ...args) => err ? reject(err) : resolve( args.length < 2 ? args[0] : args )])))
    }
}