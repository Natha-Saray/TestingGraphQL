const express = require('express');
// se ejecuta - express el modulo a continuacion 
const app = express();

// integrando graphql - requeriendo los modulos
const express_graphql = require('express-graphql');

// requerir otro modulo - una funcionalidad que permita escribir esquemas: definir como van a lucir los datos
const { buildSchema } = require('graphql');
// agregue esta linea porque la anterior ya esta desactualizada 
const { graphqlHTTP } = require('express-graphql');


// requerir data
const { characters } = require('./data.json');
// con type se definen tipos de datos en graphql
const schema = buildSchema(`
    type Query {
        character(id: Int!): Characters
        characters(name: String): [Characters]
    }

    type Characters {
        id: Int
        name: String
        hair_color: String
        eye_color: String
        gender: String
        birth_year: String
    }
    
`);

// definir la funcion para la consulta. realizar una consulta a traves de una funcion

let getCharacter = (args) => {
    let id = args.id;
    return characters.filter(character => {
        return character.id == id;
// filter devolvera un arreglo, pero con [0], se indica que se quiere el item 0 o el 1er dato        
    })[0]
}

let getCharacters = (args) => {
    if (args.gender) {
        let gender = args.gender;
        return characters.filter(character => character.gender === gender);
    } else {
        return characters;
    }
};

const root = {
    character: getCharacter,
    characters: getCharacters
}

// integrar los modulos express-graphql. en este caso agregar graphql a la ruta para poder hacer consultas usando localhost:3000/graphql /para hacer una ruta se usa -use-/ /es la interfaz/
// app.use('/graphql', express_graphql({
//     schema: schema,
//     root: root,
//     graphiql: true
// }));
// agregue este fragmento porque la anterior ya esta desactualizada
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));


// luego se inicializa el puerto
app.listen(3000, () => console.log('server on port 3000'));

