const {GraphQLServer} = require('graphql-yoga');

// 1
let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
}];

//Fake storage in link array
let idCount = links.length;

// 1 Schema
// root fields are users / user on Query &  createUser on Mutation
/*const typeDefs = `
type Query {
  info: String!
  feed: [Link!]!
}

type Mutation {
  post(url: String!, description: String!): Link!
}

type Link {
  id: ID!
  description: String!
  url: String!
}
`;*/

// 2 Resolvers
const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        // 2
        feed: () => links,
        link: (root, args) => links.find((link) => link.id === args.id)
        //link: (root, { id }) => links.find((link) => link.id === id)
    },
    Mutation: {
        // 2
        post: (root, args) => {
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url,
            };
            links.push(link);
            return link;
        },
        updateLink: (_, {id, description, url}) => {
            let updatedLink;
            links = links.map(link => {
                if (link.id === id) {
                    updatedLink = {
                        id: link.id,
                        description: description !== undefined ? description : link.description,
                        url: url !== undefined ? url : link.url
                    };
                    return updatedLink;
                } else {
                    return link;
                }
            });
            return updatedLink;
        },
        deleteLink: (_, {id}) => {
            const linkToDelete = links.find(x => x.id === id);

            links = links.filter(link => {
                return link.id !== linkToDelete.id;
            });
            return linkToDelete;
        }
    },
    // 3
    Link: {
        id: (root) => root.id,
        description: (root) => root.description,
        url: (root) => root.url,
    }
};

// 3 runtime
const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
});
server.start(() => console.log(`Server is running on http://localhost:4000`));