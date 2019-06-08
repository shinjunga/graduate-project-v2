var express = require('express');
var router = express.Router();
var pool = require("../config/dbConfig");

/* GET home page. */
router.get('/', function(req, res, next) {
  var sess=req.session;
  pool.getConnection((err, conn) => {
    if(err){
        throw err;
    }
    console.log("DB Connection");

    var sql = "select noticeNum, noticeTitle, noticeAthor, kindName, date_format(noticeDate,'%y-%m-%d %T') AS CDATE, noticeSee from notice, kind where notice.kindNum = kind.kindNum order by noticeNum desc";
    conn.query(sql, function(err, row) {
        if(err){
            throw err;
        }
        res.render('index', {page: './sub/main.ejs', data : row, sess : sess});
  });
})
});

router.get('/Detail/:noticeNum', function(req, res, next){
  var sess=req.session;
  var noticeNum = req.params.noticeNum;
  pool.getConnection((err, conn) => {
  if(err){
      throw err;
  }
  console.log("DB Connection");

  var sql = "select noticeNum, notice.userId, noticeTitle, noticeContent, noticeAthor, kindName, date_format(noticeDate,'%y-%m-%d %T') AS CDATE, noticeSee from notice, kind where notice.kindNum = kind.kindNum AND noticeNum = ?";
  conn.query(sql,[noticeNum],function(err, row) {
      if(err){
          throw err;
      }
      else{
        var sql = "update notice set noticeSee = noticeSee + 1 where noticeNum = ?";
        conn.query(sql, [noticeNum], function(err, result){
          if(err)
          {
            throw err;
          }
        });
      }
     res.render('index', {page: './sub/Detail', data : row, sess : sess});
  });
})
});

router.get('/Insert', function(req, res, next){
  var sess = req.session;
  res.render('index', {page: './sub/Insert', sess: sess});
});

router.post('/Insert', function (req, res, next){
  var sess = req.session;
  var body = req.body;
  pool.getConnection((err, conn) => {
    if(err){
      throw err;
    }
    console.log("DB Connection");
  var sql = "select noticeNum, notice.kindNum, notice.userId, noticeTitle, noticeContent, noticeAthor, kindName, now(), noticeSee from notice, kind, user where notice.kindNum = kind.kindNum AND notice.noticeTitle AND notice.noticeNum";
  conn.query(sql, [req.body.noticeNum], function (err, row) {
    if (err) {
      throw err;
    }
    if(row.length === 0)
    {
      var sql = "insert into notice(kindNum, userId, noticeTitle, noticeAthor, noticeContent, noticeSee) values(?, ?, ?, ?, ?, ?)";
      conn.query(sql, [req.body.kindNum, req.body.userId, req.body.noticeTitle, req.body.noticeAthor, req.body.noticeContent, req.body.noticeSee], function(err, result){
        if(err)
        {
          throw err;
        }
        if(result)
        {
          sess.info = row[0];
          res.writeHead(200, {"content-type": "text/html; charset=utf-8"});
          res.write("<script>alert('게시물이 등록되었습니다.');location.href='/';</script>")
        }
        else
        {
          res.writeHead(200, {"content-type": "text/html; charset=utf-8"});
          res.write("<script>alert('게시물 등록이 완료되지 않았습니다.');history.back();</script>")
        }
      });
    }
    else
    {
      res.writeHead(200, {"content-type": "text/html; charset=utf-8"});
      res.write("<script>alert('중복된 게시물입니다.');history.back();</script>")
    }
  });
})
});//받는 데이터

router.get('/Delete/:noticeNum', function (req, res, next) {
  // res.send(req.params);
  var  noticeNum = req.params.noticeNum;
  pool.getConnection((err, conn) => {
    if(err){
      throw err;
    }
    console.log("DB Connection");
  var sql = "delete from notice where noticeNum = ?";
  conn.query(sql, [noticeNum], function (err, result) {
      if (err) {
          throw err;
      }
      if (result) {
          res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
          res.write("<script>alert('삭제가 완료되었습니다.');location.href='/';</script>")//
      }
      else {
          res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
          res.write("<script>alert('삭제가 되지 않았습니다.');history.back();</script>")//
      }
  });
})
});

// router.get('/Modify', function(req, res, next){
//   var sess = req.session;
//   var noticeNum = req.params.noticeNum;
//   pool.getConnection((err, conn) => {
//     if(err)
//     {
//       throw err;
//     }
//     console.log("DB Connection");
  
//     var sql = "update notice set kindNum = ?, noticeTitle = ?, noticeAthor = ?, noticeContent = ?, noticeSee = ? where noticeNum = ?";
//     conn.query(sql, [req.params.kindNum, req.params.noticeTitle, req.params.noticeAthor, req.params.noticeContent, req.params.noticeSee, noticeNum], function (err, result){
//       if(err){
//         throw err;
//       }
//     });
//   res.render('index', {page: './sub/Modify', data : result, sess: sess});
//   })
// });

router.get('/Modify/:noticeNum', function(req, res, next){
  var sess = req.session;
  var noticeNum = req.params.noticeNum;
  pool.getConnection((err, conn) => {
    if(err)
    {
      throw err;
    }
    console.log("DB Connection");
  
    var sql = "select noticeNum, noticeTitle, noticeAthor, kindName, date_format(noticeDate,'%y-%m-%d %T') AS CDATE, noticeSee from notice, kind where notice.kindNum = kind.kindNum order by noticeNum desc";
    conn.query(sql, [noticeNum], function (err, result){
      if(err){
        throw err;
      }
      res.render('index', {page: './sub/Modify', data : result, sess: sess}
      );
    });
  })
});


router.post('/Modify/:noticeNum', function (req, res, next) {
  var sess = req.session;
  var noticeNum = req.params.noticeNum;
  pool.getConnection((err, conn) => {
    if(err){
      throw err;
    }
    console.log("DB Connection");
    
  var sql = "update notice set kindNum = ?, noticeTitle = ?, noticeAthor = ?, noticeContent = ?, noticeSee = ? where noticeNum = ?";
  conn.query(sql, [req.body.kindNum, req.body.noticeTitle, req.body.noticeAthor, req.body.noticeContent, req.body.noticeSee, noticeNum], function (err, result) {
      if (err) {
          throw err;
      }       
       res.send(`<script> alert('수정이 완료되었습니다');  history.go(-2);  </script>`);
  });
})
});//받는 데이터

router.get('/Mypage/:userId', function(req, res, next) {
  var sess=req.session;
  pool.getConnection((err, conn) => {
    if(err){
        throw err;
    }
    console.log("DB Connection");

    var sql = "select keywordNum, kindName, keyword.userId, keywordName, date_format(keywordDate,'%y-%m-%d %T') AS CDATE, keywordAthor from keyword, user, kind where keyword.userId = user.userId AND keyword.kindNum = kind.kindNum order by keywordNum desc";
    conn.query(sql, function(err, row) {
        if(err){
            throw err;
        }
        res.render('index', {page: './sub/Mypage.ejs', data : row, sess : sess});
  });
})
});



router.post('/insertKeyword', function (req, res, next){
  var sess = req.session;
  pool.getConnection((err, conn) => {
    if(err){
      throw err;
    }
    console.log("DB Connection");
  var sql = "select keywordNum, kindNum, userId, keywordName, now(), keywordAthor from keyword where keywordNum = ?";
  conn.query(sql, [req.body.keywordNum], function (err, row) {
    if (err) {
      throw err;
    }
    if(row.length === 0)
    {
      var sql = "insert into keyword(kindNum, userId, keywordName, keywordAthor) values(?, ?, ?, ?)";
      conn.query(sql, [req.body.kindNum, req.session.info.userId ,req.body.keywordName, req.session.info.userName], function(err, result){
        if(err)
        {
          throw err;
        }
        if(result)
        {
          sess.info = row[0];
          res.writeHead(200, {"content-type": "text/html; charset=utf-8"});
          res.write("<script>alert('키워드가 등록되었습니다.');location.href='/';</script>")
        }
        else
        {
          res.writeHead(200, {"content-type": "text/html; charset=utf-8"});
          res.write("<script>alert('키워드 등록이 완료되지 않았습니다.');history.back();</script>")
        }
      });
    }
    else
    {
      res.writeHead(200, {"content-type": "text/html; charset=utf-8"});
      res.write("<script>alert('중복된 키워드입니다.');history.back();</script>")
    }
  });
})
});//받는 데이터


router.get('/deleteKeyword/:keywordNum', function (req, res, next) {
  // res.send(req.params);
  var  keywordNum = req.params.keywordNum;
  pool.getConnection((err, conn) => {
    if(err){
      throw err;
    }
    console.log("DB Connection");
  var sql = "delete from keyword where keywordNum = ?";
  conn.query(sql, [keywordNum], function (err, result) {
      if (err) {
          throw err;
      }
      if (result) {
          res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
          res.write("<script>alert('삭제가 완료되었습니다.');location.href='/';</script>")//
      }
      else {
          res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
          res.write("<script>alert('삭제가 되지 않았습니다.');history.back();</script>")//
      }
  });
})
});


router.post('/login', function (req, res, next) {
  var sess = req.session;
  pool.getConnection((err, conn) => {
    if(err)
    {
      throw err;
    }
      var sql = "select * From user where userId = ? AND userPass = ? AND userCheck = ?";
      conn.query (sql, [req.body.userId, req.body.userPass, req.body.userCheck], (err, row) => {
        if(err)
        {
          res.send(300, {
            result: 0,
            msg: 'DB Error'
          });
        }
        if(row.length === 0)
        {
          res.send(`<script> alert('로그인에 실패하였습니다.');  history.back();  </script>`);
        }
        else{
          sess.info = row[0];
          res.redirect('/');
        }
      });
  })
});//로그인 요청

router.get('/login', function(req, res, next){
  var sess = req.session;
  res.render('index', {page: './login', sess: sess});
});//로그인 페이지 요청?

router.get('/logout', function(req, res, next){
  var sess = req.session;
  sess.destroy();
  res.redirect('/');
});//로그아웃 요청

router.get('/join', function(req, res, next){
  var sess = req.session;
  res.render('index', {page: './join', sess: sess});
});//회원가입 페이지 요청

router.post('/join', function(req, res, next){
  var sess = req.session;
  pool.getConnection(function(err, conn) {
    if(err)
    {
      throw err;
    }
    var sql = "select * from user where userId = ?";
    conn.query(sql, [req.body.userId], (err, row) => {
      if(err)
      {
        throw err;
      }
      if(row.length === 0)
      {
        var sql = "insert into user values (?, ?, ?, ?)";
        conn.query(sql, [req.body.userId, req.body.userPass, req.body.userCheck, req.body.userName], function(err, row) {
          conn.release();
          if(err)
          {
            throw err;
          }
          res.render("index", {page:'./login', sess: sess});
        });
      }
      else
      {
        res.send("<script>alert('중복된 아이디입니다.');history.back();</script>");
      }
    });//회원가입 요청
  })
});

module.exports = router;