// const { MongoClient } = require('mongodb');
//  const auctions = [
//     {
//         _id:1,
//         link:"https://previews.123rf.com/images/cookelma/cookelma1409/cookelma140900082/31600267-vintage-antico-orologio-da-tasca-.jpg",
//         title:"Antico Orologio",
//         price:10,
//         description: "A unique vintage pocket watch from 1678",
//         ending_date: "03-04-2022"
//     },
//     {
//         _id:2,
//         link:"https://romanovrussia.com/wp-content/uploads/wwDSC05355.jpg",
//         title:"Victorian Five",
//         price:112,
//         description: "A unique piece of vintage furniture from 18th century",
//         ending_date: "02-04-2022"
//     },
//     {
//         _id:3,
//         link:"https://cpimg.tistatic.com/05472639/b/4/Aladdin-Lamp-in-Brass-Gennie-Lamp.jpg",
//         title:"Aladin's Lamp",
//         price:10,
//         description: "One of the most famous lamps in the world",
//         ending_date: "01-05-2022"
//     },
//     {
//         _id: 4,
//         link: 'https://www.thesprucecrafts.com/thmb/AC7AtusOTVbnpAbnOFtVAmLpGLI=/434x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/WorldRecordChineseBowl-5a78b8d1a18d9e0036a9c277.jpg',
//         title: 'Ru Guanyao Brush Washer Bowl',
//         price: 52,
//         description: '"Such Ru guanyao wares known for their intense blue-green glaze and “ice-crackle” pattern–are extremely rare because the kiln in China’s central Henan province',
//         ending_date: '14-05-2022'
//     },
//     {
//         _id: 5,
//         link: 'https://www.thesprucecrafts.com/thmb/dnPSWuMl_ZkCxqHHCi3pCHkDDYA=/434x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/henry-graves-watch-5a83732fc5542e00377fbe48.jpg',
//         title:'Patek Philippe Supercomplication Pocket Watch',
//         price:75,
//         description: '" Known as the Henry Graves Jr. Supercomplication, it is named after "a New York banker who competed with the car manufacturer James Ward Packard to commission the most elaborate watch possible in the early 20th century,',
//         ending_date: '10-10-2022',
//     },
//     {
//         _id: 6,
//         link: 'https://freepikpsd.com/file/2019/10/antique-items-png-Transparent-Images.png',
//         title: "Antique hand",
//         price: 10,
//         description: "A unique antique hand from the 16th century",
//         ending_date: "01-05-2022"
//     }

// ]

// async function main() {
    
//     const uri = "mongodb+srv://Suriyaa:mthaniga@cluster0.rsh4e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

  
//    const client = new MongoClient(uri);

//    try {
//        // Connect to the MongoDB cluster
//        await client.connect();
//        await createListings(client,auctions);
//        //await Find(client,products);
      


//    } catch (e) {
//        console.error(e);
//    } finally {
//        // Close the connection to the MongoDB cluster
//        await client.close();
//    }
// }

// main().catch(console.error);
// async function createListings(client, document){
//     const result = await client.db("Auction_Platform").collection("auctions").insertMany(document);
//    console.log(result);

// }




const { MongoClient } = require('mongodb');

// Données d'exemple (inchangées)
const auctions = [
    {
        _id: 1,
        link: "https://previews.123rf.com/images/cookelma/cookelma1409/cookelma140900082/31600267-vintage-antico-orologio-da-tasca-.jpg",
        title: "Antico Orologio",
        price: 10,
        description: "A unique vintage pocket watch from 1678",
        ending_date: "03-04-2026"
    },
    {
        _id: 2,
        link: "https://romanovrussia.com/wp-content/uploads/wwDSC05355.jpg",
        title: "Victorian Five",
        price: 112,
        description: "A unique piece of vintage furniture from 18th century",
        ending_date: "02-04-2026"
    },
    {
        _id: 3,
        link: "https://cpimg.tistatic.com/05472639/b/4/Aladdin-Lamp-in-Brass-Gennie-Lamp.jpg",
        title: "Aladin's Lamp",
        price: 10,
        description: "One of the most famous lamps in the world",
        ending_date: "01-05-2026"
    },
    {
        _id: 4,
        link: 'https://www.thesprucecrafts.com/thmb/AC7AtusOTVbnpAbnOFtVAmLpGLI=/434x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/WorldRecordChineseBowl-5a78b8d1a18d9e0036a9c277.jpg',
        title: 'Ru Guanyao Brush Washer Bowl',
        price: 52,
        description: '"Such Ru guanyao wares known for their intense blue-green glaze and “ice-crackle” pattern–are extremely rare because the kiln in China’s central Henan province',
        ending_date: '14-05-2026'
    },
    {
        _id: 5,
        link: 'https://www.thesprucecrafts.com/thmb/dnPSWuMl_ZkCxqHHCi3pCHkDDYA=/434x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/henry-graves-watch-5a83732fc5542e00377fbe48.jpg',
        title: 'Patek Philippe Supercomplication Pocket Watch',
        price: 75,
        description: '" Known as the Henry Graves Jr. Supercomplication, it is named after "a New York banker who competed with the car manufacturer James Ward Packard to commission the most elaborate watch possible in the early 20th century,',
        ending_date: '10-10-2026',
    },
    {
        _id: 6,
        link: 'https://freepikpsd.com/file/2019/10/antique-items-png-Transparent-Images.png',
        title: "Antique hand",
        price: 10,
        description: "A unique antique hand from the 16th century",
        ending_date: "01-05-2026"
    }
];

async function main() {
    // Connexion locale – base Auction_Platform
    const uri = "mongodb://127.0.0.1:27017/Auction_Platform";

    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await client.connect();
        console.log("Connecté à MongoDB local avec succès !");

        await createListings(client, auctions);
        console.log("Les 6 enchères d'exemple ont été insérées.");

    } catch (e) {
        console.error("Erreur lors de l'exécution :", e);
    } finally {
        await client.close();
        console.log("Connexion fermée.");
    }
}

async function createListings(client, documents) {
    try {
        // On supprime les anciennes données pour éviter les doublons (optionnel)
        // await client.db("Auction_Platform").collection("auctions").deleteMany({});

        const result = await client.db("Auction_Platform").collection("auctions").insertMany(documents);
        console.log(`Nombre d'enchères insérées : ${result.insertedCount}`);
    } catch (err) {
        console.error("Erreur insertion :", err);
    }
}

main().catch(console.error);