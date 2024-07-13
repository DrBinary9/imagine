const PORT = 8000;
const express = require('express');
const cors = require('cors');
//const mongoose = require('mongoose')
const Groq = require('groq-sdk');

//const todoRoutes = require('./routes/todo')
const app = express();

app.use(express.json());
app.use(cors());
const groq = new Groq({ apiKey: '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' });
//
//app.use(express.json())
//
//app.use((req, res, next) => {
//  console.log(req.path, req.method)
//  next()
//})
//
//mongoose.connect('mongodb://localhost:27017/imagine')
//  .then(()=> {
//    app.listen(PORT, () => console.log(`${PORT} is running`)); 
//    console.log('Connected to DB')
//  })
//  .catch((err) => console.log(err));  
//
//app.use('/api/todo', todoRoutes);  
//

const getGroqChatCompletion = async () => {
  return groq.chat.completions.create({
    //
    // Required parameters
    //
    messages: [
      // Set an optional system message. This sets the behavior of the
      // assistant and can be used to provide specific instructions for
      // how it should behave throughout the conversation.
      {
        role: "system",
        content: "you are a helpful assistant.",
      },
      // Set a user message for the assistant to respond to.
      {
        role: "user",
        content: "Explain the importance of fast language models",
      },
    ],

    // The language model which will generate the completion.
    model: "llama3-8b-8192",

    //
    // Optional parameters
    //

    // Controls randomness: lowering results in less random completions.
    // As the temperature approaches zero, the model will become deterministic
    // and repetitive.
    temperature: 0.5,

    // The maximum number of tokens to generate. Requests can use up to
    // 2048 tokens shared between prompt and completion.
    max_tokens: 1024,

    // Controls diversity via nucleus sampling: 0.5 means half of all
    // likelihood-weighted options are considered.
    top_p: 1,

    // A stop sequence is a predefined or user-specified text string that
    // signals an AI to stop generating content, ensuring its responses
    // remain focused and concise. Examples include punctuation marks and
    // markers like "[end]".
    stop: null,

    // If set, partial message deltas will be sent.
    stream: false,
  });
};


app.post('/completions', async (req, res) => {
  try {
    const response = await getGroqChatCompletion();
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
