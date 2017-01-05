/*jshint esversion: 6 */
/*jshint -W058 */

const PORT = 7777;
var	  express = require('express'),
          app = express(),

		  routers = {
		  		"/my"   : "./routes/my/", 
		  		"/other": "./routes/other/"
		  		},
          
	      handlebars = require('express-handlebars')
	       .create({ defaultLayout: 'main',
		      helpers: {
		  	section:function(name,options){
	  		    if(!this._sections) this._sections = {};
	  		    this._sections[name] = options.fn(this);
	  		    return null;
	 		}
		    }
	      });	
	    	    

     
module.exports = (()=>{
   function inner(){
      this.start = whatToDo=>{
		  app
		     .engine('handlebars', handlebars.engine)
		     .set('view engine', 'handlebars')    
			 .use(require('body-parser').urlencoded({extended: true}))
		     .use(express.static(__dirname + '/public'))
		     .use((req, res, next)=>next());


		  for( let router in routers) {
		  	app
		  		.use(router, require( routers[router]  ));
		  }    
		  app
		  	.use('/users/', require('./routes/users/')(express,app));

          app
		     .get('/', (req,res)=>{
			res.render('root', {text: 'WELCOME HOME!!!'});
		  })

		  .get('/fail', function(req, res){
		         process.nextTick(()=>{
		                 throw new Error('Бабах!');
		             });
		  })

   		     .get('/:smth/', (req, res) => {
   			  res.render('root', {text: req.params.smth});
   			 
   		  }) 
   		     .get('/api', (req, res) => {
			  res.set({'Access-Control-Allow-Origin': '*', 'elias': 'goss'}); //CORS - outer reqs
   			  res.json({'gossApi':'started ok!'});
   		  }) 



		     .use((req, res, next) => {
			
			res.status(404).render('404',{text: req.url});
		  })
		     .use((err, req, res, next) => {
			res.status(500).send(`<h1 style="color:orange">Something went wrong ${err}</h1>`);
		  }) 
		  
		     .set('port',  process.env.port||PORT )		  
		     .listen( app.get('port') ,()=>console.log(`--> Port ${ app.get('port') } listening!!!`));
      };   
    }
  return new inner;
})();

// http://kodaktor.ru/api/req - demo client, test CORS
// process.env.port  - for cloud9 or ... port=8765 npm start



