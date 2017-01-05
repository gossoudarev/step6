/*jshint esversion: 6 */

var router = require('express').Router(),
    request = require('request');

let resolveOuterRoute = (url) => new Promise(
	(resolve, reject) => {
	    request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
		      resolve(body); 
		} else {
		      reject(error);
		}
	    });
});



router
      .get('/', (req, res) => {
          res.send('<h1>This is my root!</h1>');
})
      .get('/about', (req, res) => {
          res.send('<h1>This is my about page!</h1>');
})
      .route('/url/:url')
          .get( (req,res)=>{             
		resolveOuterRoute(req.params.url)
		    .then( x=>res.set({'Content-Type': 'text/html; charset=utf-8'}).send( x )  );
      });

router.route('/pipe/:url')
          .get( (req,res)=>{
		request(req.params.url).pipe(res);
      });




     





module.exports = router; 
