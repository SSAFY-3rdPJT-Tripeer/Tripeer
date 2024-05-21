const express = require('express');
const WebSocket = require('ws');
const { Server } = require('http');
const Y = require('yjs');
const { MongodbPersistence } = require('y-mongodb-provider');
const { setupWSConnection } = require('y-websocket/bin/utils');
const { WebsocketProvider } = require('y-websocket')
const cors = require('cors');
const axios = require('axios');

const app = express();
const server = Server(app);
const wss = new WebSocket.Server({ noServer: true });

const mdb = new MongodbPersistence('<mongoDB connection String>', {
  collectionName: 'transactions',
  flushSize: 100,
  multipleCollections: true,
});

// CORS 설정
app.use(cors({
  origin: ['서버주소'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// JSON 요청 본문 파싱을 위한 미들웨어
app.use(express.json());

// POST 요청 처리
app.post('/node/opt', async (req, res) => {
  try {
    const data = req.body
    const day = parseInt(data.day)
    const option = data.option
    const planId = data.planId
    const doc = new Y.Doc()
    const ws = new WebsocketProvider(
      "wss://k10d207.p.ssafy.io/node",
      `room-${planId}`,
      doc,
      {WebSocketPolyfill: WebSocket}
    ); 
    res.status(200).json("ok");
    setTimeout(()=> {
      const totalYList = ws.doc.getArray('totalYList');
      const timeYList = ws.doc.getArray('timeYList');
      const blockYList = ws.doc.getArray('blockYList');
      const arr = totalYList.get(day)
      const request = {
        placeList: arr.toJSON(),
        option : option
      }
      // response.end(JSON.stringify(json));
      axios.post("<서버주소>/api/plan/optimizing", request, {
        headers: {authorization: req.headers.Authorization,},
      })
      .then(response => {
        console.log(response.data.data)
        arr.delete(0, arr.length);
        arr.insert(0, [...response.data.data.placeList]);
        const time = timeYList.get(parseInt(day))
        // time.delete(0, time.length)
        // time.insert(0, [...response.data.data.spotTime]);
        time.delete(0, time.length)

        const tmp = [...response.data.data.spotTime];
        let tmp2
        if (option === '1') {
          tmp2 = tmp.map((el, index)=>{
            if (!response.data.data.publicRootList[index]) {
              el.push(null)
              return el
            }
            el.push([response.data.data.publicRootList[index]])
            return el
          })
        } else {
          tmp2 = tmp.map((el, index)=>{
            el.push(null)
            return el
          })
        }
        time.insert(0, [...tmp2]);

        blockYList.delete(day, 1);
        blockYList.insert(day, [false])
        ws.destroy()
      })
      .catch(err=> {
        console.log(err)
        blockYList.delete(day, 1);
        blockYList.insert(day, [false])
      })

      },200)
    
  } catch (error) {
    console.error('Error parsing JSON!', error);
  }
});

app.get('/get/data', async (req, res) => {
  try {

      
    mdb.getYDoc("node/room-"+159).then(Ydoc => {
      const totalYList = Ydoc.getArray('totalYList').toJSON();
      const timeYList = Ydoc.getArray('timeYList').toJSON();
      const planId = 159
      const json = {
        totalYList : totalYList,
        timeYList : timeYList,
        planId : planId
      }
      res.end(JSON.stringify(json));
    });
  } catch (error) {
    console.error('Error parsing JSON!', error);
    res.status(400).json({ error: "Bad request" });
  }
});


// WebSocket 연결 설정
server.on('upgrade', function(request, socket, head) {
  if (request.url.startsWith('/node')) {
    wss.handleUpgrade(request, socket, head, ws => {
      setupWSConnection(ws, request);
    });
  } else {
    socket.destroy();
  }
});

wss.on('connection', ws => {
  console.log('Connected to /node');
});

// 서버 리스닝 시작
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Listening to http://localhost:${port}`);
});

// Y.js와 MongoDB 퍼시스턴스 설정
require('y-websocket/bin/utils').setPersistence({
  bindState: async (docName, ydoc) => {
    const persistedYdoc = await mdb.getYDoc(docName);
    const newUpdates = Y.encodeStateAsUpdate(ydoc);
    mdb.storeUpdate(docName, newUpdates);
    Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc));
    ydoc.on('update', async (update) => {
      mdb.storeUpdate(docName, update);
    });
  },
  writeState: async (docName, ydoc) => {
  },
});
