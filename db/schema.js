const { gql } = require('apollo-server');

// Schema
const typeDefs = gql`

type Vessel {
    id: ID!
    name: String!
    tuition: String!
    inspections: [Inspection]
}

input InputVessel {
    name: String!
    tuition: String!
}

type User {
    id: ID!
    name: String!
    password: String!
    email: String!
}

type Inspection {
    id: ID!
    date: String!
    status: Status!
    type: InspectionType!
    inform: String
    reason: String
    code: Code!
    vessel: Vessel!
    previousInspection: Inspection
}

input InputInspection {
    date: String!
    type: InspectionType!
    status: Status!
    inform: String
    reason: String
    code: Code!
    vessel: ID!
    previousInspection: ID
}

type Response {
    success: Boolean!
    message: String!
    user: User
}

enum InspectionType {
    INICIAL
    MAS_DETALLADA
    DE_SEGUIMIENTO
}

enum Status {
    MANTIENE_PENDIENTE_S
    SIN_PENDIENTES
    MANTIENE_PENDIENTE_S_SE_OTORGO_PLAZO_PARA_NAVEGAR_VER_INFORME
}

enum Code {
    CODIGO_30
    CODIGO_18
    CODIGO_17
    CODIGO_ROJO
    CODIGO_10
    SIN_PENDIENTES
}

type Query {
    getVessels: [Vessel]
    getVessel(id: ID!): Vessel
    getUsers: [User]
    getUser(id: ID!): User
    verificarSesion: User
    getInspections: [Inspection]!
    getInspection(id: ID!): Inspection
}

type Mutation {
    newVessel(input: InputVessel!): Vessel
    editVessel(id: ID!, input: InputVessel!): Vessel
    deleteVessel(id: ID!): String
    createUser(name: String!, email: String!, password: String!): User
    login(email: String!, password: String!): String
    newInspection(input: InputInspection!): Inspection
    editInspection(id: ID!, input: InputInspection!): Inspection
    deleteInspection(id: ID!): String
    logout: String
}
`;

module.exports = typeDefs;