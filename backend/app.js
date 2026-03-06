// const express=require("express");
// const bodyparser=require("body-parser");
// var cors = require('cors')
// const { MongoClient } = require('mongodb');
// const app=express();
// app.use(cors());
// app.use(bodyparser.json());
// const http = require("http");
// const server = http.createServer(app);
// const sha256=require("sha256");

// // const uri = "mongodb+srv://Suriyaa:mthaniga@cluster0.rsh4e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const uri = "mongodb://localhost:27017/Auction_Platform";

// const client = new MongoClient(uri);
// async function mains()
// {
//     await client.connect();
// }
// mains();

// const io = require('socket.io')(server, {
//     cors: {
//         origin: 'http://localhost:3000',
//         methods: ['GET', 'POST']
//     }
// })
// app.get("/home",async (req,res)=>{
    
//     try {
//         // Connect to the MongoDB cluster
        
       
//         const docs=await findall(client);
//         res.send(docs);
    
    
//     } catch (e) {
//         console.error(e);
//     } finally {
//         // Close the connection to the MongoDB cluster
       
    
//     }
// })
// app.post("/product",async (req,res)=>{
    
//     try {
//         // Connect to the MongoDB cluster
       
//         const docs=await find(client,req.body.id);
//         res.send(docs);
    
    
//     } catch (e) {
//         console.error(e);
//     } finally {
//         // Close the connection to the MongoDB cluster
      
//     }
// })

// app.post("/login",async (req,res)=>{
//     try {
//         // Connect to the MongoDB cluster
//        obj=req.body;
//         const result=await finduser(client,obj.name);
//         var finalans={};

//         if(result===0){
//             finalans["success"]=-1;
//             res.send(JSON.stringify(finalans));
//         }
        
//         if(result.password===sha256(req.body.password))
//         {
//             finalans["success"]=1;
//         }
//         else
//         finalans["success"]=0;
//         res.send(JSON.stringify(finalans));
       
         
//     } catch (e) {
//         console.error(e);
//     } finally {
//         // Close the connection to the MongoDB cluster
//        //  await client.close();
    
//     }
   
// })

// app.post("/signup",async (req,res)=>{
//     try {
//         console.log("hi")
//         // Connect to the MongoDB cluster
//        obj=req.body;
//        var userdata={username:obj.username,password:sha256(obj.password)};
//         const tempresult = await finduser(client,obj.username);
//         if(tempresult===0){
//             const result = await client.db("Auction_Platform").collection("Users").insertOne(userdata);
//             console.log(result);
//             var finalans={
//                 'success': 1
//             };
//         }
//         else{
//             var finalans={
//                 'success': -1
//             };
//         }
//         res.send(JSON.stringify(finalans));
//         } catch (e) {
//             console.error(e);
//         } finally {
//             // Close the connection to the MongoDB cluster
//         //  await client.close();
        
//         }
   
// })


// app.post("/addauction",async (req,res)=>{
//     try {
//         // Connect to the MongoDB cluster
//         const cursor = await client.db("Auction_Platform").collection("auctions").find();
//         const arr= await cursor.toArray();
       
      
       
//        var obj=req.body;
//        obj["price"]=parseInt(obj["price"]);
//        obj["ending_date"]=parseInt(obj["ending_date"]);
//        obj["_id"]=arr.length;
//        obj["winner_address"]="";
//        obj["bid_count"]=0;
//        console.log(obj);


//         const result = await client.db("Auction_Platform").collection("auctions").insertOne(req.body);
//          console.log(result)
//     } catch (e) {
//         console.error(e);
//     } finally {
//         // Close the connection to the MongoDB cluster
//        //  await client.close();
    
//     }
   
// })
 
// io.on('connection', socket => {
//     console.log("connected")

//     socket.on('change', async data => {
      
       
      
//         var myquery = { _id:data["id"] };
//         var newvalues = { $set: {price:parseInt(data["news"]) } };

//         var qval = await client.db("Auction_Platform").collection("auctions").findOne({"_id":data["id"]});

//         if(data["news"] > qval.price){
//             data["bidcount"]=qval.bid_count+1;
//             io.emit("message",data);

//             const result=await client.db("Auction_Platform").collection("auctions").updateOne(myquery, newvalues, function(err, res) {
//                 if (err) throw err;
//                 console.log("1 document updated");
              
//               });
              
//               var bidder_address =data["address"];
//               var bidcount = qval.bid_count;
//               var new_bidcount = bidcount+1;
//               newvalues = { $set: {bid_count: new_bidcount, winner_address:bidder_address} };
            
//             const result2=await client.db("Auction_Platform").collection("auctions").updateOne(myquery, newvalues, function(err, res) {
//                 if (err) throw err;
//                 console.log("1 document updated");
              
//               });
//             var amtbidded = data["news"];
//             var auction_id_bidded = data["id"];

//             var document={
//                 bidder_address:bidder_address,
//                 amount_bidded:amtbidded,
//                 auction_id:auction_id_bidded,
//                 order: new_bidcount
//             };
           
//             const result3 = await client.db("Auction_Platform").collection("transactions").insertOne(document);
//         }
        
//     })

//     socket.on('add_auction', async data => {
      
//         var obj = data;
//         try {
//             // Connect to the MongoDB cluster
//             var cursor = await client.db("Auction_Platform").collection("auctions").find();
//             var arr= await cursor.toArray();
           
//            obj["price"]=parseInt(obj["price"]);
//            obj["ending_date"]=parseInt(obj["ending_date"]);
//            obj["_id"]=arr.length;
//            obj["winner_address"]="";
//            obj["bid_count"]=0;
//            console.log(obj);
    
    
//             var result = await client.db("Auction_Platform").collection("auctions").insertOne(obj);
//             cursor = await client.db("Auction_Platform").collection("auctions").find().sort({bid_count:-1});
//             arr= await cursor.toArray();
//             io.emit('update',arr);
    
//         } catch (e) {
//             console.error(e);
//         } finally {
//             // Close the connection to the MongoDB cluster
//            //  await client.close();
        
//         }
        
//     })
// })

//  server.listen(4000,()=>{
//     console.log("listening 4000");
//  })
 
// app.listen(8000,()=>{
//     console.log("listening 8000");
// })
// async function findall(client)
// {
//     const cursor = await client.db("Auction_Platform").collection("auctions").find().sort({bid_count:-1});
//     const arr= await cursor.toArray();
//     const j=JSON.stringify(arr);
//    return j;
// }
// async function find(client,id)
// {
//     console.log(id);
//     const cursor = await client.db("Auction_Platform").collection("auctions").findOne({"_id":id});
//     const j=JSON.stringify(cursor);
//   console.log(j.bidcount)
//   return j;
// }
// async function finduser(client,username)
// {
//     const cursor = await client.db("Auction_Platform").collection("Users").findOne({"username":username});
//     console.log("Printing cursor")
//     if(!cursor)
//         return 0;
//     return cursor;
// }






const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const { MongoClient } = require('mongodb');
const http = require("http");
const { Server } = require("socket.io");
const sha256 = require("sha256");

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

// ────────────────────────────────────────────────
// Connexion MongoDB locale (une seule fois au démarrage)
// ────────────────────────────────────────────────
const uri = "mongodb://127.0.0.1:27017/Auction_Platform";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db("Auction_Platform");
        console.log("Connecté à MongoDB local !");
    } catch (err) {
        console.error("Erreur de connexion MongoDB :", err);
        process.exit(1);
    }
}

connectDB();

// ────────────────────────────────────────────────
// Routes HTTP
// ────────────────────────────────────────────────

app.get("/home", async (req, res) => {
    try {
        const cursor = await db.collection("auctions").find().sort({ bid_count: -1 });
        const arr = await cursor.toArray();
        res.json(arr);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// app.post("/product", async (req, res) => {
//     try {
//         const id = parseInt(req.body.id);
//         const auction = await db.collection("auctions").findOne({ _id: id });
//         res.json(auction || {});
//     } catch (e) {
//         console.error(e);
//         res.status(500).json({ error: "Erreur serveur" });
//     }
// });
app.post("/product", async (req, res) => {
    try {
        const mongoId = parseInt(req.body.id);  // on cherche par _id MongoDB
        console.log("MongoDB ID:", mongoId);
        
        const auction = await db.collection("auctions").findOne({ _id: mongoId });

        if (!auction) {
            return res.status(404).json({ error: "Enchère non trouvée" });
        }

        res.json(auction);  // ← renvoie TOUT, dont blockchain_id
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { name, password } = req.body;
        const user = await db.collection("Users").findOne({ username: name });

        if (!user) {
            return res.json({ success: -1 });
        }

        if (user.password === sha256(password)) {
            return res.json({ success: 1 });
        }

        return res.json({ success: 0 });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;
        const existing = await db.collection("Users").findOne({ username });

        if (existing) {
            return res.json({ success: -1 });
        }

        const result = await db.collection("Users").insertOne({
            username,
            password: sha256(password)
        });

        res.json({ success: 1 });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// app.post("/addauction", async (req, res) => {
//     try {
//         const cursor = await db.collection("auctions").find().sort({ _id: -1 }).limit(1);
//         const last = await cursor.toArray();
//         const newId = last.length > 0 ? last[0]._id + 1 : 1;

//         const auction = {
//             ...req.body,
//             _id: newId,
//             price: parseInt(req.body.price),
//             ending_date: parseInt(req.body.ending_date),
//             winner_address: "",
//             bid_count: 0
//         };

//         await db.collection("auctions").insertOne(auction);
//         res.json({ success: true, auction });
//     } catch (e) {
//         console.error(e);
//         res.status(500).json({ error: "Erreur serveur" });
//     }
// });

// ────────────────────────────────────────────────
// Socket.io – enchères en temps réel
// ────────────────────────────────────────────────
app.post("/addauction", async (req, res) => {
    try {
        const cursor = await db.collection("auctions").find().sort({ _id: -1 }).limit(1);
        const last = await cursor.toArray();
        const newMongoId = last.length > 0 ? last[0]._id + 1 : 1;

        // blockchain_id doit venir du frontend (envoyé lors de la création via socket ou HTTP)
        const blockchainId = req.body.blockchain_id 
            ? parseInt(req.body.blockchain_id) 
            : newMongoId;  // fallback si pas fourni

        const auction = {
            ...req.body,
            _id: newMongoId,                  // ID MongoDB
            blockchain_id: blockchainId,      // ID blockchain (prioritaire)
            price: parseInt(req.body.price || 0),
            ending_date: parseInt(req.body.ending_date || 0),
            winner_address: "",
            bid_count: 0
        };

        await db.collection("auctions").insertOne(auction);

        res.json({ 
            success: true, 
            auction,
            mongo_id: newMongoId,
            blockchain_id: blockchainId 
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

io.on('connection', (socket) => {
    console.log("Un utilisateur s'est connecté");

    socket.on('change', async (data) => {
        try {
            const id = parseInt(data.id);
            const newPrice = parseInt(data.news);

            const auction = await db.collection("auctions").findOne({ _id: id });

            if (!auction || newPrice <= auction.price) {
                return;
            }

            const newBidCount = (auction.bid_count || 0) + 1;

            await db.collection("auctions").updateOne(
                { _id: id },
                {
                    $set: {
                        price: newPrice,
                        bid_count: newBidCount,
                        winner_address: data.address
                    }
                }
            );

            await db.collection("transactions").insertOne({
                bidder_address: data.address,
                amount_bidded: newPrice,
                auction_id: id,
                order: newBidCount
            });

            const updatedData = {
                ...data,
                bidcount: newBidCount
            };

            io.emit("message", updatedData);
        } catch (err) {
            console.error("Erreur socket change :", err);
        }
    });

    // socket.on('add_auction', async (data) => {
    //     try {
    //         const cursor = await db.collection("auctions").find().sort({ _id: -1 }).limit(1);
    //         const last = await cursor.toArray();
    //         const newId = last.length > 0 ? last[0]._id + 1 : 1;

    //         const auction = {
    //             ...data,
    //             _id: newId,
    //             price: parseInt(data.price),
    //             ending_date: parseInt(data.ending_date),
    //             winner_address: "",
    //             bid_count: 0
    //         };

    //         await db.collection("auctions").insertOne(auction);

    //         // Envoi mise à jour à tous
    //         const updatedAuctions = await db.collection("auctions").find().sort({ bid_count: -1 }).toArray();
    //         io.emit('update', updatedAuctions);
    //     } catch (err) {
    //         console.error("Erreur socket add_auction :", err);
    //     }
    // });
    socket.on('add_auction', async (data) => {
        try {
            const cursor = await db.collection("auctions").find().sort({ _id: -1 }).limit(1);
            const last = await cursor.toArray();
            const newMongoId = last.length > 0 ? last[0]._id + 1 : 1;

            // blockchain_id doit être fourni dans data (depuis le frontend)
            const blockchainId = data.blockchain_id 
                ? parseInt(data.blockchain_id) 
                : newMongoId;

            const auction = {
                ...data,
                _id: newMongoId,
                blockchain_id: blockchainId,
                price: parseInt(data.price || 0),
                ending_date: parseInt(data.ending_date || 0),
                winner_address: "",
                bid_count: 0
            };

            await db.collection("auctions").insertOne(auction);

            const updatedAuctions = await db.collection("auctions")
                .find()
                .sort({ bid_count: -1 })
                .toArray();

            io.emit('update', updatedAuctions);
        } catch (err) {
            console.error("Erreur socket add_auction :", err);
        }
    });

    socket.on('disconnect', () => {
        console.log("Utilisateur déconnecté");
    });
});

// Lancement des serveurs
const PORT_HTTP = 8000;
const PORT_SOCKET = 4000;

server.listen(PORT_SOCKET, () => {
    console.log(`Socket.io écoute sur le port ${PORT_SOCKET}`);
});

app.listen(PORT_HTTP, () => {
    console.log(`API Express écoute sur le port ${PORT_HTTP}`);
});