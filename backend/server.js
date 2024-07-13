const PORT = 8000;
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();

const prompt = "Give me a list of to-do tasks in JSON format. Include each and every relevant information in the response. Ask for the context if required: eg workout plans used to optimized to factors such as age, weight, user end goal, workout preference. Make sure there are atleast 8 useful checklists. Use only these keys: task, type, components, component, steps, step. Include components or steps as arrays if needed. Mark tasks as 'Today', 'Daily', or 'Weekly'. Detect the prompt's language and use it. Example JSON: { 'task': '', 'type': '' } { 'task': '', 'type': '', 'components': [{ 'component': '' }], 'steps': [{ 'step': '' }] }. Return JSON only.If the task is repeatable daily, mark it as \"Daily\" - The key is \"type\". If the task is once only today, mark it as \"Today\" - The key is \"type\". If the task is weekly, mark it as \"Weekly\" - The key is \"type\". For example, \"make eggs\" should include the number of eggs needed. This should apply to anything like that. If there's nothing food-related that's needed, for example, \"a computer\" or something along those lines, it should be considered a component all the same. Ask the user to elaborate if the prompt is unclear .Rules: Use specified keys only, no tips, actionable steps only, DO NOT INCLUDE ANY OTHER TEXT OUTSIDE THE JSON STRING IN THE RESPONSE,do not include anything that cannot be clearly checked off for the day, helpful links as 'link' only if necessary not for component that everyone knows eg.butter, sugar or milk. This is the prompt: {{prompt}}"


app.use(express.json());
app.use(cors());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getGroqChatCompletion = async (req) => {
try {
  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You have to add the content of the user to token marked as {{prompt}} at the end of these instructions:${prompt}`,
      },
      {
        role: "user",
        content: req.body.message
      }
    ],
    model: "llama3-8b-8192",
    temperature: 0.5,
    max_tokens: 3800,
    top_p: 1,
    stop: null,
    stream: false,
  });
  return response; // Return the response directly
}catch (error) {
    console.error(error);
    throw error; // Propagate the error for better handling
  }
};
;

app.post('/completions', async (req, res) => {
  try {
    const response = await getGroqChatCompletion(req);
    res.json(response); // Send the response back to the client
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

