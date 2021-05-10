const express = require('express');
const mysql = require('mysql');
const constant = require('./const.js');
const cors = require('cors');
const app = express();
// 引入cors解决跨域请求问题
app.use(cors());


// 调用方法
app.get('/', (req, res) => {
    res.send(new Date().toDateString());
})

// 连接数据库
function connect() {
    /*
        数据库获取的信息有：
        id 图书id
        fileName 图书文件名称
        cover 图书封面
        title 图书标题
        author 图书作者
        publisher 图书出版社
        bookId 图书文件ID
        category 学科ID
        categoryText 学科名
        language 所属语言
        rootFile 解析的OPF文件
     */
    return mysql.createConnection({
        host: constant.dbHost,      // 本地localhost
        user: constant.dbUser,      // root
        password: constant.dbPwd,   // 123456
        database: 'book'           // 数据库名称
    })
}

// 加工传递的图书至猜你喜欢栏目
function createGuessYouLike(data) {
    // 猜你喜欢最底部的文字有3种选择
    // 随机生成 1-3 的数字
    const n = 1 * randomArray(3, 1) + 1;
    data['type'] = n;
    switch (n) {
        case 1:
            data["type"] = n;
            data["result"] = data.id % 2 === 0 ? "《Excuting Magic》" : "《Elements of Robotics》";
            break;
        case 2:
            data["type"] = n;
            data["result"] = data.id % 2 === 0 ? "《Improving Psychiatric Care》" : "《Programming Languages》";
            break;
        case 3:
            data["type"] = n;
            data["result"] = "《Living with Disfigurment》";
            data["percent"] = data.id % 2 === 0 ? "92%" : "98%";
            break;
        default:
            break;
    }
    return data;
}

// 加工传递的图书至热门推荐栏目
function createRecommendData(data) {
    // 随机生成 xxxx人同时阅读
    data['readers'] = Math.floor(data.id / 2 * randomArray(100, 1));
    return data;
}

// 在所有图书【total】中随机挑选【number】本书
function randomArray(total, number) {
    let randomBooks = [];
    for (let i = 0; i < number; i++) {
        // 获取图书ID号
        randomBooks.push(Math.floor(Math.random() * total));
    }
    return randomBooks;
}

// 随机获取n个分类ID ==> 具体分类栏目中
function createCategoryIds(n) {
    const arr = [];
    constant.category.forEach((item, index) => {
        arr.push(index + 1);
    });
    const result = [];
    for (let i = 0; i < n; i++) {
        let ran;
        // 如果获取到了相同的ID值就重新获取【result 里面有】，直到不是相同的
        do {
            ran = Math.floor(Math.random() * arr.length);
        } while (result.indexOf(arr[ran]) > -1)
        result.push(arr[ran]);
    }
    // 获取几个学科的数组
    return result;
}

// 获取各个学科数据
function createCategoryData(data) {
    const categoryIds = createCategoryIds(6);
    const result = [];
    categoryIds.forEach(categoryId => {
        // 获取当前分类列表里面的前4本图书
        const subList = data.filter(item => item.category === categoryId).slice(0, 4);
        // 给每本图书添加必要状态
        subList.map(item => {
            return handleData(item);
        });
        // 添加进返回结果
        result.push({
            // 分类学科ID
            category: categoryId,
            // 分类学科图书列表
            list: subList
        })
    });
    // 有些学科里面的数据没有4本书，这时候就只返回4本书的
    return result.filter(item => item.list.length === 4);
}

// 根据 results => 数据库查询出来的图书和 key 找到指定的书籍
function createData(results, key) {
    return handleData(results[key]);
}

// 处理图书数据，设置一些图书状态
function handleData(data) {
    // 随机指定的书籍数据 => data
    // 获取封面 => 如果是请求图片
    if (!data.cover.startsWith("http://")) {
        data["cover"] = `${constant.resUrl}/img${data.cover}`;
    }
    // 设置图书选中状态为关闭
    data["selected"] = false;
    // 设置图书私密阅读为关闭
    data["private"] = false;
    // 设置图书缓存为关闭
    data["cache"] = false;
    // 设置是否阅读为否 => 时长
    data["haveRead"] = 0;
    return data;
}

// 书城首页接口
app.get('/book/home', (req, res) => {
    // 连接数据库
    const conn = connect();
    // 编写SQL语句
    const sql = "select * from book where cover != \'\'";
    // 查询数据库获取信息
    conn.query(sql, (err, results) => {
        // 获取查询结果长度
        const length = results.length;
        // 获取随机推荐数据
        const random = [];
        // 获取背景图片数据
        const banner = constant.resUrl + '/home_banner.jpg';
        // 获取猜你喜欢栏目数据
        const guessYouLike = [];
        // 获取热门推荐数据
        const recommend = [];
        // 获取精选数据
        const featured = [];
        // 获取各学科分类数据
        const categoryList = [];
        // 获取具体学科分类数据 => 只是个展示，不显示具体的图书，所以这里自定义数据共22个学科
        const categories = [
            {
                category: 1,
                num: 56,
                img1: constant.resUrl + '/cover/cs/A978-3-319-62533-1_CoverFigure.jpg',
                img2: constant.resUrl + '/cover/cs/A978-3-319-89366-2_CoverFigure.jpg'
            },
            {
                category: 2,
                num: 51,
                img1: constant.resUrl + '/cover/ss/A978-3-319-61291-1_CoverFigure.jpg',
                img2: constant.resUrl + '/cover/ss/A978-3-319-69299-9_CoverFigure.jpg'
            },
            {
                category: 3,
                num: 32,
                img1: constant.resUrl + '/cover/eco/A978-3-319-69772-7_CoverFigure.jpg',
                img2: constant.resUrl + '/cover/eco/A978-3-319-76222-7_CoverFigure.jpg'
            },
            {
                category: 4,
                num: 60,
                img1: constant.resUrl + '/cover/edu/A978-981-13-0194-0_CoverFigure.jpg',
                img2: constant.resUrl + '/cover/edu/978-3-319-72170-5_CoverFigure.jpg'
            },
            {
                category: 5,
                num: 23,
                img1: constant.resUrl + '/cover/eng/A978-3-319-39889-1_CoverFigure.jpg',
                img2: constant.resUrl + '/cover/eng/A978-3-319-00026-8_CoverFigure.jpg'
            },
            {
                category: 6,
                num: 42,
                img1: constant.resUrl + '/cover/env/A978-3-319-12039-3_CoverFigure.jpg',
                img2: constant.resUrl + '/cover/env/A978-4-431-54340-4_CoverFigure.jpg'
            },
            {
                category: 7,
                num: 7,
                img1: constant.resUrl + '/cover/geo/A978-3-319-56091-5_CoverFigure.jpg',
                img2: constant.resUrl + '/cover/geo/978-3-319-75593-9_CoverFigure.jpg'
            },
            {
                category: 8,
                num: 18,
                img1: constant.resUrl + '/cover/his/978-3-319-65244-3_CoverFigure.jpg',
                img2: constant.resUrl + '/cover/his/978-3-319-92964-4_CoverFigure.jpg'
            },
            {
                category: 9,
                num: 13,
                img1: constant.resUrl + '/cover/law/2015_Book_ProtectingTheRightsOfPeopleWit.jpeg',
                img2: constant.resUrl + '/cover/law/2016_Book_ReconsideringConstitutionalFor.jpeg'
            },
            {
                category: 10,
                num: 24,
                img1: constant.resUrl + '/cover/ls/A978-3-319-27288-7_CoverFigure.jpg',
                img2: constant.resUrl + '/cover/ls/A978-1-4939-3743-1_CoverFigure.jpg'
            },
            {
                category: 11,
                num: 6,
                img1: constant.resUrl + '/cover/lit/2015_humanities.jpg',
                img2: constant.resUrl + '/cover/lit/A978-3-319-44388-1_CoverFigure_HTML.jpg'
            },
            {
                category: 12,
                num: 14,
                img1: constant.resUrl + '/cover/bio/2016_Book_ATimeForMetabolismAndHormones.jpeg',
                img2: constant.resUrl + '/cover/bio/2017_Book_SnowSportsTraumaAndSafety.jpeg'
            },
            {
                category: 13,
                num: 16,
                img1: constant.resUrl + '/cover/bm/2017_Book_FashionFigures.jpeg',
                img2: constant.resUrl + '/cover/bm/2018_Book_HeterogeneityHighPerformanceCo.jpeg'
            },
            {
                category: 14,
                num: 16,
                img1: constant.resUrl + '/cover/es/2017_Book_AdvancingCultureOfLivingWithLa.jpeg',
                img2: constant.resUrl + '/cover/es/2017_Book_ChinaSGasDevelopmentStrategies.jpeg'
            },
            {
                category: 15,
                num: 2,
                img1: constant.resUrl + '/cover/ms/2018_Book_ProceedingsOfTheScientific-Pra.jpeg',
                img2: constant.resUrl + '/cover/ms/2018_Book_ProceedingsOfTheScientific-Pra.jpeg'
            },
            {
                category: 16,
                num: 9,
                img1: constant.resUrl + '/cover/mat/2016_Book_AdvancesInDiscreteDifferential.jpeg',
                img2: constant.resUrl + '/cover/mat/2016_Book_ComputingCharacterizationsOfDr.jpeg'
            },
            {
                category: 17,
                num: 20,
                img1: constant.resUrl + '/cover/map/2013_Book_TheSouthTexasHealthStatusRevie.jpeg',
                img2: constant.resUrl + '/cover/map/2016_Book_SecondaryAnalysisOfElectronicH.jpeg'
            },
            {
                category: 18,
                num: 16,
                img1: constant.resUrl + '/cover/phi/2015_Book_TheOnlifeManifesto.jpeg',
                img2: constant.resUrl + '/cover/phi/2017_Book_Anti-VivisectionAndTheProfessi.jpeg'
            },
            {
                category: 19,
                num: 10,
                img1: constant.resUrl + '/cover/phy/2016_Book_OpticsInOurTime.jpeg',
                img2: constant.resUrl + '/cover/phy/2017_Book_InterferometryAndSynthesisInRa.jpeg'
            },
            {
                category: 20,
                num: 26,
                img1: constant.resUrl + '/cover/psa/2016_Book_EnvironmentalGovernanceInLatin.jpeg',
                img2: constant.resUrl + '/cover/psa/2017_Book_RisingPowersAndPeacebuilding.jpeg'
            },
            {
                category: 21,
                num: 3,
                img1: constant.resUrl + '/cover/psy/2015_Book_PromotingSocialDialogueInEurop.jpeg',
                img2: constant.resUrl + '/cover/psy/2015_Book_RethinkingInterdisciplinarityA.jpeg'
            },
            {
                category: 22,
                num: 1,
                img1: constant.resUrl + '/cover/sta/2013_Book_ShipAndOffshoreStructureDesign.jpeg',
                img2: constant.resUrl + '/cover/sta/2013_Book_ShipAndOffshoreStructureDesign.jpeg'
            }
        ];
        // 随机推荐栏目
        randomArray(length, 1).forEach(key => {
            random.push(createData(results, key))
        });
        // 猜你喜欢栏目获取 9 本图书
        randomArray(length, 9).forEach(key => {
            // 封装进猜你喜欢栏目
            guessYouLike.push(createGuessYouLike(createData(results, key)));
        });
        // 热门推荐栏目
        randomArray(length, 3).forEach(key => {
            recommend.push(createRecommendData(createData(results, key)));
        });
        // 精选模块
        randomArray(length, 6).forEach(key => {
            featured.push(createData(results, key));
        });
        // 分类学科
        categoryList.push(...createCategoryData(results));
        //返回JSON格式数据
        res.json({
            random,
            banner,
            guessYouLike,
            recommend,
            featured,
            categoryList,
            categories
        });
    })
    // 断开数据库连接
    conn.end();
});

// 书城书架接口
app.get('/book/shelf', (req, res) => {
    res.json({
        bookList: []
    })
})

// 图书详情接口
app.get('/book/detail', (req, res) => {
    const conn = connect();
    // 获取URL地址栏中的fileName
    const fileName = req.query.fileName;
    // 编写SQL语句
    const sql = `select * from book where fileName = '${fileName}'`;
    // 查询数据
    conn.query(sql, (err, results) => {
        // 查询失败的情况
        if (err) {
            res.json({
                error_code: 1,
                msg: '电子书详情页数据获取失败'
            })
        } else {
            // 如果查询成功但是查询的结果数据没有，长度为0，也认为是失败情况
            if (results && results.length === 0) {
                res.json({
                    error_code: 1,
                    msg: '电子书详情页数据获取失败'
                })
            } else {
                // 查询成功的情况
                // 获取第一本书，对其进行封装添加一些必要的状态加工
                const book = handleData(results[0]);
                res.json({
                    error_code: 0,
                    msg: '电子书详情页数据获取成功',
                    data: book
                })
            }
        }
    })
    // 断开数据库连接
    conn.end();
})

// 图书列表[分类栏目]中点击查看全部分类时展现所有图书的接口
app.get('/book/list', (req, res) => {
    // 连接数据库
    const conn = connect();
    // 编写 SQL 语句
    const sql = "select * from book where cover!=\'\'";
    // 查询数据
    conn.query(sql, (err, results) => {
        // 查询失败的情况
        if (err) {
            res.json({
                error_code: 1,
                msg: '获取全部类目数据失败'
            })
        } else {
            // 查询成功的情况
            const data = {};
            // 为每本书添加必要的状态
            results.map(item => handleData(item));
            constant.category.forEach(categoryText => {
                // 获取分类名称
                data[categoryText] = results.filter(item => item.categoryText === categoryText);
            })
            // 返回 data
            res.json({
                error_code: 0,
                msg: '获取全部类目数据成功',
                data: data,
                total: results.length
            });
        }
    });
    // 断开数据库连接
    conn.end();
})

// 获取全部书籍数据
app.get('/book/flat-list', (req, res) => {
    // 连接数据库
    const conn = connect();
    // 编写SQL语句
    const sql = "select * from book where cover != \'\'";
    conn.query(sql, (err, results) => {
        // 查询失败的情况
        if (err) {
            res.json({
                error_code: 1,
                msg: '获取全部书籍数据失败'
            })
        } else {
            results.map(item => handleData(item));
            res.json({
                error_code: 0,
                msg: '获取全部书籍数据成功',
                data: results,
                total: results.length
            })
        }
    })
    // 断开数据库连接
    conn.end();
})

// 听书接口（暂时不做）
app.get('/voice', (req, res) => {
})

// 监听窗口，开启服务器
const server = app.listen(7070, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log("服务器开启成功！");
});
