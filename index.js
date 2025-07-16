import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `#graphql
    type Query {
        posts : [Post]
        users:[User!]!
    }

    type Post {
        id: ID!
        title: String
        body: String 
        tags:[String]
    }

    type User {
        id: ID!
        first_name: String!
        last_name: String!
        email: String!
        password:String!
    }

    input AddUserInput {
        first_name: String!
        last_name: String!
        email:String!
        password:String!
    }

    type Mutation {
        addUser( input: AddUserInput!): User!
    }

    `;
// type Mutation {
//     addUser(first_name: String!, last_name: String!, email:String!, password:String!):User!
// }

let users = [];
let idCounter = 1;

const resolvers = {
    Query: {
        posts: () => [
            {
                id: '2',
                title: "post 1",
                body: "body of post 1",
                tags: ["tag 1 ", "tag 2"]
            },
            {
                id: '3',
                title: "post 3",
                body: "body of post 3",
                tags: ["tag 3 ", "tag 4"]
            },
        ],
        users: () => users,
    },
    Mutation: {
        addUser:(_, {input}) => {
            const { first_name, last_name, email, password} = input;
            if(users.find((user) => user.email === email)){
                throw new Error("User Already exists");
            }

            const newUser = {
                id: idCounter++,
                first_name,
                last_name,
                email,
                password,
            }

            users.push(newUser);
            return newUser;
        }


        // addUser: (_, { first_name, last_name, email, password }) => {
        //     const newUser = {
        //         id: idCounter++,
        //         first_name,
        //         last_name,
        //         email,
        //         password,
        //     };
        //     users.push(newUser);
        //     return newUser;
        // }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
console.log(`server runs on port ${url}`);
