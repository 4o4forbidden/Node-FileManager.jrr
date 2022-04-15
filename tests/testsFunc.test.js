const App = require('../testsFunc')

describe("\n \n ./ Verification des entrées & functions", ()=>{
    it("=> Verifier si c'est un path ? (1)", async ()=>{
        expect(App.isPath('/home')).toBe(true)
    })

    it("=> Verifier si c'est un path ? (2)", async ()=>{
        expect(App.isPath('home')).toBe(false)
    })

    it("=> Verifier si le contenu du dossier est un tableau ?", async ()=>{
        expect(App.contenuDossier(['Amine', 'Amine.js', 'Amine.pdf', 'Daly', 'Dossier'])).toBe("object")
    })
})


