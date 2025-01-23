import express from 'express';
import { EmbeddingModel, FlagEmbedding } from "fastembed";

const app = express();
const port = 3000;

app.use(express.json())

const embeddingModel = await FlagEmbedding.init({
  model: EmbeddingModel.BGESmallENV15
});

app.get('/', (req, res) => {
  res.json({
    "description": "Embedding generation service using FastEmbed library and BGESmallENV15 model",
    "endpoints": [
      {
        "path": "/",
        "method": "GET",
        "description": "You're here!"
      },
      {
        "path": "/create-embedding",
        "method": "POST",
        "description": "Create an embedding for a given input",
        "body": {
          "param": "input",
          "type": "string",
        },
        "response": "Array of floats"
      }
    ]
  });
});

app.post('/create-embedding', async (req, res) => {
  const input = req.body.input;
  console.log("Input: ", input);

  const embeddings = await embeddingModel.embed([input], 2);
  const results = await embeddings.next();
  const normalizedResults = Object.values(results.value[0])

  return res.json(normalizedResults);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
