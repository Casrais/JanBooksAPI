

var express = require('express');
var https = require('https');
var react = require('react');
var mysql = require('mysql');
var fs = require('fs');
var helmet = require('helmet');
var bodyparser = require('body-parser');
var bcrypt = require('bcrypt');

//var location1 = document.location.pathname;
//var directoryPath = location1.substring(0, location1.lastIndexOf("/")+1);

const options = {
    key: fs.readFileSync("e:/Websites/Janbooks/JanBooksAPI/client-key.pem"),
    cert: fs.readFileSync("e:/Websites/Janbooks/JanBooksAPI/client-cert.pem"),
    ca: fs.readFileSync("e:/Websites/Janbooks/JanBooksAPI/server-ca.pem")
  };

var app = express();
app.use(helmet());
const router = app._router;

router.use(bodyparser.urlencoded({ extended: true }));
router.use(bodyparser.json());

var port = process.env.PORT || 8080;
https.createServer(options, app).listen(8080);
app.listen(8000);

var con = mysql.createConnection({
}});



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*'); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use('/assets', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.use('/', function (req, res, next) {
    console.log('Request Url:' + req.url);
    
    
    next();
});

app.get('/api/Author', function (req, res) {
    con.query('select * from jan.Author', function(err, rows) { 
        if (err) throw err;
        console.log(rows);
        res.json({rows});
    }) 
});

app.get('/api/Author/:AuthId', function (req, res) {
    con.query('select * from jan.Author where Authid = ?',[req.params.AuthId], function(err, rows) { 
        if (err) throw err;
        console.log(rows);
        res.json({rows});
    }) 
});

app.delete('/api/Author/', function (req, res) {
    con.query('delete from jan.BookAuthor where Authid = ?',[req.body.AuthId], function(err, rows) { 
        if (err) throw err;
        console.log(rows);
    });
    con.query('delete from jan.Author where Authid = ?',[req.body.AuthId], function(err, rows) { 
        if (err) throw err;
        console.log(rows);
        res.json({'Author': res.params.AuthId});
    })
});

app.post('/api/Author/', function (req, res) {
    console.log(req.body);
    var data = [req.body.FirstName, req.body.MiddleName, req.body.LastName, req.body.DOB, req.body.Bio];
    var SQL = "INSERT INTO jan.Author (FirstName, MiddleName, LastName, DOB, Bio) SELECT * from (select ?) as tmp WHERE NOT EXISTS (select * from jan.Author where FirstName = \'" + req.body.FirstName + "\' and LastName = \'" + req.body.LastName + "\' LIMIT 1)";
    var SQL2 = "UPDATE jan.Author SET MiddleName = \'" + req.body.MiddleName +"\', DOB = \'" + req.body.DOB +"\', Bio = \'" + req.body.Bio +"\' where FirstName = \'" + req.body.FirstName + "\' and LastName = \'" + req.body.LastName + "\' "
    console.log(SQL);
    con.query(SQL2,[data], function(err, rows) { 
        if (err) throw err;
        console.log('update success');
    })
    con.query(SQL,[data], function(err, rows) { 
        if (err) throw err;
        console.log(req.body);
        res.send("Number of records inserted: "+ res.rows);
    })
});

app.get('/api/Book', function (req, res) {
    con.query('select * from jan.Book', function(err, rows) { 
        if (err) throw err;
        console.log(rows);
        res.json({rows});
    }) 
});

app.get('/api/User', function (req, res) {
    var User = req.body.User;
    con.query('select UserId from jan.User where UserName = \'' + User + '\'', function(err, rows) { 
        if (err) throw err;
        console.log(rows);
        res.json({rows});
    }) 
});


app.get('/api/User/PWD/', function (req, result) {
    var User = req.body.UserId;
    var PWD = req.body.PWD;
    
    con.query('select PWD from jan.User where UserID = \'' + User + '\'', [PWD] , function(err, rows) { 
        if (err) throw err;
        var HashPass = rows[0].PWD;
        var SuccessorFail = bcrypt.compareSync(PWD, HashPass);
        console.log("SuccessorFail: " + SuccessorFail);
          if (SuccessorFail === true)
            result.send('success');
          else 
            result.send('failure');
    });
});

app.post('/api/User/', function (req, res) {
    console.log(req.body);
    var data = [req.body.User];
    var SQL = "INSERT INTO jan.User (UserName) SELECT * from (select ?) as tmp WHERE NOT EXISTS (select * from jan.User where UserName = \'" + req.body.User + "\' LIMIT 1)";
    console.log(SQL);
    con.query(SQL,[data], function(err, rows) { 
        if (err) throw err;
        console.log(req.body);
        res.send("Number of records inserted: "+ res.rows);
    })
});

app.post('/api/User/PWD/', function (req, res) {
    console.log(req.body);
    var UserId = req.body.UserId;
    var PWD = req.body.PWD;
    bcrypt
  .hash(PWD, 10)
  .then(hash => {
    console.log(`Hash: ${hash}`);
    var SQL = "Update jan.User set PWD = \'" + hash + "\' WHERE UserID = \'" + UserId + "\'";
    console.log(SQL);
    con.query(SQL,[data], function(err, rows) { 
        if (err) throw err;
        console.log(req.body);
        res.send("Number of records inserted: "+ res.rows);
    })
  })
  .catch(err => console.error(err.message));
    
});

app.get('/api/Book/:BookId', function (req, res) {
    con.query('select * from jan.Book where BookId = ?', [req.params.BookId], function(err, rows) { 
        if (err) throw err;
        console.log(rows);
        res.json({rows});
    }) 
});

app.delete('/api/Book/', function (req, res) {
    con.query('delete from jan.BookAuthor where BookId = ?', [req.body.BookId], function(err, rows) { 
        if (err) throw err;
        console.log(rows);
    }) 
    con.query('delete from jan.BookKeyWord where BookId = ?', [req.body.BookId], function(err, rows) { 
        if (err) throw err;
        console.log(rows);
    }) 
    con.query('delete from jan.Book where BookId = ?', [req.body.BookId], function(err, rows) { 
        if (err) throw err;
        console.log(rows);
        res.json({rows});
    }) 
});

app.post('/api/Book/', function (req, res) {
    console.log(req.body);
    var data = [
        req.body.Title, 
        req.body.SubTitle, 
        req.body.CopyrightDate, 
        req.body.CopyrightHolder, 
        req.body.Synopsis, 
        req.body.Quantity, 
        req.body.AmountSold,
        req.body.ISBN, 
        req.body.Price, 
        req.body.Rating];
    console.log([data])
    var SQL = "INSERT INTO jan.Book (Title,"+
        "SubTitle, "+
        "PublisherId, "+
        "CopyrightDate, "+
        "CopyrightHolder, "+
        "Synopsis, "+
        "Quantity, "+
        "AmountSold, "+
        "ISBN, "+
        "Available, "+
        "Price, "+
        "Rating) SELECT * from (select \'" + req.body.Title + "\' as Title,"+ 
        "\'" + req.body.SubTitle + "\' as SubTitle,"+ 
        "1 as PublisherId," +
        "\'" + req.body.CopyrightDate + "\' as CopyrightDate,"+ 
        "\'" + req.body.CopyrightHolder + "\' as CopyrightHolder,"+ 
        "\'" + req.body.Synopsis + "\' as Synopsis,"+ 
        "\'" + req.body.Quantity + "\' as Quantity,"+ 
        "\'" + req.body.AmountSold + "\' as AmountSold,"+ 
        "\'" + req.body.ISBN + "\' as ISBN,"+ 
        "\'" + req.body.Available + "\' as Available,"+ 
        "\'" + req.body.Price + "\' as Price,"+ 
        "\'" + req.body.Rating + "\' as Rating) as tmp WHERE NOT EXISTS (select ISBN from jan.Book where ISBN = \'" + req.body.ISBN + "\' LIMIT 1)";
    var SQL2 = "UPDATE jan.Book SET Title = \'" + req.body.Title +
    "\',SubTitle = \'" + req.body.SubTitle +
    "\', CopyrightDate = \'" + req.body.CopyrightDate +
    "\', CopyrightHolder = \'" + req.body.CopyrightHolder +
    "\', Synopsis = \'" + req.body.Synopsis +
    "\', Quantity = \'" + req.body.Quantity +
    "\', Available = \'" + req.body.Available +
    "\', Price = \'" + req.body.Price +
    "\', Rating = \'" + req.body.Rating +
    "\' where ISBN = \'" + req.body.ISBN + "\' "
    console.log(SQL);
    con.query(SQL2,[data], function(err, rows) { 
        if (err) throw err;
        console.log('update success');
    })
    con.query(SQL,[data], function(err, rows) { 
        if (err) throw err;
        console.log(req.body);
        res.json({rows});
    })
});

app.post('/api/Book/PublisherID/', function (req, res) {
    console.log(req.body);
    if (req.body.PublisherId !== null) {
        var data = [req.body.PublisherId];
        console.log([data])
        var SQL2 = "UPDATE jan.Book SET PublisherId = \'" + req.body.PublisherId + "\' where BookId = \'" + req.body.BookId +"\'"
        con.query(SQL2,[data], function(err, rows) { 
        if (err) { console.log(rows); throw err;}
        console.log('update success');
        res.send('success');
        })
    }
    
});

app.post('/api/Book/ThumbNail/', function (req, res) {
    console.log(req.body);
    var data = [req.body.ThumbNail];
    var SQL2 = "UPDATE jan.Book SET ThumbNail = \'" + req.body.ThumbNail +"\' where BookId = \'" + req.body.BookId + "\' "
    con.query(SQL2,[data], function(err, rows) { 
        if (err) throw err;
        console.log('update success');
    })
});

app.delete('/api/Book/ThumbNail/', function (req, res) {
    console.log(req.body);
    var data = [req.body.ThumbNail];
    var SQL2 = "UPDATE jan.Book SET ThumbNail = null where BookId = \'" + req.body.BookId + "\' "
    console.log(SQL);
    con.query(SQL2,[data], function(err, rows) { 
        if (err) throw err;
        console.log('update success');
    })
});

app.get('/api/Category', function (req, res) {
    con.query('select * from jan.Category', function(err, rows) { 
        if (err) throw err;
        console.log(rows);
        res.json({rows});
    }) 
});

app.get('/api/Category/:CategoryId', function (req, res) {
    con.query('select * from jan.Category where CategoryId = ?', [req.params.CategoryId], function(err, rows) { 
        if (err) throw err;
        console.log(rows);
        res.json({rows});
    }) 
});

app.delete('/api/Category/', function (req, res) {
    con.query('update jan.Book set CategoryId = null where CategoryId = ?', [req.body.CategoryId], function(err, rows) { 
        if (err) throw err;
        console.log(rows);
    }) 
    con.query('delete from jan.Category where CategoryId = ?', [req.body.CategoryId], function(err, rows) { 
        if (err) throw err;
        console.log(rows);
        res.json({rows});
    }) 
});

app.post('/api/Category/', function (req, res) {
    console.log(req.body);
    var data = [req.body.CategoryName, req.body.CategoryDesc];
    var SQL = "INSERT INTO jan.Category (CategoryName, CategoryDesc) SELECT * from (select \'" + req.body.CategoryName + "\' as CategoryName,"+ 
    "\'" + req.body.CategoryDesc + "\' as CategoryDesc) as tmp WHERE NOT EXISTS (select * from jan.Category where CategoryName = \'" + req.body.CategoryName + "\' LIMIT 1)";
    var SQL2 = "UPDATE jan.Category SET CategoryDesc = \'" + req.body.CategoryDesc +"\' where CategoryName = \'" + req.body.CategoryName + "\' "
    console.log(SQL);
    con.query(SQL2,[data], function(err, rows) { 
        if (err) throw err;
        console.log('update success');
    })
    con.query(SQL,[data], function(err, rows) { 
        if (err) throw err;
        console.log(req.body);
        res.send("Number of records inserted: "+ res.rows);
    })
});

app.get('/api/Publisher', function (req, res) {
    con.query('select * from jan.Publisher', function(err, rows) { 
        if (err) throw err;
        console.log(rows);
        res.json({rows});
    }) 
});

app.get('/api/Publisher/:PublisherId', function (req, res) {
    con.query('select * from jan.Publisher where PublisherId = ?', [req.params.PublisherId], function(err, rows) { 
        if (err) throw err;
        console.log(rows);
        res.json({rows});
    }) 
});

app.delete('/api/Publisher/', function (req, res) {
    con.query('update jan.Book set PublisherId = null where PublisherId = ?', [req.body.PublisherId], function(err, rows) { 
        if (err) throw err;
        console.log(rows);
    }) 
    con.query('delete from jan.Publisher where PublisherId = ?', [req.body.PublisherId], function(err, rows) { 
        if (err) throw err;
        console.log(rows);
        res.json({rows});
    }) 
});

app.post('/api/Publisher/', function (req, res) {
    console.log(req.body);
    var data = [req.body.PublisherName, req.body.Location];
    var SQL = "INSERT INTO jan.Publisher (PublisherName, Location) SELECT * from (select ?) as tmp WHERE NOT EXISTS (select * from jan.Publisher where PublisherName = \'" + req.body.PublisherName + "\' LIMIT 1)";
    var SQL2 = "UPDATE jan.Publisher SET Location = \'" + req.body.Location +"\' where PublisherName = \'" + req.body.PublisherName + "\' "
    console.log(SQL);
    con.query(SQL2,[data], function(err, rows) { 
        if (err) throw err;
        console.log('update success');
    })
    con.query(SQL,[data], function(err, rows) { 
        if (err) throw err;
        console.log(req.body);
        res.send("Number of records inserted: "+ res.rows);
    })
});

app.get('/api/KeyWord', function (req, res) {
    con.query('select * from jan.KeyWord', function(err, rows) { 
        if (err) throw err;
        console.log(rows);
        res.json({rows});
    }) 
});

app.post('/api/KeyWord/', function (req, res) {
    console.log(req.body);
    var data = [req.body.KeyWord];
    var SQL = "INSERT INTO jan.KeyWord (KeyWord) SELECT * from (select ?) as tmp WHERE NOT EXISTS (select * from jan.KeyWord where KeyWord = \'" + req.body.KeyWord + "\' LIMIT 1)";
    console.log(SQL);
    con.query(SQL,[data], function(err, rows) { 
        if (err) throw err;
        console.log(req.body);
        res.send("Number of records inserted: "+ res.rows);
    })
});

app.post('/api/BookCategory/', function (req, res) {
    console.log(req.body);
    var data = [req.body.CategoryId];
    var SQL = "UPDATE jan.Book SET CategoryId = \'" +req.body.CategoryId + "\' WHERE BookId = "+req.body.BookId + "\'";
    console.log(SQL);
    con.query(SQL,[data], function(err, rows) { 
        if (err) throw err;
        console.log(req.body);
        res.send("Number of records inserted: "+ res.rows);
    })
});


app.get('/api/KeyWord/:KeyWordId', function (req, res) {
    con.query('select * from jan.KeyWord where KeyWordId = ?',[req.params.KeyWordId], function(err, rows) { 
        if (err) throw err;
        console.log(rows);
        res.json({rows});
    }) 
});

app.post('/api/BookKeyWord/', function (req, res) {
    console.log(req.body);
    var data = [req.body.BookId, req.body.KeyWordId];
    var SQL = "INSERT INTO jan.BookKeyWord (BookId, KeyWordId) SELECT * from (select \'" + req.body.BookId + "\' as BookId, \'" + req.body.KeyWordId + "\' as KeyWordId ) as tmp WHERE NOT EXISTS (select * from jan.BookKeyWord where KeyWordId = \'" + req.body.KeyWordId + "\' and BookId = \'" + req.body.BookId + "\' LIMIT 1)";
    console.log(SQL);
    con.query(SQL,[data], function(err, rows) { 
        if (err) throw err;
        console.log(req.body);
        res.send("Number of records inserted: "+ res.rows);
    })
});

app.delete('/api/KeyWord/', function (req, res) {
    con.query('delete from jan.BookKeyWord where KeyWordId = ?',[req.body.KeyWordId], function(err, rows) { 
        if (err) throw err;
        console.log(rows);
    }) 
    con.query('delete from jan.KeyWord where KeyWordId = ?',[req.body.KeyWordId], function(err, rows) { 
        if (err) throw err;
        console.log(rows);
        res.json({rows});
    }) 
});


//var port = process.env.PORT || 3000;


