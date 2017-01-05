var router = require('express').Router();
router
      .get('/', (req, res) => {
          res.send('<h1>This is my root!</h1>');
})
      .get('/about', (req, res) => {
          res.send('<h1>This is my about page!</h1>');
})
      .route('/name/:name')
          .get( (req,res)=>{
              res.send(`<h1>You GET Welcome, ${req.params.name}</h1>`);
      })
          .post( (req, res) =>{
	      res.send(`<h1>You POST Welcome, ${req.params.name}</h1>`);
      });





module.exports = router; 
