var express = require('express');
var router = express.Router();
var pool = require ('../config/dbConfig');
var dateFormat = require('dateformat');
var now = new Date();

router.get('/', function(req, res, next){
    var sess=req.session;
    pool.getConnection((err, conn) => {
    if(err){
        throw err;
    }
    console.log("DB Connection");

    var sql = "select noticeNum, noticeTitle, noticeAthor, kindName, date_format(noticeDate,'%y-%m-%d %T') AS CDATE, noticeSee from notice, kind where notice.kindNum = kind.kindNum AND notice.kindNum = 3 order by noticeNum desc";
    conn.query(sql, function(err, row) {
        if(err){
            throw err;
        }
        res.render('index', {page: './sub/notice.ejs', data : row, sess : sess});
    });
})
});

module.exports = router;