/*jshint esversion: 6 */

/*
we want to have

 +POST /users/  {login, password} - add
 +DELETE /users/:login - remove
  GET /users/:login - find this user, otherwise 404
 +GET /users/  - list all the users
  GET /users/raw - give us raw json
 
*/

let checkAuth = (req, res, next)=>{
		  	 if (req.session.auth) { 
		  		next();  
		  	 } else {
			  	req.session.oldurl1 = req.originalUrl; //save the attempted url for going back after login
		  		res.redirect('/users/login/');
			 }
		  };




module.exports = (x,app)=>{
let
    appDir = require('path').dirname(require.main.filename), 
    data = `${appDir}/data/users.json`,
    userData = require(data),
    session = require('express-session'),
    router = x.Router(),
    
    j = require('jsonfile'),
    _ = require('lodash');

app
  .use(session({ secret: 'mydirtysecret',resave: true,saveUninitialized: true }));

router
      .route('/')
            .get( (req, res) => {
	            res.render('userslist', {"text": "List of all users", "users": userData.users});
            })
            .post( (req, res) => {
				userData.users.push ( {"login":req.body.login, "password":req.body.password  }  );
				j.writeFile(data, userData, err=>{
					if (err) throw(err);
					res.send(`You added login ${req.body.login} and password ${req.body.password} `);
				});		             	
            });

router
	.route( '/raw')
			.get(checkAuth, (req,res) =>{
 			   res.json(userData);
			 });

router
	.route('/client')
			.get( (req,res) =>{
				res.render('userlistclient', {"users": "/users/raw", "text": "This is client-side rendering!"});
			
			});

router
    .route('/login')
    		.get( (req,res)=>{
    		  

			   if (req.session.auth) {
						 //if we are already in, then go to stored route or to the profile
						 if (!this.oldurl1) {
								  res.redirect('/users/profile/');
						  } else {
								  let oldurl1 = req.session.oldurl1;
								  req.session.oldurl1 = undefined;
								  res.redirect(oldurl1);
						  }
			   } else {
						 req.session.oldurl2 = req.session.oldurl1;
						 req.session.oldurl1 = undefined;
						 res.render(`login`, {"text":"Login form"});	
			   }
    		   
    		});

router
    .route('/login/process')
    		.post( (req,res)=>{
                       let oldurl2 = req.session.oldurl2;
                       req.session.oldurl2 = undefined;
    		
					   let login = req.body.login,
					 	  user = _.find(userData.users, {login});
	 			      if (user) {
					  	 if ( req.body.password === user.password) {
					  	 	req.session.auth = true;
					  	 	req.session.login = req.body.login;

							   if (!oldurl2) {
									res.redirect('/users/profile/'); //do authorization
							   } else {
									res.redirect(oldurl2); //back to the attempted section
							   }

					  	 	
					  	 } else {
				               res.set( {'Refresh' : '5; url=/users/login/'})
					  	 	   .render('404', { text: "Wrong password!"   } );					  	 	
					  	 }
		   		    }   
				        else {
				           res.set( {'Refresh' : '5; url=/users/login/'})
				       	   .render('404', { text: "Not such user!"   } );
			 	      } 

    			
    		});

router
    .route('/logout')
    		.get( (req,res)=>{
    					
    		   		 req.session.auth = false;	 
    		   	     res.set( {'Refresh' : '5; url=/users/login/'})
    		      	     .send(`<h1>You are logged out, ${req.session.login}</h1>`); 	 	
    		});

	
router
	   .route( '/profile/')
	        .get(checkAuth, (req,res)=>{
					    res .send(`<h1>Welcome, ${req.session.login}</h1>
					    <br><a href="/users/logout">Log out</a>`); 
	        });      			 
	  	            


router
	  .route('/:login')
	  		.delete((req, res ) => {
				  if (userData.users.length > 3 ) {
               
	   			 let removed = _.remove(userData.users, function(u){
	   	 			return u.login == req.params.login; 					
	    			});
	  			  j.writeFile(data, userData, err=>{
	    				if (err) throw(err);
	    		        res.send(`You removed login ${req.body.login} and password ${req.body.password} `);

	    		    });
	    		   } else {
	    		   	res.send('<h1>You cannot remove users any more!</h1>');
	    		   } 		  	  			
	  		} )
 			 .get (checkAuth, (req, res ) => {
				   let login = req.params.login,
 			          user = _.find(userData.users, {login});
 			      if (user) {
 			     	  res.send(`<h1>User: ${login}, password: ${user.password}</h1>`);
 			      }   
 			        else {
 			       	res.render('404', { text: "Not yet implemented"   } );
 			      } 
  				
 				 });

   return router;
};

