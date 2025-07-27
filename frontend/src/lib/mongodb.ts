import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const databaseName = process.env.DATABASE_NAME || "toyota_sanjuan";
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
    // En desarrollo, usar una variable global para preservar la conexión
    let globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri, options);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
} else {
    // En producción, es mejor no usar variables globales
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

// Función helper para obtener la base de datos
export async function getDatabase() {
    const client = await clientPromise;
    return client.db(databaseName);
}

export default clientPromise;
