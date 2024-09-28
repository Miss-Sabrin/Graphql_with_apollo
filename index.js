import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// db
import db from './_db.js';
import { typeDefs } from './schema.js';

const resolvers = {
    Query: {
        games() {
            return db.games;
        },
        game(__, args) {
            return db.games.find((game) => game.id === args.id);
        },
        authors() {
            return db.authors;
        },
        author(__, args) {
            return db.authors.find((author) => author.id === args.id);
        },
        reviews() {
            return db.reviews;
        },
        review(__, args) {
            return db.reviews.find((review) => review.id === args.id);
        },
    },
    // Type resolvers for Game, Author, Review
    Game: {
        reviews(parent) {
            return db.reviews.filter((r) => r.game_id === parent.id);
        }
    },
    Author: {
        reviews(parent) {
            return db.reviews.filter((r) => r.author_id === parent.id);
        }
    },
    Review: {
        author(parent) {
            return db.authors.find((a) => a.id === parent.author_id);
        },
        game(parent) {
            return db.games.find((g) => g.id === parent.game_id);
        }
    },


    //!type mutation
    Mutation:{
        deleteGame(_,args){
            db.games=db.games.filter((g)=>g.id !== args.id)
            returndb.games
        },
        addGame(_,args){
            let game={
                ...args.game,
                id:Math.floor(Math.random() * 10000).toString()
            }
            db.games.push(game)
            return game
        },
        updateGame(_,args){
            db.games=db.games.map((g)=>{
                if(g.id=== args.id){
                    return {...g.id,...args.id}
                }
                return g
            })
            return db.games.find((g)=>g.id===args.id)
        }


    }

};

// server setup
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
});

console.log("Server ready at", url);
