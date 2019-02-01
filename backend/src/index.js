// IMPORT dependency
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// DEFINE express to app
const app = express();

// DEFINE database
const questions = [];

// USE helmet for security
app.use(helmet());

// USE body-parser for parsing JSON
app.use(bodyParser.json());

// USE cors for enable all cors request
app.use(cors());

// USE morgan for create HTTP log
app.use(morgan('combined'));

// RETRIEVE all questions
app.get('/', (req, res) => {
    const qs = questions.map(q => ({
        id: q.id,
        title: q.title,
        description: q.description,
        answer: q.answer.length
    }));
    res.send(qs);
});

// RETRIEVE specific question
app.get('/:id', (req, res) => {
    const question = questions.filter(q => (q.id === parseInt(req.params.id)));
    if (question.length > 1)
        return res.status(500).send(); // ERROR 500 means there's more than 1 data in array
    if (question.length === 0)
        return res.status(404).send(); // ERROR 404 means there's none data in array
    res.send(question[0]);
});

// INSERT a new question
app.post('/', (req, res) => {
    const { title, description } = req.body;
    const newQuestion = {
        id: questions.length + 1,
        title,
        description,
        answers: []
    };
    questions.push(newQuestion);
    res.status(200).send();
});

// INSERT new answer(s)
app.post('/answer/:id', (req, res) => {
    const { answer } = req.body;
    const question = questions.filter(q => (q.id === parseInt(req.params.id)));
    if (question.length > 1)
        return res.status(500).send();
    if (question.length === 0)
        return res.status(404).send();
    question[0].answers.push({ answer });
    res.status(200).send();
});

// START the server
app.listen(8081, () => {
    console.log('listening on port 8081')
});


